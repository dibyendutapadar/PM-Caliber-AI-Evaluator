import React from 'react';
import { PillarScores, Level, LEVELS } from '../types';
import { PillarBar } from './PillarBar';
import { TrendingUp, Award, Briefcase } from 'lucide-react';

interface DashboardProps {
  scores: PillarScores;
  level: Level;
  turnIndex: number;
  totalQuestions: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ scores, level, turnIndex, totalQuestions }) => {
  const levelIndex = LEVELS.indexOf(level);
  const progress = ((turnIndex) / totalQuestions) * 100;

  return (
    <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700 shadow-xl">
      <div className="max-w-6xl mx-auto px-4 py-4">
        
        {/* Top Row: Level & Progress */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            
            {/* Level Badge */}
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/20">
                    <Briefcase className="text-white w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Current Caliber</h2>
                    <div className="text-2xl font-bold text-white tracking-tight leading-none">{level}</div>
                </div>
            </div>

            {/* Progress Wrapper */}
            <div className="flex-1 max-w-md hidden md:block">
                 <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Interview Progress</span>
                    <span>{Math.min(turnIndex, totalQuestions)}/{totalQuestions} Questions</span>
                 </div>
                 <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                 </div>
            </div>

        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
            <PillarBar label="Strategic Thinking" score={scores.strategic} />
            <PillarBar label="Execution & Analytics" score={scores.execution} />
            <PillarBar label="Empathy & Influence" score={scores.empathy} />
            <PillarBar label="Business Acumen & Ethics" score={scores.business} />
        </div>
      </div>
    </div>
  );
};