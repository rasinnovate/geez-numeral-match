/**
 * ParentProgressModal - Detailed Learning Progress Dashboard for Parents
 */

import React, { useState } from 'react';
import { X, Award, RotateCcw, Flame, CheckCircle, TrendingUp, Info } from 'lucide-react';
import { UserProgressSchema } from '../types/index.ts';
import { audioManager } from '../lib/audioManager.ts';

interface ParentProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgressSchema;
  onResetProgress: () => void;
  onToggleStreakFreeze: () => void;
}

export const ParentProgressModal: React.FC<ParentProgressModalProps> = ({
  isOpen,
  onClose,
  progress,
  onResetProgress,
  onToggleStreakFreeze,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const l1Accuracy =
    progress.level1.totalAttempts > 0
      ? Math.round(
          (progress.level1.totalCorrect / progress.level1.totalAttempts) * 100
        )
      : 0;

  const l2Accuracy =
    progress.level2.totalAttempts > 0
      ? Math.round(
          (progress.level2.totalCorrect / progress.level2.totalAttempts) * 100
        )
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none animate-ras-fade"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-[#FBFAF7] rounded-[32px] border border-stone-200 shadow-2xl p-5 flex flex-col gap-4 max-h-[90vh] overflow-y-auto no-scrollbar animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0C8A65]/10 text-[#0C8A65] flex items-center justify-center text-xl font-bold">
              📊
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                የመማር እድገት (Learning Progress)
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Ge'ez Numeral Match · Ras Kids Family Zone
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audioManager.playTapSound();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-stone-200/60 flex items-center justify-center text-stone-600 hover:bg-stone-300 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streak & Freeze Banner */}
        <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Flame className="w-6 h-6 fill-amber-500 text-amber-500 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">
                የዕለቱ የጥናት ሰንሰለት (Streak)
              </div>
              <div className="text-sm font-extrabold text-amber-700">
                {progress.currentStreak} ቀናት (Days Active)
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              audioManager.playTapSound();
              onToggleStreakFreeze();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              progress.streakFrozen
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-amber-300 text-amber-800'
            }`}
          >
            {progress.streakFrozen ? '❄️ Freeze Active' : '❄️ Freeze Streak'}
          </button>
        </div>

        {/* Level 1 Stats Card */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                1
              </span>
              <span className="font-extrabold text-stone-800 text-sm">
                ደረጃ ፩: ነጠላ ቁጥሮች (1–10)
              </span>
            </div>
            <span className="text-xs font-bold text-[#0C8A65] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {l1Accuracy}% ትክክለኛነት
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-stone-50 rounded-xl p-2.5">
              <div className="text-lg font-black text-stone-900">
                {progress.level1.completedRounds}
              </div>
              <div className="text-[10px] text-stone-500 font-bold">
                ያለቁ ጨዋታዎች
              </div>
            </div>
            <div className="bg-stone-50 rounded-xl p-2.5">
              <div className="text-lg font-black text-amber-600">
                ⭐ {progress.level1.stars}
              </div>
              <div className="text-[10px] text-stone-500 font-bold">
                የተገኙ ኮከቦች
              </div>
            </div>
            <div className="bg-stone-50 rounded-xl p-2.5">
              <div className="text-lg font-black text-stone-900">
                {progress.level1.totalCorrect}/{progress.level1.totalAttempts}
              </div>
              <div className="text-[10px] text-stone-500 font-bold">
                ትክክል መልሶች
              </div>
            </div>
          </div>
        </div>

        {/* Level 2 Stats Card */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                2
              </span>
              <span className="font-extrabold text-stone-800 text-sm">
                ደረጃ ፪: ድምር ቁጥሮች (11–99)
              </span>
            </div>
            <span className="text-xs font-bold text-[#3D5CEB] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              {l2Accuracy}% ትክክለኛነት
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-stone-50 rounded-xl p-2.5">
              <div className="text-lg font-black text-stone-900">
                {progress.level2.completedRounds}
              </div>
              <div className="text-[10px] text-stone-500 font-bold">
                ያለቁ ጨዋታዎች
              </div>
            </div>
            <div className="bg-stone-50 rounded-xl p-2.5">
              <div className="text-lg font-black text-amber-600">
                ⭐ {progress.level2.stars}
              </div>
              <div className="text-[10px] text-stone-500 font-bold">
                የተገኙ ኮከቦች
              </div>
            </div>
            <div className="bg-stone-50 rounded-xl p-2.5">
              <div className="text-lg font-black text-stone-900">
                {progress.level2.totalCorrect}/{progress.level2.totalAttempts}
              </div>
              <div className="text-[10px] text-stone-500 font-bold">
                ትክክል መልሶች
              </div>
            </div>
          </div>
        </div>

        {/* Pedagogical Note for Parents */}
        <div className="p-3 bg-stone-100 rounded-2xl flex items-start gap-2.5 text-stone-600 text-xs">
          <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>የትምህርት መመሪያ፡</strong> የግዕዝ ቁጥሮች ዜሮ የላቸውም። 23 ሲጻፍ ፳ (20) እና ፫ (3) ተደምረው ፳፫ ይሆናሉ። ይህ መተግበሪያ ልጆች የዚህን ጥንታዊ ሥርዓት እውነተኛ ሂሳብ እንዲረዱ ያስችላል።
          </p>
        </div>

        {/* Recent Activity History */}
        {progress.recentActivity && progress.recentActivity.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col gap-2">
            <span className="text-xs font-black text-stone-700 uppercase tracking-wider">
              የቅርብ ጊዜ እንቅስቃሴዎች (Recent Sessions)
            </span>
            <div className="flex flex-col divide-y divide-stone-100 max-h-36 overflow-y-auto">
              {progress.recentActivity.map((act, i) => (
                <div
                  key={i}
                  className="py-2 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-stone-800">
                      ደረጃ {act.level === 1 ? '፩' : '፪'} · {act.modeOrStage}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-500 font-semibold">
                    <span>
                      {act.correctAnswers}/{act.totalQuestions} ({act.accuracy}%)
                    </span>
                    <span className="text-amber-500">+{act.starsEarned}⭐</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset Progress Section */}
        <div className="pt-2 border-t border-stone-200">
          {!showConfirmReset ? (
            <button
              onClick={() => {
                audioManager.playTapSound();
                setShowConfirmReset(true);
              }}
              className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-500 text-xs font-bold hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              ውጤቶችን እንደ አዲስ ጀምር (Reset Progress)
            </button>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col gap-2">
              <p className="text-xs font-bold text-rose-800 text-center">
                እርግጠኛ ነዎት ሁሉንም የተጠራቀመ ውጤት ማጥፋት ይፈልጋሉ?
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    audioManager.playTapSound();
                    setShowConfirmReset(false);
                  }}
                  className="flex-1 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-bold cursor-pointer"
                >
                  ተው (Cancel)
                </button>
                <button
                  onClick={() => {
                    audioManager.playTapSound();
                    onResetProgress();
                    setShowConfirmReset(false);
                  }}
                  className="flex-1 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer shadow-xs"
                >
                  አዎ አጥፋ (Reset)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

