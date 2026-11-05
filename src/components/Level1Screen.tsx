/**
 * Level1Screen - Interactive Individual Numeral Match Game (፩ to ፲, 1-10)
 *
 * Adheres strictly to pedagogy requirements:
 * 1. NO Arabic numerals and NO written Amharic text on quiz cards.
 * 2. Number name sound is ALWAYS played!
 * 3. Mobile responsiveness optimized for small Android and mobile screens.
 */

import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { Level1GameMode, Level1Question, ChoiceOption, ActivityResult } from '../types/index.ts';
import { generateLevel1Question } from '../lib/questionGenerator.ts';
import { QuantityDotCard } from './QuantityDotCard.tsx';
import { MascotGelada } from './MascotGelada.tsx';
import { audioManager } from '../lib/audioManager.ts';
import { requestHaptic } from '../lib/storageService.ts';

interface Level1ScreenProps {
  initialMode?: Level1GameMode;
  totalQuestions?: number;
  onComplete: (result: ActivityResult) => void;
  onExit: () => void;
}

export const Level1Screen: React.FC<Level1ScreenProps> = ({
  initialMode = 'numeral-to-dots' as Level1GameMode,
  totalQuestions = 5,
  onComplete,
  onExit,
}) => {
  const [mode, setMode] = useState<Level1GameMode>(initialMode);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Level1Question>(() =>
    generateLevel1Question(initialMode, [])
  );
  const [usedValues, setUsedValues] = useState<number[]>([currentQuestion.numeral.value]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [mascotMessage, setMascotMessage] = useState<string>('ትክክለኛውን መልስ ምረጡ!');
  const [mascotExpression, setMascotExpression] = useState<'encouraging' | 'proud' | 'gently-concerned'>('encouraging');
  const [startTime] = useState<number>(Date.now());
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const playCurrentQuestionAudio = () => {
    if (!currentQuestion?.numeral) return;
    setIsPlayingAudio(true);
    audioManager.playNumber(currentQuestion.numeral.value, () => {
      setIsPlayingAudio(false);
    });
  };

  // Number name sound is ALWAYS played on each question load!
  useEffect(() => {
    if (currentQuestion?.numeral) {
      const timer = setTimeout(() => {
        playCurrentQuestionAudio();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion.id, mode]);

  const handleSelectOption = (option: ChoiceOption) => {
    if (isAnswered && isCorrect) return;

    setSelectedOptionId(option.id);
    const correct = option.id === currentQuestion.correctOptionId;

    // Speak the tapped option's number name so the child hears what they tapped
    audioManager.playNumber(option.numericValue);

    if (correct) {
      setIsAnswered(true);
      setIsCorrect(true);
      setCorrectCount((prev) => prev + 1);
      setMascotExpression('proud');
      setMascotMessage('ጎበዝ! በትክክል አዛምዳችኋል!');

      audioManager.playSuccessChime();
      requestHaptic('success');

      // Auto-advance after 1.3 seconds
      setTimeout(() => {
        handleNextQuestion();
      }, 1300);
    } else {
      setIsAnswered(true);
      setIsCorrect(false);
      setMascotExpression('gently-concerned');
      setMascotMessage('አይዟችሁ! እንደገና ሞክሩ!');

      audioManager.playGentleRetry();
      requestHaptic('warning');

      setTimeout(() => {
        setIsAnswered(false);
        setSelectedOptionId(null);
      }, 750);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 >= totalQuestions) {
      const totalTimeSeconds = Math.round((Date.now() - startTime) / 1000);
      const accuracy = Math.round((correctCount / totalQuestions) * 100);
      let stars = 1;
      if (accuracy >= 80) stars = 3;
      else if (accuracy >= 60) stars = 2;

      onComplete({
        level: 1,
        modeOrStage: mode,
        totalQuestions,
        correctAnswers: correctCount,
        accuracy,
        starsEarned: stars,
        timeSpentSeconds: totalTimeSeconds,
        completedAt: new Date().toISOString(),
      });
    } else {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextQ = generateLevel1Question(mode, usedValues);
      setCurrentQuestion(nextQ);
      setUsedValues((prev) => [...prev, nextQ.numeral.value]);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setMascotExpression('encouraging');
      setMascotMessage('ትክክለኛውን መልስ ምረጡ!');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 flex flex-col items-center justify-between min-h-[calc(100vh-80px)] select-none">
      {/* Top Header & Mode Switcher */}
      <div className="w-full flex flex-col gap-2">
        {/* Progress Track */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i < currentQuestionIndex
                    ? 'w-6 bg-[#0C8A65]'
                    : i === currentQuestionIndex
                    ? 'w-8 bg-amber-400 animate-pulse'
                    : 'w-4 bg-stone-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-black text-stone-500">
            ጥያቄ {currentQuestionIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Game Mode Pills */}
        <div className="flex items-center bg-stone-200/70 p-1 rounded-2xl text-[11px] font-extrabold text-stone-600">
          <button
            onClick={() => {
              audioManager.playTapSound();
              setMode('numeral-to-dots');
              setCurrentQuestionIndex(0);
              setCurrentQuestion(generateLevel1Question('numeral-to-dots', []));
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              mode === 'numeral-to-dots'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            ምልክት ➜ ብዛት
          </button>
          <button
            onClick={() => {
              audioManager.playTapSound();
              setMode('dots-to-numeral');
              setCurrentQuestionIndex(0);
              setCurrentQuestion(generateLevel1Question('dots-to-numeral', []));
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              mode === 'dots-to-numeral'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            ብዛት ➜ ምልክት
          </button>
          <button
            onClick={() => {
              audioManager.playTapSound();
              setMode('sound-to-numeral');
              setCurrentQuestionIndex(0);
              setCurrentQuestion(generateLevel1Question('sound-to-numeral', []));
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              mode === 'sound-to-numeral'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            ድምፅ ➜ ምልክት
          </button>
        </div>
      </div>

      {/* Main Numeral Stage */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-2">
        {/* Hero Card - NO ARABIC NUMBERS OR WRITTEN AMHARIC TEXT */}
        <div
          onClick={() => {
            playCurrentQuestionAudio();
          }}
          className="relative flex flex-col items-center justify-center w-48 h-48 sm:w-56 sm:h-56 rounded-[40px] bg-white border-3 border-stone-200/90 shadow-md transition-all active:scale-98 cursor-pointer group"
        >
          {/* Sound play button (shown in visual modes; sound-to-numeral has large centerpiece button) */}
          {mode !== 'sound-to-numeral' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                playCurrentQuestionAudio();
              }}
              className="absolute top-3 right-3 w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#0C8A65] flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-xs"
              aria-label="Hear pronunciation"
            >
              <Volume2 className={`w-5 h-5 stroke-[2.2] ${isPlayingAudio ? 'animate-bounce text-[#0C8A65]' : ''}`} />
            </button>
          )}

          {/* Mode Display: Pure Ge'ez Numeral, or Pure Dots, or Audio Ear */}
          {mode === 'numeral-to-dots' && (
            <div className="text-7xl sm:text-8xl font-black text-stone-900 numeral-display leading-none group-hover:scale-105 transition-transform">
              {currentQuestion.numeral.geez}
            </div>
          )}

          {mode === 'dots-to-numeral' && (
            <div className="p-2">
              <QuantityDotCard count={currentQuestion.numeral.value} size="lg" />
            </div>
          )}

          {mode === 'sound-to-numeral' && (
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isPlayingAudio
                    ? 'bg-emerald-500 text-white ring-8 ring-emerald-200 scale-110 shadow-lg animate-pulse'
                    : 'bg-emerald-100 text-[#0C8A65] group-hover:scale-105'
                }`}
              >
                <Volume2 className={`w-10 h-10 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              </div>
              <span className="text-xs font-black text-[#0C8A65] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                {isPlayingAudio ? 'ድምፁን ያዳምጡ...' : 'እንደገና ለማዳመጥ ይንኩ (Tap)'}
              </span>
            </div>
          )}
        </div>

        {/* 3 Choice Options - Pure Ge'ez or Pure Dots (NO Arabic digits, NO Amharic text) */}
        <div className="w-full mt-5">
          <div className="grid grid-cols-3 gap-2.5 w-full">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isOptionCorrect = isAnswered && option.id === currentQuestion.correctOptionId;
              const isOptionWrong = isSelected && !isCorrect;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered && isCorrect}
                  className={`h-22 sm:h-24 rounded-3xl border-3 flex flex-col items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shadow-sm ${
                    isOptionCorrect
                      ? 'bg-emerald-50 border-[#0C8A65] text-[#0C8A65] scale-105 shadow-md shadow-emerald-200'
                      : isOptionWrong
                      ? 'bg-rose-50 border-rose-400 text-rose-600 animate-shake'
                      : isSelected
                      ? 'bg-amber-50 border-amber-400 text-amber-700'
                      : 'bg-white border-stone-200/90 text-stone-800 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {mode === 'numeral-to-dots' ? (
                    <QuantityDotCard
                      count={option.numericValue}
                      size="sm"
                      isCorrect={isOptionCorrect}
                      isIncorrect={isOptionWrong}
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl font-black ethiopic-font numeral-display">
                      {option.geez}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Mascot Guidance */}
      <div className="w-full mt-2 pt-2 border-t border-stone-200/70">
        <MascotGelada
          size={56}
          expression={mascotExpression}
          variant="inline"
          message={mascotMessage}
          onTap={() => {
            audioManager.playTapSound();
            audioManager.playNumber(currentQuestion.numeral.value);
          }}
        />
      </div>
    </div>
  );
};
