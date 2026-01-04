import React from 'react';
import { GameState, LEVELS } from '../types';
import { Trophy, RefreshCcw, Share2 } from 'lucide-react';

interface ResultSummaryProps {
    state: GameState;
    onReset: () => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ state, onReset }) => {
    const finalLevel = state.currentLevel;
    const finalLevelIndex = LEVELS.indexOf(finalLevel);
    
    // Determine title based on index
    const title = finalLevelIndex >= 5 ? "Executive Leader" : finalLevelIndex >= 3 ? "Senior Product Leader" : "Product Manager";

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Background decorative glow */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full shadow-lg mb-6">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    
                    <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Assessment Complete</h2>
                    <h1 className="text-4xl font-bold text-white mb-2">{finalLevel}</h1>
                    <p className="text-indigo-400 font-medium text-lg mb-8">{title}</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {Object.entries(state.currentScores).map(([key, score]) => (
                            <div key={key} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="text-slate-500 text-xs uppercase mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                <div className="text-2xl font-bold text-white">{score}</div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-left mb-8">
                        <h3 className="text-white font-semibold mb-2">Final Verdict</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Based on your strategic decisions, execution focus, and ethical considerations, 
                            you demonstrated strong capability at the <strong>{finalLevel}</strong> level. 
                            {state.currentScores.strategic > 80 ? "Your strategic thinking was particularly impressive." : ""}
                            {state.currentScores.execution < 50 ? " Focus more on operational details and data rigor in the future." : ""}
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={onReset}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <RefreshCcw className="w-5 h-5" /> Try Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
