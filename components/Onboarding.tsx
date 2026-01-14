import React, { useState } from 'react';
import { Target, ArrowRight, Briefcase, Globe } from 'lucide-react';
import { Level, LEVELS } from '../types';

interface OnboardingProps {
  onStart: (industry: string, product: string, questionCount: number, startingLevel: Level, customInstruction: string) => void;
  isLoading: boolean;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onStart, isLoading }) => {
  const [industry, setIndustry] = useState('ECommerce');
  const [product, setProduct] = useState('B2C');
  const [questionCount, setQuestionCount] = useState(10);
  const [startingLevel, setStartingLevel] = useState<Level>('APM');
  const [customInstruction, setCustomInstruction] = useState('');

  const handleStart = () => {
    if (industry && product) {
      onStart(industry, product, questionCount, startingLevel, customInstruction);
    }
  };

  const suggestions = [
    { i: 'Ride Sharing', p: 'Driver App' },
    { i: 'FinTech', p: 'Neobank Wallet' },
    { i: 'SaaS', p: 'Project Management Tool' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
                <Target className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">PM Caliber AI Evaluator</h1>
            <p className="text-slate-400 text-sm mb-4">
                Test your Product Management mindset across strategy, execution, and ethics. 
                Adapt to increasingly difficult scenarios.
            </p>
            
            <a 
              href="https://dibyendupm.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-900/30 px-3 py-1.5 rounded-full border border-indigo-900/50 hover:border-indigo-500/50"
            >
              <span>Created by Dibyendu Tapadar</span>
              <Globe className="w-3 h-3" />
            </a>
        </div>

        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Target Industry</label>
                    <input 
                        type="text" 
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="e.g., Healthcare, EdTech"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Product Type</label>
                    <input 
                        type="text" 
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        placeholder="e.g., Mobile App, B2B Platform"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Seniority Level</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {LEVELS.map((level) => (
                        <button
                            key={level}
                            onClick={() => setStartingLevel(level)}
                            className={`px-2 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all border ${
                                startingLevel === level 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/50' 
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                            }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    The first question will be tailored to this level.
                </p>
            </div>

            {/* Question Count Slider */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-300">Interview Length</label>
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-900/30 px-2 py-1 rounded">
                        {questionCount} Questions
                    </span>
                </div>
                <input 
                    type="range" 
                    min="5" 
                    max="10" 
                    step="1"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </div>

            {/* Custom Instructions */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Custom Scenario / Instructions (Optional)
                </label>
                <textarea
                    value={customInstruction}
                    onChange={(e) => setCustomInstruction(e.target.value)}
                    placeholder="If you want the evaluator to start with a specific question or instruction, mention it here. (Irrelevant content will be ignored)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm h-20 placeholder:text-slate-500"
                />
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase">Presets</p>
                <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                        <button 
                            key={i}
                            onClick={() => { setIndustry(s.i); setProduct(s.p); }}
                            className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
                        >
                            {s.i} / {s.p}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                onClick={handleStart}
                disabled={!industry || !product || isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
            >
                {isLoading ? (
                    <span className="animate-pulse">Generating Scenario...</span>
                ) : (
                    <>
                        Start Assessment <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};