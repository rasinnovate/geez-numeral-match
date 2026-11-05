/**
 * Ge'ez Numeral Match - Main Application Component
 * Ras Kids Educational Mini-App Ecosystem
 */

import React, { useState } from 'react';
import { HeaderNav } from './components/HeaderNav.tsx';
import { ExploreLanding } from './components/ExploreLanding.tsx';
import { Level1LearnScreen } from './components/Level1LearnScreen.tsx';
import { Level1Screen } from './components/Level1Screen.tsx';
import { Level2LearnScreen } from './components/Level2LearnScreen.tsx';
import { Level2Screen } from './components/Level2Screen.tsx';
import { LevelCompletionModal } from './components/LevelCompletionModal.tsx';
import { ParentGateModal } from './components/ParentGateModal.tsx';
import { ParentProgressModal } from './components/ParentProgressModal.tsx';
import { NoZeroDiscoveryModal } from './components/NoZeroDiscoveryModal.tsx';
import {
  AppScreen,
  Level1GameMode,
  Level2GameStage,
  UserProgressSchema,
  ActivityResult,
} from './types/index.ts';
import {
  loadProgress,
  saveProgress,
  recordActivityResult,
  resetProgress,
} from './lib/storageService.ts';
import { audioManager } from './lib/audioManager.ts';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('explore');
  const [progress, setProgress] = useState<UserProgressSchema>(() => loadProgress());
  const [isMuted, setIsMuted] = useState<boolean>(() => audioManager.getIsMuted());

  // Activity configuration
  const [l1Mode, setL1Mode] = useState<Level1GameMode>('numeral-to-dots');
  const [l2Stage, setL2Stage] = useState<Level2GameStage>('additive-build');
  const [l2Tab, setL2Tab] = useState<'tens' | 'combiner'>('combiner');
  const [lastResult, setLastResult] = useState<ActivityResult | null>(null);

  // Modals state
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Sync mute state
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioManager.setMuted(nextMuted);
  };

  const handleLearnLevel1 = () => {
    setScreen('level1-learn');
  };

  const handlePlayLevel1 = (mode: Level1GameMode) => {
    setL1Mode(mode);
    setScreen('level1-game');
  };

  const handleLearnLevel2 = (tab: 'tens' | 'combiner' = 'combiner') => {
    setL2Tab(tab);
    setScreen('level2-learn');
  };

  const handlePlayLevel2 = (stage: Level2GameStage) => {
    setL2Stage(stage);
    setScreen('level2-game');
  };

  // Continue learning: Always start with Learn mode first!
  const handleContinueLearning = () => {
    if (progress.level1.completedRounds < 1) {
      handleLearnLevel1();
    } else if (progress.level2.completedRounds < 1) {
      handleLearnLevel2();
    } else {
      handlePlayLevel1('numeral-to-dots');
    }
  };

  const handleActivityComplete = (result: ActivityResult) => {
    const updated = recordActivityResult(result);
    setProgress(updated);
    setLastResult(result);
    setIsCompletionOpen(true);
  };

  const handleReplay = () => {
    setIsCompletionOpen(false);
    if (lastResult?.level === 1) {
      setScreen('level1-game');
    } else {
      setScreen('level2-game');
    }
  };

  const handleCompletionContinue = () => {
    setIsCompletionOpen(false);
    setScreen('explore');
  };

  const handleResetAllProgress = () => {
    const fresh = resetProgress();
    setProgress(fresh);
  };

  const handleToggleStreakFreeze = () => {
    const updated: UserProgressSchema = {
      ...progress,
      streakFrozen: !progress.streakFrozen,
    };
    saveProgress(updated);
    setProgress(updated);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] text-[#141414] flex flex-col items-center">
      {/* Ecosystem Top Navigation */}
      <HeaderNav
        title="Ge'ez Numeral Match"
        subtitle="የዕለቱ የግዕዝ ቁጥሮች ጨዋታ"
        streak={progress.currentStreak}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        showBack={screen !== 'explore'}
        onBack={() => setScreen('explore')}
        onOpenParentGate={() => setIsParentGateOpen(true)}
      />

      {/* Screen Views */}
      <main className="w-full flex-1 flex flex-col items-center">
        {screen === 'explore' && (
          <ExploreLanding
            progress={progress}
            onLearnLevel1={handleLearnLevel1}
            onPlayLevel1={handlePlayLevel1}
            onLearnLevel2={handleLearnLevel2}
            onPlayLevel2={handlePlayLevel2}
            onOpenDiscovery={() => setIsDiscoveryOpen(true)}
            onContinueLearning={handleContinueLearning}
          />
        )}

        {screen === 'level1-learn' && (
          <Level1LearnScreen
            onStartGame={() => handlePlayLevel1('numeral-to-dots')}
            onExit={() => setScreen('explore')}
          />
        )}

        {screen === 'level1-game' && (
          <Level1Screen
            initialMode={l1Mode}
            totalQuestions={5}
            onComplete={handleActivityComplete}
            onExit={() => setScreen('explore')}
          />
        )}

        {screen === 'level2-learn' && (
          <Level2LearnScreen
            initialTab={l2Tab}
            onStartGame={() => handlePlayLevel2('additive-build')}
            onExit={() => setScreen('explore')}
          />
        )}

        {screen === 'level2-game' && (
          <Level2Screen
            initialStage={l2Stage}
            totalQuestions={5}
            onComplete={handleActivityComplete}
            onExit={() => setScreen('explore')}
          />
        )}
      </main>

      {/* Completion Celebration Modal */}
      <LevelCompletionModal
        isOpen={isCompletionOpen}
        result={lastResult}
        onReplay={handleReplay}
        onContinue={handleCompletionContinue}
      />

      {/* No-Zero Discovery Modal */}
      <NoZeroDiscoveryModal
        isOpen={isDiscoveryOpen}
        onClose={() => setIsDiscoveryOpen(false)}
      />

      {/* Grown-Ups PIN Gate */}
      <ParentGateModal
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={() => {
          setIsParentGateOpen(false);
          setIsParentModalOpen(true);
        }}
      />

      {/* Parent Progress Dashboard */}
      <ParentProgressModal
        isOpen={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
        progress={progress}
        onResetProgress={handleResetAllProgress}
        onToggleStreakFreeze={handleToggleStreakFreeze}
      />
    </div>
  );
};

export default App;
