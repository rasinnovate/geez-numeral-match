/**
 * LevelCompletionModal - Reward and Completion Celebration Screen
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowRight, Star, Award, Sparkles } from 'lucide-react';
import { MascotGelada } from './MascotGelada.tsx';
import { ActivityResult } from '../types/index.ts';
import { audioManager } from '../lib/audioManager.ts';

interface LevelCompletionModalProps {
  isOpen: boolean;
  result: ActivityResult | null;
  onReplay: () => void;
  onContinue: () => void;
}

export const LevelCompletionModal: React.FC<LevelCompletionModalProps> = ({
  isOpen,
  result,
  onReplay,
  onContinue,
}) => {
  useEffect(() => {
    if (isOpen) {
      audioManager.playFanfare();
      audioManager.playPraise();

      // Trigger colorful celebratory confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0C8A65', '#FFB020', '#E04E2C', '#3D5CEB', '#8A46EC'],
        });
      } catch {
        // Safe ignore
      }
    }
  }, [isOpen]);

  if (!isOpen || !result) return null;

  const stars = result.starsEarned;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-ras-fade"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm bg-[#FBFAF7] rounded-[36px] border border-amber-200/80 shadow-2xl p-6 flex flex-col items-center gap-4 animate-pop-in text-center">
        {/* Mascot */}
        <MascotGelada
          size={84}
          expression="proud"
          variant="greeting"
          message="ጎበዝ! ድንቅ ውጤት አስመዝግበሃል!"
        />

        {/* Level Title */}
        <div className="flex flex-col items-center">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#0C8A65] text-xs font-black uppercase tracking-wider mb-1">
            ደረጃ {result.level === 1 ? '፩ (Level 1)' : '፪ (Level 2)'} ተጠናቋል!
          </span>
          <h2 className="text-2xl font-black text-stone-900 leading-tight">
            እንኳን ደስ አለህ! 🎉
          </h2>
        </div>

        {/* Stars Reward Row */}
        <div className="flex items-center justify-center gap-2 my-1">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= stars;
            return (
              <div
                key={starIdx}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all transform duration-300 ${
                  isEarned
                    ? 'bg-amber-100 border-amber-400 text-amber-500 scale-105 shadow-md animate-bounce'
                    : 'bg-stone-100 border-stone-200 text-stone-300'
                }`}
                style={{
                  animationDelay: `${starIdx * 150}ms`,
                }}
              >
                <Star
                  className={`w-8 h-8 ${
                    isEarned ? 'fill-amber-400 text-amber-500' : ''
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Stats Summary Card */}
        <div className="w-full bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 rounded-xl bg-stone-50">
            <span className="text-xl font-black text-[#0C8A65]">
              {result.correctAnswers}/{result.totalQuestions}
            </span>
            <span className="text-[10px] font-bold text-stone-500 mt-0.5">
              ትክክል
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-stone-50">
            <span className="text-xl font-black text-amber-600">
              {result.accuracy}%
            </span>
            <span className="text-[10px] font-bold text-stone-500 mt-0.5">
              ትክክለኛነት
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-stone-50">
            <span className="text-xl font-black text-purple-600">
              +{stars}
            </span>
            <span className="text-[10px] font-bold text-stone-500 mt-0.5">
              ኮከቦች
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => {
              audioManager.playTapSound();
              onContinue();
            }}
            className="w-full py-3.5 rounded-2xl bg-[#0C8A65] hover:bg-[#0a7556] text-white font-extrabold text-base shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ቀጥል (Continue)</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              audioManager.playTapSound();
              onReplay();
            }}
            className="w-full py-3 rounded-2xl bg-white border-2 border-stone-200/90 text-stone-700 font-extrabold text-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-stone-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>እንደገና ተጫወት (Play Again)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

