/**
 * Ras Kids - Ge'ez Numeral Match Local Storage & Bridge Service
 */

import { UserProgressSchema, ActivityResult, SyncEventPayload } from '../types/index.ts';

const STORAGE_KEY = 'geez_numeral_match_data';
const PIN_KEY = 'fidel_parent_pin';
const DEFAULT_PARENT_PIN = '1234';

export const DEFAULT_PROGRESS: UserProgressSchema = {
  level1: {
    totalAttempts: 0,
    totalCorrect: 0,
    completedRounds: 0,
    stars: 0,
    arabicMatchCompleted: 0,
    quantityMatchCompleted: 0,
  },
  level2: {
    totalAttempts: 0,
    totalCorrect: 0,
    completedRounds: 0,
    stars: 0,
    tensMastered: 0,
    combinationsMastered: 0,
  },
  unlockedLevel2: true, // Freely available or unlocked for playful exploration
  discoveredNoZero: false,
  currentStreak: 1,
  streakFrozen: false,
  lastActiveDate: new Date().toISOString().split('T')[0],
  recentActivity: [],
};

export function loadProgress(): UserProgressSchema {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      level1: {
        totalAttempts: parsed.level1?.totalAttempts ?? 0,
        totalCorrect: parsed.level1?.totalCorrect ?? 0,
        completedRounds: parsed.level1?.completedRounds ?? 0,
        stars: parsed.level1?.stars ?? 0,
        arabicMatchCompleted: parsed.level1?.arabicMatchCompleted ?? 0,
        quantityMatchCompleted: parsed.level1?.quantityMatchCompleted ?? 0,
      },
      level2: {
        totalAttempts: parsed.level2?.totalAttempts ?? 0,
        totalCorrect: parsed.level2?.totalCorrect ?? 0,
        completedRounds: parsed.level2?.completedRounds ?? 0,
        stars: parsed.level2?.stars ?? 0,
        tensMastered: parsed.level2?.tensMastered ?? 0,
        combinationsMastered: parsed.level2?.combinationsMastered ?? 0,
      },
      unlockedLevel2: parsed.unlockedLevel2 ?? true,
      discoveredNoZero: parsed.discoveredNoZero ?? false,
      currentStreak: parsed.currentStreak ?? 1,
      streakFrozen: parsed.streakFrozen ?? false,
      lastActiveDate: parsed.lastActiveDate ?? new Date().toISOString().split('T')[0],
      recentActivity: Array.isArray(parsed.recentActivity) ? parsed.recentActivity.slice(0, 10) : [],
    };
  } catch (err) {
    console.warn('Could not read progress from localStorage:', err);
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(data: UserProgressSchema): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Could not save progress to localStorage:', err);
  }
}

export function recordActivityResult(result: ActivityResult): UserProgressSchema {
  const current = loadProgress();
  const updated: UserProgressSchema = { ...current };

  if (result.level === 1) {
    updated.level1.completedRounds += 1;
    updated.level1.totalAttempts += result.totalQuestions;
    updated.level1.totalCorrect += result.correctAnswers;
    updated.level1.stars += result.starsEarned;

    if (result.modeOrStage === 'arabic-match') {
      updated.level1.arabicMatchCompleted += 1;
    } else {
      updated.level1.quantityMatchCompleted += 1;
    }
  } else {
    updated.level2.completedRounds += 1;
    updated.level2.totalAttempts += result.totalQuestions;
    updated.level2.totalCorrect += result.correctAnswers;
    updated.level2.stars += result.starsEarned;

    if (result.modeOrStage === 'tens-recognition') {
      updated.level2.tensMastered += 1;
    } else {
      updated.level2.combinationsMastered += 1;
    }
  }

  // Update streak logic
  const today = new Date().toISOString().split('T')[0];
  if (updated.lastActiveDate !== today) {
    const lastDate = updated.lastActiveDate ? new Date(updated.lastActiveDate) : null;
    const now = new Date(today);
    const dayDiff = lastDate ? Math.round((now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)) : 0;

    if (dayDiff === 1) {
      updated.currentStreak += 1;
    } else if (dayDiff > 1 && !updated.streakFrozen) {
      updated.currentStreak = 1;
    }
    updated.lastActiveDate = today;
  }

  updated.recentActivity = [result, ...(updated.recentActivity || [])].slice(0, 10);
  saveProgress(updated);
  return updated;
}

export function resetProgress(): UserProgressSchema {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return DEFAULT_PROGRESS;
}

export function getParentPin(): string {
  if (typeof window === 'undefined') return DEFAULT_PARENT_PIN;
  try {
    return localStorage.getItem(PIN_KEY) || DEFAULT_PARENT_PIN;
  } catch {
    return DEFAULT_PARENT_PIN;
  }
}

/**
 * Mobile Native Bridge Stubs
 */
export function requestHaptic(type: 'light' | 'success' | 'warning'): void {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      if (type === 'light') navigator.vibrate(18);
      else if (type === 'success') navigator.vibrate([30, 25, 45]);
      else if (type === 'warning') navigator.vibrate([30, 30, 30]);
    } catch {
      // Safe ignore
    }
  }
}

export function queueSyncEvent(payload: SyncEventPayload): void {
  console.log('[Ras Bridge] Sync event queued:', payload);
}

export function onMilestone(name: string): void {
  console.log('[Ras Bridge] Milestone achieved:', name);
}

