/**
 * ExploreLanding - Welcoming Entry Screen for Ge'ez Numeral Match
 * Features both "Learn First" and "Play Game" paths for both levels.
 */

import React from 'react';
import { Play, Sparkles, Star, ChevronRight, Flame, CheckCircle, Lightbulb, BookOpen } from 'lucide-react';
import { UserProgressSchema, Level1GameMode, Level2GameStage } from '../types/index.ts';
import { MascotGelada } from './MascotGelada.tsx';
import { audioManager } from '../lib/audioManager.ts';

interface ExploreLandingProps {
  progress: UserProgressSchema;
  onLearnLevel1: () => void;
  onPlayLevel1: (mode: Level1GameMode) => void;
  onLearnLevel2: (tab?: 'tens' | 'combiner') => void;
  onPlayLevel2: (stage: Level2GameStage) => void;
  onOpenDiscovery: () => void;
  onContinueLearning: () => void;
}

export const ExploreLanding: React.FC<ExploreLandingProps> = ({
  progress,
  onLearnLevel1,
  onPlayLevel1,
  onLearnLevel2,
  onPlayLevel2,
  onOpenDiscovery,
  onContinueLearning,
}) => {
  const totalStars = progress.level1.stars + progress.level2.stars;
  const totalRounds = progress.level1.completedRounds + progress.level2.completedRounds;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col gap-4 select-none pb-8">
      {/* Welcome Hero with Mascot */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0C8A65]/15 via-white to-amber-50 rounded-[36px] border-2 border-[#0C8A65]/20 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1 z-10 max-w-[210px] sm:max-w-[240px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0C8A65]/15 text-[#0C8A65] font-black text-[11px] w-fit">
              <Sparkles className="w-3 h-3 fill-[#0C8A65]" />
              ዕድሜ 6–8 · Ras Kids
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
              የግዕዝ ቁጥሮች ማዛመጃ
            </h2>
            <p className="text-xs text-stone-600 font-medium leading-snug">
              መጀመሪያ ቁጥሮቹን እንማር፣ ከዚያ በጨዋታ እንፈትሽ!
            </p>
          </div>

          <div className="shrink-0 z-10">
            <MascotGelada
              size={80}
              expression="proud"
              variant="compact"
              onTap={() => {
                audioManager.playTapSound();
                audioManager.playPraise();
              }}
            />
          </div>
        </div>

        {/* Big Primary Action: First Learn, then Game */}
        <button
          onClick={() => {
            audioManager.playTapSound();
            onContinueLearning();
          }}
          className="mt-4 w-full py-3.5 px-4 rounded-2xl bg-[#0C8A65] hover:bg-[#0a7556] text-white font-black text-sm sm:text-base shadow-md shadow-[#0C8A65]/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-5 h-5" />
          <span>መማር ጀምር (Start Learning)</span>
        </button>
      </div>

      {/* Progress Badges */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-2xl p-2.5 border border-stone-200/80 shadow-xs flex flex-col items-center text-center">
          <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-black">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          </div>
          <span className="text-base font-black text-stone-900 mt-1">
            {totalStars}
          </span>
          <span className="text-[10px] font-bold text-stone-400">ኮከቦች</span>
        </div>

        <div className="bg-white rounded-2xl p-2.5 border border-stone-200/80 shadow-xs flex flex-col items-center text-center">
          <div className="w-7 h-7 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-black">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          </div>
          <span className="text-base font-black text-stone-900 mt-1">
            {progress.currentStreak} ቀናት
          </span>
          <span className="text-[10px] font-bold text-stone-400">Streak</span>
        </div>

        <div className="bg-white rounded-2xl p-2.5 border border-stone-200/80 shadow-xs flex flex-col items-center text-center">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-[#0C8A65] flex items-center justify-center font-black">
            <CheckCircle className="w-4 h-4 text-[#0C8A65]" />
          </div>
          <span className="text-base font-black text-stone-900 mt-1">
            {totalRounds}
          </span>
          <span className="text-[10px] font-bold text-stone-400">ያለቁ ዙሮች</span>
        </div>
      </div>

      {/* Discovery Moment Banner */}
      <div
        onClick={() => {
          audioManager.playTapSound();
          onOpenDiscovery();
        }}
        className="bg-gradient-to-r from-amber-100/90 via-amber-50 to-orange-50 rounded-2xl p-3 border-2 border-amber-300/70 shadow-xs flex items-center justify-between cursor-pointer active:scale-98 transition-all hover:border-amber-400"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-700 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 fill-amber-400 text-amber-600 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-black text-amber-950 flex items-center gap-1">
              <span>የዜሮ ምስጢር በግዕዝ ቁጥሮች!</span>
            </div>
            <div className="text-[10.5px] text-stone-600 font-medium leading-tight">
              የግዕዝ ቁጥሮች ለምን ዜሮ እንደማያስፈልጋቸው እዩ!
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-amber-700 shrink-0" />
      </div>

      {/* Learning Cards Section */}
      <div className="flex flex-col gap-3">
        {/* Level 1 Card: ፩ - ፲ */}
        <div className="bg-white rounded-[28px] border-2 border-orange-200/80 p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 font-black text-2xl flex items-center justify-center ethiopic-font border border-orange-200 shrink-0">
              ፩
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider">
                ደረጃ ፩ · LEVEL 1
              </span>
              <h3 className="text-base font-black text-stone-900 leading-tight">
                ነጠላ ቁጥሮች (፩ እስከ ፲)
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                መጀመሪያ ቁጥሮቹንና ድምፃቸውን ተማሩ፣ ከዚያ ተጫወቱ!
              </p>
            </div>
          </div>

          {/* Action Row: Learn First, Then Play */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100">
            <button
              onClick={() => {
                audioManager.playTapSound();
                onLearnLevel1();
              }}
              className="py-2.5 px-3 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-orange-200"
            >
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span>1. ተማር (Learn)</span>
            </button>

            <button
              onClick={() => {
                audioManager.playTapSound();
                onPlayLevel1('numeral-to-dots');
              }}
              className="py-2.5 px-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>2. ተጫወት (Game)</span>
            </button>
          </div>
        </div>

        {/* Level 2 Card: ፲ - ፺፱ Additive Combinations */}
        <div className="bg-white rounded-[28px] border-2 border-indigo-200/80 p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-[#3D5CEB] font-black text-2xl flex items-center justify-center ethiopic-font border border-indigo-200 shrink-0">
              ፳፫
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-[#3D5CEB] tracking-wider">
                ደረጃ ፪ · LEVEL 2
              </span>
              <h3 className="text-base font-black text-stone-900 leading-tight">
                ድምር ቁጥሮች (፲ እስከ ፺፱)
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                የአሥር ምልክቶችን በማጣመር አዳዲስ ቁጥሮችን መገንባት!
              </p>
            </div>
          </div>

          {/* Action Row: Learn Tens, How to Combine, Play Game */}
          <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-stone-100">
            <button
              onClick={() => {
                audioManager.playTapSound();
                onLearnLevel2('tens');
              }}
              className="py-2 px-1.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-[11px] font-black flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer border border-indigo-200 text-center"
            >
              <BookOpen className="w-4 h-4 text-[#3D5CEB]" />
              <span>1. አሥሮች</span>
            </button>

            <button
              onClick={() => {
                audioManager.playTapSound();
                onLearnLevel2('combiner');
              }}
              className="py-2 px-1.5 rounded-2xl bg-indigo-100/90 hover:bg-indigo-200/90 text-indigo-950 text-[11px] font-black flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer border border-indigo-300 text-center shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-[#3D5CEB]" />
              <span>2. መደመር</span>
            </button>

            <button
              onClick={() => {
                audioManager.playTapSound();
                onPlayLevel2('additive-build');
              }}
              className="py-2 px-1.5 rounded-2xl bg-[#3D5CEB] hover:bg-[#324cc9] text-white text-[11px] font-black flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs active:scale-95 text-center"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>3. ተጫወት</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
