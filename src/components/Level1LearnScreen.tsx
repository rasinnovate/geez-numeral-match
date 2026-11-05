/**
 * Level1LearnScreen - Interactive Learning Studio for Single Numerals (፩ to ፲)
 * Children explore and learn the numbers with audio pronunciation and tactile dot counts BEFORE playing the game!
 */

import React, { useState, useEffect } from 'react';
import { Volume2, ChevronLeft, ChevronRight, Play, Sparkles } from 'lucide-react';
import { LEVEL_1_NUMERALS } from '../data/geezNumerals.ts';
import { QuantityDotCard } from './QuantityDotCard.tsx';
import { MascotGelada } from './MascotGelada.tsx';
import { audioManager } from '../lib/audioManager.ts';

interface Level1LearnScreenProps {
  onStartGame: () => void;
  onExit: () => void;
}

export const Level1LearnScreen: React.FC<Level1LearnScreenProps> = ({
  onStartGame,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = LEVEL_1_NUMERALS[currentIndex];

  // Auto-play spoken number name on numeral change
  useEffect(() => {
    audioManager.playNumber(currentItem.value);
  }, [currentIndex]);

  const handlePrev = () => {
    audioManager.playTapSound();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : LEVEL_1_NUMERALS.length - 1));
  };

  const handleNext = () => {
    audioManager.playTapSound();
    setCurrentIndex((prev) => (prev < LEVEL_1_NUMERALS.length - 1 ? prev + 1 : 0));
  };

  const handleSelectIndex = (idx: number) => {
    audioManager.playTapSound();
    setCurrentIndex(idx);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 flex flex-col items-center justify-between min-h-[calc(100vh-80px)] select-none">
      {/* Top Numerals Pill Strip */}
      <div className="w-full flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1">
        {LEVEL_1_NUMERALS.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={item.geez}
              onClick={() => handleSelectIndex(idx)}
              className={`min-w-9 h-10 sm:min-w-10 sm:h-11 rounded-2xl font-black text-lg ethiopic-font flex items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0C8A65] text-white scale-110 shadow-md shadow-[#0C8A65]/30'
                  : 'bg-white border border-stone-200/80 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {item.geez}
            </button>
          );
        })}
      </div>

      {/* Main Numeral Flashcard */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-3">
        <div
          onClick={() => {
            audioManager.playTapSound();
            audioManager.playNumber(currentItem.value);
          }}
          className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-[44px] bg-white border-3 border-[#0C8A65]/30 shadow-xl shadow-stone-200/60 p-5 flex flex-col items-center justify-between transition-transform active:scale-98 cursor-pointer group"
        >
          {/* Audio Replay Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#0C8A65] text-xs font-black self-start">
            <Volume2 className="w-4 h-4 animate-bounce" />
            <span>አዳምጥ (Tap to Hear)</span>
          </div>

          {/* Large Ge'ez Numeral */}
          <div className="text-8xl sm:text-9xl font-black text-stone-900 numeral-display leading-none tracking-tight my-auto group-hover:scale-105 transition-transform">
            {currentItem.geez}
          </div>

          {/* Tactile Dot Visualizer */}
          <div className="w-full flex flex-col items-center pt-2 border-t border-stone-100">
            <QuantityDotCard count={currentItem.value} size="md" />
          </div>
        </div>

        {/* Carousel Prev / Next Controls */}
        <div className="flex items-center justify-between w-full max-w-xs mt-4">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-2xl bg-white border-2 border-stone-200 text-stone-700 flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-xs hover:bg-stone-50"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <span className="text-sm font-black text-stone-500">
            {currentIndex + 1} ከ {LEVEL_1_NUMERALS.length}
          </span>

          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-2xl bg-white border-2 border-stone-200 text-stone-700 flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-xs hover:bg-stone-50"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Action Footer: Play Matching Game Primary CTA */}
      <div className="w-full flex flex-col gap-3 pt-2 border-t border-stone-200/70">
        <button
          onClick={() => {
            audioManager.playTapSound();
            onStartGame();
          }}
          className="w-full py-4 px-4 rounded-2xl bg-[#0C8A65] hover:bg-[#0a7556] text-white font-black text-base shadow-lg shadow-[#0C8A65]/30 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>ወደ ጨዋታው ሂድ! 🎮 (Play Matching Game)</span>
        </button>

        <MascotGelada
          size={54}
          expression="encouraging"
          variant="inline"
          message="ቁጥሮቹን አዳምጡና ተለማመዱ! ዝግጁ ስትሆኑ ጨዋታውን ጀምሩ!"
          onTap={() => audioManager.playNumber(currentItem.value)}
        />
      </div>
    </div>
  );
};

