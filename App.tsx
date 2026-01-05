import React, { useState, useCallback } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { ChatInterface } from './components/ChatInterface';
import { ResultSummary } from './components/ResultSummary';
import { GameState, INITIAL_SCORES, TurnData, Level } from './types';
import { startAssessment, evaluateAndProgress } from './services/gemini';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'onboarding',
    currentTurnIndex: 0,
    totalQuestions: 10,
    history: [],
    industry: '',
    productType: '',
    currentLevel: 'APM',
    currentScores: INITIAL_SCORES
  });

  const [pendingNextTurn, setPendingNextTurn] = useState<TurnData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async (industry: string, product: string, questionCount: number, startingLevel: Level) => {
    setIsLoading(true);
    try {
      const firstQuestion = await startAssessment(industry, product, startingLevel);
      
      const firstTurn: TurnData = {
        question: firstQuestion,
        overallScores: INITIAL_SCORES,
        level: startingLevel,
        reasoning: "Initial State"
      };

      setGameState(prev => ({
        ...prev,
        status: 'playing',
        industry,
        productType: product,
        totalQuestions: questionCount,
        currentLevel: startingLevel,
        history: [firstTurn]
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to start assessment. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    if (gameState.status !== 'playing') return;

    // 1. Optimistically update local state with user answer for UI feedback
    const currentHistory = [...gameState.history];
    const lastTurnIndex = currentHistory.length - 1;
    currentHistory[lastTurnIndex].userAnswer = answer;

    setGameState(prev => ({
      ...prev,
      history: currentHistory
    }));

    setIsLoading(true);

    try {
      // 2. Call AI
      const aiResponse = await evaluateAndProgress(
        currentHistory,
        answer,
        gameState.industry,
        gameState.productType
      );

      // Handle Guardrails
      if (aiResponse.action === 'REJECT') {
        alert(aiResponse.feedback);
        // Revert the history - remove the irrelevant answer so it's not in context
        const revertedHistory = [...gameState.history];
        revertedHistory[lastTurnIndex].userAnswer = undefined;
        
        setGameState(prev => ({
            ...prev,
            history: revertedHistory
        }));
        setIsLoading(false);
        return;
      }

      if (aiResponse.action === 'PROVIDE_DATA') {
        // User asked for data. We append the context to the current question and let them try again.
        // We do NOT advance the turn index.
        const updatedHistory = [...gameState.history];
        
        // Format the injected context clearly
        const additionalContext = `\n\n> *Candidate asked: "${answer}"*\n\n> *Information provided: ${aiResponse.feedback}*`;
        
        updatedHistory[lastTurnIndex].question += additionalContext;
        updatedHistory[lastTurnIndex].userAnswer = undefined; // Clear answer so user can reply to the new context
        
        setGameState(prev => ({
            ...prev,
            history: updatedHistory
        }));
        setIsLoading(false);
        return;
      }

      // Handle Normal Evaluation
      // 3. Update state with evaluation
      const updatedHistory = [...currentHistory];
      updatedHistory[lastTurnIndex].feedback = aiResponse.feedback;
      updatedHistory[lastTurnIndex].reasoning = aiResponse.reasoning;
      updatedHistory[lastTurnIndex].overallScores = aiResponse.scores; // Update scores for this turn record
      updatedHistory[lastTurnIndex].level = aiResponse.level; // Update level for this turn record
      
      // Check for Game Over based on totalQuestions
      const isGameOver = gameState.currentTurnIndex >= gameState.totalQuestions - 1;

      if (isGameOver) {
         setGameState(prev => ({
            ...prev,
            status: 'finished',
            currentLevel: aiResponse.level,
            currentScores: aiResponse.scores,
            history: updatedHistory
         }));
      } else {
        // Prepare Next Turn but DO NOT add to history yet.
        // Wait for user to review feedback.
        const nextTurn: TurnData = {
            question: aiResponse.nextQuestion,
            overallScores: aiResponse.scores,
            level: aiResponse.level,
            reasoning: aiResponse.reasoning
        };

        setPendingNextTurn(nextTurn);
        
        setGameState(prev => ({
            ...prev,
            currentLevel: aiResponse.level,
            currentScores: aiResponse.scores,
            history: updatedHistory
        }));
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong analyzing your answer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (pendingNextTurn) {
        setGameState(prev => ({
            ...prev,
            currentTurnIndex: prev.currentTurnIndex + 1,
            history: [...prev.history, pendingNextTurn]
        }));
        setPendingNextTurn(null);
    }
  };

  const handleReset = () => {
    setGameState({
        status: 'onboarding',
        currentTurnIndex: 0,
        totalQuestions: 10,
        history: [],
        industry: '',
        productType: '',
        currentLevel: 'APM',
        currentScores: INITIAL_SCORES
    });
    setPendingNextTurn(null);
  };

  if (gameState.status === 'onboarding') {
    return <Onboarding onStart={handleStart} isLoading={isLoading} />;
  }

  if (gameState.status === 'finished') {
    return <ResultSummary state={gameState} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-200">
      <Dashboard 
        scores={gameState.currentScores} 
        level={gameState.currentLevel} 
        turnIndex={gameState.currentTurnIndex + 1}
        totalQuestions={gameState.totalQuestions}
      />
      
      <ChatInterface 
        currentTurn={gameState.history[gameState.history.length - 1]} 
        history={gameState.history}
        onAnswer={handleAnswer}
        onNext={handleNextQuestion}
        isLoading={isLoading}
        isGameOver={false}
      />
    </div>
  );
};

export default App;