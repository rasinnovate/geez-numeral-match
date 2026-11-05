/**
 * Ras Kids - Ge'ez Numeral Match Type Definitions
 */

export type MascotExpression = 'encouraging' | 'proud' | 'gently-concerned';
export type MascotMood = 'idle' | 'speaking' | 'cheering' | 'guiding';

export type AppScreen =
  | 'explore'
  | 'level1-learn'
  | 'level1-game'
  | 'level2-learn'
  | 'level2-game'
  | 'no-zero-discovery';

export type Level1GameMode =
  | 'numeral-to-dots'   // Given ፯ -> select matching dot pattern
  | 'dots-to-numeral'   // Given dot pattern -> select matching Ge'ez numeral
  | 'sound-to-numeral';  // Hear spoken sound -> select matching Ge'ez numeral

export type Level2GameStage =
  | 'tens-recognition'   // Pure Ge'ez tens: hear "ሃያ", select ፳ vs ፴ vs ፵
  | 'additive-build'     // Hear number, combine tens + units -> combined numeral
  | 'combined-recognition'; // Given ፳፫, match to components ፳ + ፫

export interface NumeralItem {
  geez: string;
  value: number;
  amharicName: string;
  phonetic: string;
  englishName: string;
  type: 'unit' | 'ten' | 'hundred' | 'composite';
  tensSymbol?: string;
  unitsSymbol?: string;
  tensValue?: number;
  unitsValue?: number;
}

export interface ChoiceOption {
  id: string;
  geez?: string;
  dotCount?: number;
  numericValue: number;
  partsFormula?: string; // e.g. "፳ + ፫"
}

export interface Level1Question {
  id: string;
  numeral: NumeralItem;
  mode: Level1GameMode;
  options: ChoiceOption[];
  correctOptionId: string;
}

export interface Level2Question {
  id: string;
  targetNumber: number;
  stage: Level2GameStage;
  tensNumeral: NumeralItem;
  unitsNumeral?: NumeralItem;
  combinedGeez: string;
  options: ChoiceOption[];
  correctOptionId?: string;
  geezFormula: string; // e.g. "፳ + ፫ = ፳፫"
}

export interface ActivityResult {
  level: 1 | 2;
  modeOrStage: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  starsEarned: number;
  timeSpentSeconds: number;
  completedAt: string;
}

export interface Level1Stats {
  totalAttempts: number;
  totalCorrect: number;
  completedRounds: number;
  stars: number;
  learnedNumbers?: number;
  arabicMatchCompleted?: number;
  quantityMatchCompleted?: number;
}

export interface Level2Stats {
  totalAttempts: number;
  totalCorrect: number;
  completedRounds: number;
  stars: number;
  tensMastered: number;
  combinationsMastered: number;
}

export interface UserProgressSchema {
  level1: Level1Stats;
  level2: Level2Stats;
  unlockedLevel2: boolean;
  discoveredNoZero: boolean;
  currentStreak: number;
  streakFrozen: boolean;
  lastActiveDate?: string;
  recentActivity: ActivityResult[];
}

export interface SyncEventPayload {
  eventType: string;
  timestamp: number;
  payload: Record<string, any>;
}
