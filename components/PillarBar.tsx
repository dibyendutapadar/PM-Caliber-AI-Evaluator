import React from 'react';
import { Pillar } from '../types';

interface PillarBarProps {
  label: Pillar;
  score: number;
  prevScore?: number;
}

const getScoreColor = (score: number) => {
  if (score < 20) return 'bg-red-500';
  if (score < 40) return 'bg-orange-500';
  if (score < 60) return 'bg-yellow-500';
  if (score < 80) return 'bg-blue-500';
  if (score < 90) return 'bg-indigo-500';
  return 'bg-purple-500';
};

const getScoreLabel = (score: number) => {
    if (score < 20) return 'Very Low';
    if (score < 40) return 'Low';
    if (score < 60) return 'Moderate';
    if (score < 80) return 'High';
    if (score < 90) return 'Very High';
    return 'Elite';
};

export const PillarBar: React.FC<PillarBarProps> = ({ label, score, prevScore }) => {
  return (
    <div className="flex flex-col w-full mb-3">
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-xs font-bold text-slate-200">
            {getScoreLabel(score)} <span className="text-slate-500">({score})</span>
        </span>
      </div>
      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden relative">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        />
        {/* Simple grid lines */}
        <div className="absolute top-0 bottom-0 left-[20%] w-px bg-slate-900/30"></div>
        <div className="absolute top-0 bottom-0 left-[40%] w-px bg-slate-900/30"></div>
        <div className="absolute top-0 bottom-0 left-[60%] w-px bg-slate-900/30"></div>
        <div className="absolute top-0 bottom-0 left-[80%] w-px bg-slate-900/30"></div>
      </div>
    </div>
  );
};
