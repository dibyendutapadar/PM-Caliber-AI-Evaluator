export type Level = 'APM' | 'PM' | 'SPM' | 'PPM' | 'Director' | 'VP' | 'CPO';

export type Pillar = 'Strategic Thinking' | 'Execution & Analytics' | 'Empathy & Influence' | 'Business Acumen & Ethics';

export interface PillarScores {
  strategic: number;
  execution: number;
  empathy: number;
  business: number;
}

export interface TurnData {
  question: string;
  userAnswer?: string;
  feedback?: string;
  scoreDelta?: Partial<PillarScores>; // How much scores changed this turn
  overallScores: PillarScores;
  level: Level;
  reasoning: string; // Why the level/score changed
}

export interface GameState {
  status: 'onboarding' | 'playing' | 'loading' | 'finished';
  currentTurnIndex: number; // 0 to totalQuestions - 1
  totalQuestions: number;
  history: TurnData[];
  industry: string;
  productType: string;
  currentLevel: Level;
  currentScores: PillarScores;
}

export const LEVELS: Level[] = ['APM', 'PM', 'SPM', 'PPM', 'Director', 'VP', 'CPO'];

export const INITIAL_SCORES: PillarScores = {
  strategic: 20,
  execution: 20,
  empathy: 20,
  business: 20
};

export type ActionType = 'EVALUATE' | 'PROVIDE_DATA' | 'REJECT';

// Response schema from Gemini
export interface AIResponse {
  action: ActionType;
  feedback: string;
  reasoning: string;
  scores: PillarScores;
  level: Level;
  nextQuestion: string;
}