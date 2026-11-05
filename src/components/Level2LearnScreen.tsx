/**
 * Level2LearnScreen - Interactive Learning Studio for Tens and Additive Combinations
 * Children learn the tens and practice combining symbols BEFORE playing the game!
 */

import React, { useState, useEffect } from 'react';
import { Volume2, Play, Sparkles, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { GEEZ_TENS, GEEZ_UNITS, GEEZ_TENS_AND_HUNDRED } from '../data/geezNumerals.ts';
import { MascotGelada } from './MascotGelada.tsx';
import { audioManager } from '../lib/audioManager.ts';

interface Level2LearnScreenProps {
  initialTab?: 'tens' | 'combiner';
  onStartGame: () => void;
  onExit: () => void;
}

export const Level2LearnScreen: React.FC<Level2LearnScreenProps> = ({
  initialTab = 'combiner',
  onStartGame,
  onExit,
}) => {
  const [tab, setTab] = useState<'tens' | 'combiner'>(initialTab);

  // Tens tab state (includes 10-90 and 100)
  const [currentTenIndex, setCurrentTenIndex] = useState(0);
  const currentTen = GEEZ_TENS_AND_HUNDRED[currentTenIndex] || GEEZ_TENS_AND_HUNDRED[0];

  // Combiner demo tab state
  const [selectedTensVal, setSelectedTensVal] = useState<number>(20);
  const [selectedUnitsVal, setSelectedUnitsVal] = useState<number>(3);
  const [isMerged, setIsMerged] = useState<boolean>(false);

  const activeTenItem =
    GEEZ_TENS_AND_HUNDRED.find((t) => t.value === selectedTensVal) || GEEZ_TENS_AND_HUNDRED[1];
  const activeUnitItem =
    GEEZ_UNITS.find((u) => u.value === selectedUnitsVal) || GEEZ_UNITS[0];
  const combinedGeez = `${activeTenItem.geez}${activeUnitItem.geez}`;
  const totalVal = selectedTensVal + selectedUnitsVal;

  // Auto-play spoken audio on selection
  useEffect(() => {
    if (tab === 'tens') {
      audioManager.playNumber(currentTen.value);
    }
  }, [currentTenIndex, tab]);

  useEffect(() => {
    if (tab === 'combiner') {
      setIsMerged(false);
      audioManager.playNumber(totalVal);
    }
  }, [selectedTensVal, selectedUnitsVal, tab]);

  const handleMergeAction = () => {
    setIsMerged(true);
    audioManager.playCombineSwoosh();
    setTimeout(() => {
      audioManager.playNumber(totalVal);
    }, 250);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 flex flex-col items-center justify-between min-h-[calc(100vh-80px)] select-none">
      {/* Top Tab Switcher */}
      <div className="w-full flex items-center bg-stone-200/70 p-1 rounded-2xl text-xs font-black text-stone-700 mb-2">
        <button
          onClick={() => {
            audioManager.playTapSound();
            setTab('tens');
          }}
          className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
            tab === 'tens'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'hover:text-stone-900'
          }`}
        >
          1. የአሥሮች ጥናት (Learn Tens)
        </button>

        <button
          onClick={() => {
            audioManager.playTapSound();
            setTab('combiner');
          }}
          className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
            tab === 'combiner'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'hover:text-stone-900'
          }`}
        >
          2. የመደመር ጥበብ (How to Combine)
        </button>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-2">
        {tab === 'tens' ? (
          /* TENS LEARNING CARD */
          <div className="w-full flex flex-col items-center gap-3">
            {/* Pill selector for Tens & Hundred */}
            <div className="w-full flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1">
              {GEEZ_TENS_AND_HUNDRED.map((ten, idx) => (
                <button
                  key={ten.geez}
                  onClick={() => {
                    audioManager.playTapSound();
                    setCurrentTenIndex(idx);
                  }}
                  className={`min-w-9 h-10 rounded-2xl font-black text-lg ethiopic-font flex items-center justify-center transition-all cursor-pointer ${
                    idx === currentTenIndex
                      ? 'bg-[#3D5CEB] text-white scale-110 shadow-md shadow-[#3D5CEB]/30'
                      : 'bg-white border border-stone-200/80 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {ten.geez}
                </button>
              ))}
            </div>

            {/* Flashcard */}
            <div
              onClick={() => {
                audioManager.playTapSound();
                audioManager.playNumber(currentTen.value);
              }}
              className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-[44px] bg-white border-3 border-[#3D5CEB]/30 shadow-xl p-5 flex flex-col items-center justify-center cursor-pointer active:scale-98 transition-transform group"
            >
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-[#3D5CEB] text-xs font-black">
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>አዳምጥ (Tap to Hear)</span>
              </div>

              <div className="text-8xl sm:text-9xl font-black text-stone-900 numeral-display leading-none group-hover:scale-105 transition-transform mt-3">
                {currentTen.geez}
              </div>
            </div>

            {/* Next / Prev Controls */}
            <div className="flex items-center justify-between w-full max-w-xs mt-1">
              <button
                onClick={() => {
                  audioManager.playTapSound();
                  setCurrentTenIndex((prev) => (prev > 0 ? prev - 1 : GEEZ_TENS_AND_HUNDRED.length - 1));
                }}
                className="w-11 h-11 rounded-2xl bg-white border border-stone-200 text-stone-700 flex items-center justify-center cursor-pointer shadow-xs active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-xs font-black text-stone-500">
                {currentTenIndex + 1} ከ {GEEZ_TENS_AND_HUNDRED.length}
              </span>

              <button
                onClick={() => {
                  audioManager.playTapSound();
                  setCurrentTenIndex((prev) => (prev < GEEZ_TENS_AND_HUNDRED.length - 1 ? prev + 1 : 0));
                }}
                className="w-11 h-11 rounded-2xl bg-white border border-stone-200 text-stone-700 flex items-center justify-center cursor-pointer shadow-xs active:scale-90"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* ADDITIVE COMBINER PLAYGROUND */
          <div className="w-full flex flex-col items-center gap-3">
            {/* Merging Stage Card */}
            <div
              onClick={() => {
                audioManager.playTapSound();
                audioManager.playNumber(totalVal);
              }}
              className="relative w-full max-w-xs h-40 bg-white rounded-[36px] border-3 border-stone-200/90 shadow-md p-4 flex items-center justify-center overflow-hidden cursor-pointer active:scale-98"
            >
              <div className="absolute top-2 right-3 text-stone-400">
                <Volume2 className="w-4 h-4" />
              </div>

              {!isMerged ? (
                /* Unmerged parts */
                <div className="flex items-center gap-3">
                  <div className="w-20 h-24 rounded-2xl bg-indigo-50 border-2 border-[#3D5CEB] flex items-center justify-center text-4xl font-black text-[#3D5CEB] ethiopic-font shadow-xs">
                    {activeTenItem.geez}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 font-black text-lg">
                    +
                  </div>
                  <div className="w-20 h-24 rounded-2xl bg-rose-50 border-2 border-[#E04E2C] flex items-center justify-center text-4xl font-black text-[#E04E2C] ethiopic-font shadow-xs">
                    {activeUnitItem.geez}
                  </div>
                </div>
              ) : (
                /* Merged Result */
                <div className="flex flex-col items-center justify-center animate-pop-in">
                  <div className="text-7xl font-black text-[#0C8A65] ethiopic-font numeral-display animate-combine-pulse">
                    {combinedGeez}
                  </div>
                  <div className="mt-1 text-xs font-black text-stone-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {activeTenItem.geez} + {activeUnitItem.geez} = {combinedGeez}
                  </div>
                </div>
              )}
            </div>

            {/* Merge CTA Button */}
            {!isMerged ? (
              <button
                onClick={handleMergeAction}
                className="py-2.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>አጣምር! (Tap to Combine)</span>
              </button>
            ) : (
              <button
                onClick={() => setIsMerged(false)}
                className="py-1.5 px-4 rounded-xl bg-stone-100 text-stone-600 font-bold text-xs cursor-pointer hover:bg-stone-200"
              >
                እንደገና አሳይ (Show Separate)
              </button>
            )}

            {/* Quick Pick Tens & Units - Clean 5-column grid showing ALL 10-100 and ALL 1-9 at once! */}
            <div className="w-full flex flex-col gap-2.5 mt-1 bg-stone-50/80 p-2.5 rounded-2xl border border-stone-200/70">
              <div>
                <span className="text-[11px] font-black text-stone-500 uppercase tracking-wider block mb-1">
                  የአሥር ምልክት ምረጡ (፲ እስከ ፻)
                </span>
                <div className="grid grid-cols-5 gap-1.5 w-full">
                  {GEEZ_TENS_AND_HUNDRED.map((t) => (
                    <button
                      key={t.geez}
                      onClick={() => {
                        setSelectedTensVal(t.value);
                      }}
                      className={`h-9 sm:h-10 rounded-xl font-black text-base sm:text-lg ethiopic-font flex items-center justify-center transition-all cursor-pointer ${
                        selectedTensVal === t.value
                          ? 'bg-[#3D5CEB] text-white shadow-xs ring-2 ring-[#3D5CEB]/30'
                          : 'bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 active:scale-95'
                      }`}
                    >
                      {t.geez}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-black text-stone-500 uppercase tracking-wider block mb-1">
                  የአንድ ምልክት ምረጡ (፩ እስከ ፱)
                </span>
                <div className="grid grid-cols-5 gap-1.5 w-full">
                  {GEEZ_UNITS.map((u) => (
                    <button
                      key={u.geez}
                      onClick={() => {
                        setSelectedUnitsVal(u.value);
                      }}
                      className={`h-9 sm:h-10 rounded-xl font-black text-base sm:text-lg ethiopic-font flex items-center justify-center transition-all cursor-pointer ${
                        selectedUnitsVal === u.value
                          ? 'bg-[#E04E2C] text-white shadow-xs ring-2 ring-[#E04E2C]/30'
                          : 'bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 active:scale-95'
                      }`}
                    >
                      {u.geez}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer: Play Game CTA */}
      <div className="w-full flex flex-col gap-3 pt-2 border-t border-stone-200/70">
        <button
          onClick={() => {
            audioManager.playTapSound();
            onStartGame();
          }}
          className="w-full py-4 px-4 rounded-2xl bg-[#3D5CEB] hover:bg-[#324cc9] text-white font-black text-base shadow-lg shadow-[#3D5CEB]/30 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>ወደ ጨዋታው ሂድ! 🎮 (Play Combination Game)</span>
        </button>

        <MascotGelada
          size={54}
          expression="proud"
          variant="inline"
          message="የአሥር እና የአንድ ምልክቶች ተደምረው አዳዲስ ቁጥሮች ይፈጥራሉ!"
        />
      </div>
    </div>
  );
};

