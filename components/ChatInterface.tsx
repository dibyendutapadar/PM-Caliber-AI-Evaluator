import React, { useState, useEffect, useRef } from 'react';
import { TurnData, Level, PillarScores } from '../types';
import { Send, User, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  currentTurn: TurnData | null;
  history: TurnData[];
  onAnswer: (answer: string) => void;
  isLoading: boolean;
  isGameOver: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  currentTurn, 
  history, 
  onAnswer, 
  isLoading,
  isGameOver 
}) => {
  const [userInput, setUserInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, currentTurn, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    onAnswer(userInput);
    setUserInput('');
  };

  return (
    <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full p-4 gap-6 pb-32">
      
      {/* Historical Turns */}
      {history.slice(0, history.length - 1).map((turn, idx) => (
        <div key={idx} className="opacity-70 hover:opacity-100 transition-opacity duration-300">
           {/* Question */}
           <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mt-1">
                    <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 text-slate-200 shadow-sm">
                    <p className="font-medium text-sm text-indigo-400 mb-1">Scenario {idx + 1}</p>
                    <div className="prose prose-invert max-w-none text-sm">
                        <ReactMarkdown>{turn.question}</ReactMarkdown>
                    </div>
                </div>
           </div>

           {/* User Answer */}
           <div className="flex gap-4 mb-4 flex-row-reverse">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center mt-1">
                    <User className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-700/50 p-4 rounded-2xl rounded-tr-none border border-slate-600 text-slate-100 max-w-[80%]">
                    <p className="text-sm whitespace-pre-wrap">{turn.userAnswer}</p>
                </div>
           </div>

           {/* Feedback (Mini) */}
           <div className="mb-8 ml-12 p-3 bg-slate-900/50 border-l-2 border-emerald-500 rounded-r-lg">
                <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> EVALUATION
                </div>
                <p className="text-xs text-slate-400 italic">
                    "{turn.reasoning}"
                </p>
           </div>
           
           <div className="w-full h-px bg-slate-800 my-6"></div>
        </div>
      ))}

      {/* Current Turn */}
      {currentTurn && (
        <div className="animate-fade-in-up">
            <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center mt-1 animate-pulse">
                    <span className="text-white font-bold">Q{history.length}</span>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl rounded-tl-none border border-slate-700 shadow-xl text-white w-full">
                    <h3 className="font-semibold text-indigo-400 mb-2 uppercase tracking-wide text-xs">Current Challenge</h3>
                    <div className="prose prose-invert prose-lg max-w-none leading-relaxed">
                        <ReactMarkdown>{currentTurn.question}</ReactMarkdown>
                    </div>
                </div>
            </div>
            
            {/* Feedback for the JUST submitted answer (if currently viewing result before next Q - simplified flow here handles immediate transition, so we might show feedback for previous turn above) */}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex gap-4 mb-6 animate-pulse">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center mt-1">
                <span className="text-indigo-400 text-xs">...</span>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-slate-800 text-slate-400">
                <p>Analyzing response and calibrating next scenario...</p>
            </div>
        </div>
      )}

      {/* Input Area (Sticky Bottom) */}
      {!isGameOver && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-12 z-40">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="relative shadow-2xl shadow-blue-900/10">
                    <textarea 
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your response here... (Be strategic)"
                        className="w-full bg-slate-800 border-2 border-slate-700 text-white rounded-xl py-4 pl-4 pr-16 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none h-24"
                        disabled={isLoading}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button 
                        type="submit" 
                        disabled={!userInput.trim() || isLoading}
                        className="absolute right-3 top-3 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                    <p className="text-xs text-slate-500 mt-2 text-right">
                        Press Enter to submit
                    </p>
                </form>
            </div>
          </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
