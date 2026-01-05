import React, { useState, useEffect, useRef } from 'react';
import { TurnData } from '../types';
import { Send, User, CheckCircle2, ArrowRight, Mic, MicOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  currentTurn: TurnData | null;
  history: TurnData[];
  onAnswer: (answer: string) => void;
  onNext: () => void;
  isLoading: boolean;
  isGameOver: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  currentTurn, 
  history, 
  onAnswer, 
  onNext,
  isLoading,
  isGameOver 
}) => {
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // If the current turn has feedback, we are in "Review" mode for that turn.
  // Otherwise we are in "Input" mode.
  const isFeedbackMode = !!currentTurn?.feedback && !isLoading;

  useEffect(() => {
    // Scroll to bottom when history changes or mode changes
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history.length, isFeedbackMode, isLoading]);

  useEffect(() => {
    // Cleanup recognition on unmount
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onError = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
            setUserInput(prev => {
                const cleanTranscript = finalTranscript.trim();
                if (!cleanTranscript) return prev;
                const needsSpace = prev.length > 0 && !prev.endsWith(' ');
                return prev + (needsSpace ? ' ' : '') + cleanTranscript;
            });
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    onAnswer(userInput);
    setUserInput('');
    if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
    }
  };

  const renderFeedback = (feedback: string) => (
    <div className="prose prose-invert prose-sm max-w-none 
      prose-headings:text-emerald-400 prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-4
      prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-2
      prose-ul:my-2 prose-li:my-1 prose-strong:text-white prose-strong:font-semibold">
      <ReactMarkdown>{feedback}</ReactMarkdown>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full p-4 gap-6 pb-32">
      
      {/* Historical Turns (Previous completed turns) */}
      {/* If isFeedbackMode, currentTurn is technically the last in history, so we slice history-1. 
          If !isFeedbackMode, currentTurn is new, history-1 is previous. 
          Actually, logic: Render all turns in history EXCEPT currentTurn. 
      */}
      {history.slice(0, history.length - 1).map((turn, idx) => (
        <div key={idx} className="opacity-75 hover:opacity-100 transition-opacity duration-300">
           {/* Question */}
           <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center mt-1">
                    <span className="text-indigo-400 text-xs font-bold">Q{idx + 1}</span>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-none border border-slate-700 text-slate-300">
                    <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{turn.question}</ReactMarkdown>
                    </div>
                </div>
           </div>

           {/* User Answer */}
           <div className="flex gap-4 mb-4 flex-row-reverse">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mt-1">
                    <User className="w-4 h-4 text-slate-300" />
                </div>
                <div className="bg-slate-700/50 p-4 rounded-2xl rounded-tr-none border border-slate-600 text-slate-300 max-w-[85%] text-sm">
                    {turn.userAnswer}
                </div>
           </div>

           {/* Feedback (Collapsed/Simplified for history) */}
           {turn.feedback && (
                <div className="mb-8 ml-12 p-4 bg-slate-900/50 border-l-2 border-emerald-500/50 rounded-r-lg">
                    <div className="text-xs font-bold text-emerald-500/70 mb-2 flex items-center gap-1 uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" /> Evaluation Summary
                    </div>
                    {/* Just show reasoning for history to keep it compact, or full feedback? 
                        User asked for detailed feedback collation at end, but immediate feedback after question.
                        For history, let's keep it expanded but styled appropriately.
                    */}
                    <div className="max-h-32 overflow-hidden hover:max-h-full transition-all duration-500 mask-linear-fade">
                        {renderFeedback(turn.feedback)}
                    </div>
                </div>
           )}
           
           <div className="w-full h-px bg-slate-800 my-6"></div>
        </div>
      ))}

      {/* Current Turn Area */}
      {currentTurn && (
        <div className="animate-fade-in-up">
            
            {/* 1. The Question */}
            <div className="flex gap-4 mb-6">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full shadow-lg flex items-center justify-center mt-1 transition-all ${isFeedbackMode ? 'bg-slate-700' : 'bg-indigo-500 shadow-indigo-500/20'}`}>
                    <span className="text-white font-bold text-sm">Q{history.length}</span>
                </div>
                <div className={`p-6 rounded-2xl rounded-tl-none border shadow-xl w-full transition-all ${isFeedbackMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white'}`}>
                    {!isFeedbackMode && <h3 className="font-semibold text-indigo-400 mb-2 uppercase tracking-wide text-xs">Current Challenge</h3>}
                    <div className="prose prose-invert prose-lg max-w-none leading-relaxed">
                        <ReactMarkdown>{currentTurn.question}</ReactMarkdown>
                    </div>
                </div>
            </div>

            {/* 2. User Answer (Only visible if answered) */}
            {currentTurn.userAnswer && (
                <div className="flex gap-4 mb-6 flex-row-reverse animate-fade-in">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center mt-1">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-slate-700 p-5 rounded-2xl rounded-tr-none border border-slate-600 text-slate-100 max-w-[90%] shadow-lg">
                        <p className="whitespace-pre-wrap leading-relaxed">{currentTurn.userAnswer}</p>
                    </div>
                </div>
            )}

            {/* 3. Detailed Feedback (Only in Feedback Mode) */}
            {isFeedbackMode && currentTurn.feedback && (
                <div className="ml-0 md:ml-14 mb-8 animate-fade-in-up">
                    <div className="bg-slate-900 border border-emerald-900/50 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/10">
                        <div className="bg-emerald-950/30 px-6 py-3 border-b border-emerald-900/30 flex items-center gap-2">
                            <div className="bg-emerald-500/10 p-1.5 rounded-full">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Assessment & Feedback</h3>
                        </div>
                        <div className="p-6">
                             {renderFeedback(currentTurn.feedback)}
                        </div>
                    </div>
                </div>
            )}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex gap-4 mb-6 animate-pulse ml-0 md:ml-14">
            <div className="bg-slate-800/50 px-6 py-4 rounded-2xl border border-slate-800 text-indigo-300 flex items-center gap-3">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <span className="text-sm font-medium">Calibrating response and leadership alignment...</span>
            </div>
        </div>
      )}

      {/* Interaction Area (Sticky Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-12 z-40">
        <div className="max-w-4xl mx-auto">
            
            {/* CASE A: Feedback Mode - Show Next Button */}
            {isFeedbackMode ? (
                <button 
                    onClick={onNext}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                >
                    Next Challenge <ArrowRight className="w-5 h-5" />
                </button>
            ) : (
            /* CASE B: Input Mode */
            !isGameOver && !isLoading && (
                <form onSubmit={handleSubmit} className="relative shadow-2xl shadow-blue-900/10">
                    <textarea 
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={isListening ? "Listening... (speak now)" : "Type your strategic response here..."}
                        className={`w-full bg-slate-800 border-2 text-white rounded-xl py-4 pl-4 pr-24 focus:outline-none focus:ring-1 transition-all resize-none h-24 ${isListening ? 'border-red-500/50 ring-red-500/50 animate-pulse' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'}`}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    
                    {/* Dictation Button */}
                    <button
                        type="button"
                        onClick={toggleListening}
                        className={`absolute right-14 top-3 p-2 rounded-lg transition-colors ${isListening ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'}`}
                        title={isListening ? "Stop Listening" : "Start Dictation"}
                    >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    {/* Send Button */}
                    <button 
                        type="submit" 
                        disabled={!userInput.trim()}
                        className="absolute right-3 top-3 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                    <p className="text-xs text-slate-500 mt-2 text-right hidden sm:block">
                        Press Enter to submit
                    </p>
                </form>
            ))}
        </div>
      </div>

      <div ref={bottomRef} />
    </div>
  );
};