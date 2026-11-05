/**
 * HeaderNav - Standard Ras Kids Ecosystem Top Bar
 */

import React from 'react';
import { ChevronLeft, Volume2, VolumeX, Flame, Lock } from 'lucide-react';
import { audioManager } from '../lib/audioManager.ts';

interface HeaderNavProps {
  title?: string;
  subtitle?: string;
  streak?: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onBack?: () => void;
  showBack?: boolean;
  onOpenParentGate?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  title = "Ge'ez Numeral Match",
  subtitle = 'የግዕዝ ቁጥሮች ጨዋታ',
  streak = 1,
  isMuted,
  onToggleMute,
  onBack,
  showBack = false,
  onOpenParentGate,
}) => {
  return (
    <header className="w-full max-w-xl mx-auto px-4 py-3 flex items-center justify-between select-none">
      {/* Left: Back or Brand pill */}
      <div className="flex items-center gap-2">
        {showBack && onBack ? (
          <button
            onClick={() => {
              audioManager.playTapSound();
              onBack();
            }}
            className="w-11 h-11 rounded-2xl bg-white border-2 border-stone-200/80 shadow-xs flex items-center justify-center text-stone-700 active:scale-95 transition-all cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        ) : (
          <div className="w-10 h-10 rounded-2xl bg-[#0C8A65]/10 border border-[#0C8A65]/20 flex items-center justify-center text-lg font-black text-[#0C8A65]">
            ፩
          </div>
        )}

        <div className="flex flex-col">
          <h1 className="text-sm sm:text-base font-black text-stone-900 leading-tight">
            {title}
          </h1>
          <span className="text-[11px] font-semibold text-[#0C8A65] ethiopic-font leading-none">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Right: Controls (Streak, Mute, Parent Gate) */}
      <div className="flex items-center gap-2">
        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-700 font-extrabold text-xs shadow-xs">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span>{streak}</span>
        </div>

        {/* Audio Mute Button */}
        <button
          onClick={() => {
            audioManager.playTapSound();
            onToggleMute();
          }}
          className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs ${
            isMuted
              ? 'bg-rose-50 border-rose-200 text-rose-500'
              : 'bg-white border-stone-200/80 text-stone-700'
          }`}
          aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5 text-[#0C8A65]" />
          )}
        </button>

        {/* Parent Gate Lock */}
        {onOpenParentGate && (
          <button
            onClick={() => {
              audioManager.playTapSound();
              onOpenParentGate();
            }}
            className="w-10 h-10 rounded-2xl bg-white border border-stone-200/80 text-stone-500 flex items-center justify-center active:scale-95 transition-all shadow-xs cursor-pointer hover:text-stone-800"
            aria-label="Parent Area"
            title="Parent Area (PIN protected)"
          >
            <Lock className="w-4 h-4 stroke-[2.2]" />
          </button>
        )}
      </div>
    </header>
  );
};

