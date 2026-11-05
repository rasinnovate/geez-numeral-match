/**
 * NoZeroDiscoveryModal - Special Educational Discovery Moment
 * Teaches kids why Ge'ez numerals don't need a zero symbol!
 */

import React, { useState } from 'react';
import { X, Sparkles, Lightbulb, ArrowRight, Heart } from 'lucide-react';
import { MascotGelada } from './MascotGelada.tsx';
import { NO_ZERO_DISCOVERY_FACTS } from '../data/geezNumerals.ts';
import { audioManager } from '../lib/audioManager.ts';

interface NoZeroDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NoZeroDiscoveryModal: React.FC<NoZeroDiscoveryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'intro' | 'example1' | 'example2'>('intro');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-ras-fade"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-[#FBFAF7] rounded-[36px] border border-amber-200/80 shadow-2xl p-5 sm:p-6 flex flex-col gap-4 max-h-[92vh] overflow-y-auto no-scrollbar animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full border border-amber-300/60 text-amber-900 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>የግዕዝ ድንቅ እውነታ (Discovery)</span>
          </div>
          <button
            onClick={() => {
              audioManager.playTapSound();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-stone-200/70 flex items-center justify-center text-stone-600 hover:bg-stone-300 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mascot Greeting */}
        <div className="flex items-center justify-center pt-1">
          <MascotGelada
            size={76}
            expression="proud"
            variant="greeting"
            message="ይህን ታውቃላችሁ? የግዕዝ ቁጥሮች ዜሮ የላቸውም!"
          />
        </div>

        {/* Main Title & Concept */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
            {NO_ZERO_DISCOVERY_FACTS.titleAm}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1 leading-snug">
            {NO_ZERO_DISCOVERY_FACTS.explanationAm}
          </p>
        </div>

        {/* Visual Cards Comparison */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200/70 shadow-xs flex flex-col gap-3">
          <div className="text-xs font-black text-amber-800 flex items-center gap-1.5 uppercase tracking-wide">
            <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>እንዴት ይሰራል? (How It Works)</span>
          </div>

          {/* Interactive Steps */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Card 1: ፲ */}
            <div
              onClick={() => {
                audioManager.playTapSound();
                audioManager.playNumber(10);
              }}
              className="bg-amber-50/70 hover:bg-amber-100/70 transition-colors border border-amber-200/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95"
            >
              <span className="text-3xl font-black text-[#0C8A65] ethiopic-font">
                ፲
              </span>
              <span className="text-xs font-extrabold text-stone-800 mt-1">
                = 10 (አሥር)
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5 leading-tight">
                ያለ ዜሮ ብቻውን 10 ነው!
              </span>
            </div>

            {/* Card 2: ፳ + ፫ */}
            <div
              onClick={() => {
                audioManager.playCombineSwoosh();
              }}
              className="bg-emerald-50/70 hover:bg-emerald-100/70 transition-colors border border-emerald-200/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95"
            >
              <div className="flex items-center gap-1 text-2xl font-black text-stone-800 ethiopic-font">
                <span className="text-[#3D5CEB]">፳</span>
                <span className="text-stone-400 text-sm">+</span>
                <span className="text-[#E04E2C]">፫</span>
                <span className="text-stone-400 text-sm">=</span>
                <span className="text-[#0C8A65]">፳፫</span>
              </div>
              <span className="text-xs font-extrabold text-stone-800 mt-1">
                20 + 3 = 23
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5 leading-tight">
                በቀጥታ ድምር ይሰራሉ!
              </span>
            </div>
          </div>

          <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl text-center leading-relaxed">
            በአረብኛ ቁጥሮች 10 እና 20 ዜሮ (0) ያስፈልጋቸዋል። በግዕዝ ግን እያንዳንዱ አሥር የራሱ የተከበረ ምልክት አለው!
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            audioManager.playTapSound();
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-[#0C8A65] hover:bg-[#0a7556] text-white font-extrabold text-sm sm:text-base shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>አሪፍ ነው! ወደ ጨዋታው ተመለስ</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

