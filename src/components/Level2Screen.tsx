/**
 * Level2Screen - Interactive Additive Numeral Combinations Game (11 to 99)
 *
 * Adheres strictly to pedagogy requirements:
 * 1. NO Arabic numerals and NO written Amharic text on quiz cards.
 * 2. Number name sound is ALWAYS played!
 * 3. Pure Ge'ez additive mechanics.
 * 4. Responsive touch design for mobile devices.
 */

import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Check } from 'lucide-react';
import { Level2GameStage, Level2Question, ActivityResult, ChoiceOption } from '../types/index.ts';
import { generateLevel2Question } from '../lib/questionGenerator.ts';
import { MascotGelada } from './MascotGelada.tsx';
import { audioManager } from '../lib/audioManager.ts';
import { requestHaptic } from '../lib/storageService.ts';

interface Level2ScreenProps {
  initialStage?: Level2GameStage;
  totalQuestions?: number;
  onComplete: (result: ActivityResult) => void;
  onExit: () => void;
}

export const Level2Screen: React.FC<Level2ScreenProps> = ({
  initialStage = 'additive-build' as Level2GameStage,
  totalQuestions = 5,
  onComplete,
  onExit,
}) => {
  const [stage, setStage] = useState<Level2GameStage>(initialStage);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [question, setQuestion] = useState<Level2Question>(() =>
    generateLevel2Question(initialStage, 0)
  );

  // Additive build state
  const [selectedTensId, setSelectedTensId] = useState<string | null>(null);
  const [selectedUnitsId, setSelectedUnitsId] = useState<string | null>(null);
  const [isCombined, setIsCombined] = useState(false);

  // Single choice state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [mascotMessage, setMascotMessage] = useState<string>('');
  const [mascotExpression, setMascotExpression] = useState<'encouraging' | 'proud' | 'gently-concerned'>('encouraging');
  const [startTime] = useState<number>(Date.now());

  // Number name sound is ALWAYS played on each question load!
  useEffect(() => {
    setSelectedTensId(null);
    setSelectedUnitsId(null);
    setIsCombined(false);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(false);

    audioManager.playNumber(question.targetNumber);

    if (stage === 'tens-recognition') {
      setMascotMessage('የአሥር ቤቱን ምልክት ምረጡ!');
    } else if (stage === 'additive-build') {
      setMascotMessage('መጀመሪያ የአሥር፣ ቀጥሎ የአንድ ምልክቱን ምረጡ!');
    } else {
      setMascotMessage('የተጣመሩትን ክፍሎች ምረጡ!');
    }
  }, [questionIndex, stage]);

  // Handle single choice option selection
  const handleSelectOption = (option: ChoiceOption) => {
    if (isAnswered && isCorrect) return;

    setSelectedOptionId(option.id);
    const correct = option.id === question.correctOptionId;

    // Play sound of selected option
    audioManager.playNumber(option.numericValue);

    if (correct) {
      setIsAnswered(true);
      setIsCorrect(true);
      setCorrectCount((prev) => prev + 1);
      setMascotExpression('proud');
      setMascotMessage('ጎበዝ! ትክክል ነው!');

      audioManager.playSuccessChime();
      requestHaptic('success');

      setTimeout(() => {
        handleNextQuestion();
      }, 1400);
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

  // Handle 2-Step Additive Selection
  const handleBuildSelect = (type: 'tens' | 'units', option: ChoiceOption) => {
    if (isCombined) return;

    // Play sound of tapped component
    audioManager.playNumber(option.numericValue);

    if (type === 'tens') {
      const isTargetTens = option.numericValue === question.tensNumeral.value;
      if (isTargetTens) {
        setSelectedTensId(option.id);
        setMascotExpression('encouraging');
        setMascotMessage('አሪፍ! አሁን የአንድ ምልክቱን ይምረጡ!');
      } else {
        audioManager.playGentleRetry();
        setMascotExpression('gently-concerned');
        setMascotMessage('የአሥር ምልክቱን እንደገና ሞክሩ!');
      }
    } else if (type === 'units') {
      if (!selectedTensId) {
        setMascotMessage('መጀመሪያ የአሥሩን ምልክት ይምረጡ!');
        audioManager.playGentleRetry();
        return;
      }

      const isTargetUnits = option.numericValue === question.unitsNumeral?.value;
      if (isTargetUnits) {
        setSelectedUnitsId(option.id);
        setIsCombined(true);

        audioManager.playCombineSwoosh();
        requestHaptic('success');

        setCorrectCount((prev) => prev + 1);
        setMascotExpression('proud');
        setMascotMessage('ድንቅ ነው! በትክክል አጣመራችሁ!');

        setTimeout(() => {
          audioManager.playNumber(question.targetNumber);
        }, 300);

        setTimeout(() => {
          handleNextQuestion();
        }, 1800);
      } else {
        audioManager.playGentleRetry();
        setMascotExpression('gently-concerned');
        setMascotMessage('የአንድ ምልክቱን እንደገና ሞክሩ!');
      }
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 >= totalQuestions) {
      const totalTimeSeconds = Math.round((Date.now() - startTime) / 1000);
      const accuracy = Math.round((correctCount / totalQuestions) * 100);
      let stars = 1;
      if (accuracy >= 80) stars = 3;
      else if (accuracy >= 60) stars = 2;

      onComplete({
        level: 2,
        modeOrStage: stage,
        totalQuestions,
        correctAnswers: correctCount,
        accuracy,
        starsEarned: stars,
        timeSpentSeconds: totalTimeSeconds,
        completedAt: new Date().toISOString(),
      });
    } else {
      const nextIdx = questionIndex + 1;
      setQuestionIndex(nextIdx);
      setQuestion(generateLevel2Question(stage, nextIdx));
      setMascotExpression('encouraging');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 flex flex-col items-center justify-between min-h-[calc(100vh-80px)] select-none">
      {/* Top Header & Stage Switcher */}
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i < questionIndex
                    ? 'w-6 bg-[#3D5CEB]'
                    : i === questionIndex
                    ? 'w-8 bg-amber-400 animate-pulse'
                    : 'w-4 bg-stone-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-black text-stone-500">
            ደረጃ ፪ · {questionIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Stage Tabs */}
        <div className="flex items-center bg-stone-200/70 p-1 rounded-2xl text-[11px] font-extrabold text-stone-600">
          <button
            onClick={() => {
              audioManager.playTapSound();
              setStage('tens-recognition');
              setQuestionIndex(0);
              setQuestion(generateLevel2Question('tens-recognition', 0));
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              stage === 'tens-recognition'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            አሥሮች
          </button>
          <button
            onClick={() => {
              audioManager.playTapSound();
              setStage('additive-build');
              setQuestionIndex(0);
              setQuestion(generateLevel2Question('additive-build', 0));
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              stage === 'additive-build'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            መገንባት
          </button>
          <button
            onClick={() => {
              audioManager.playTapSound();
              setStage('combined-recognition');
              setQuestionIndex(0);
              setQuestion(generateLevel2Question('combined-recognition', 0));
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              stage === 'combined-recognition'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            ማዛመድ
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-2">
        {stage === 'additive-build' ? (
          /* ADDITIVE COMBINER GAME (NO ARABIC NUMBERS OR WRITTEN AMHARIC TEXT) */
          <div className="w-full flex flex-col items-center gap-3">
            {/* Target Display with Sound */}
            <div
              onClick={() => audioManager.playNumber(question.targetNumber)}
              className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-200/80 rounded-2xl text-xs font-black text-indigo-900 cursor-pointer active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>የታለመው ቁጥር፡</span>
              <span className="text-xl font-black text-[#3D5CEB] ethiopic-font">
                {question.combinedGeez}
              </span>
            </div>

            {/* Combination Card */}
            <div className="relative w-full max-w-xs h-36 bg-white rounded-[32px] border-3 border-stone-200/90 shadow-md p-3 flex items-center justify-center overflow-hidden">
              {!isCombined ? (
                <div className="flex items-center gap-3">
                  {/* Tens slot */}
                  <div
                    className={`w-20 h-22 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                      selectedTensId
                        ? 'bg-indigo-50 border-[#3D5CEB] text-[#3D5CEB] scale-105 shadow-sm'
                        : 'bg-stone-50 border-dashed border-stone-300 text-stone-400'
                    }`}
                  >
                    <span className="text-4xl font-black ethiopic-font">
                      {selectedTensId ? question.tensNumeral.geez : '?'}
                    </span>
                  </div>

                  {/* Plus symbol */}
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 font-black text-lg">
                    +
                  </div>

                  {/* Units slot */}
                  <div
                    className={`w-20 h-22 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                      selectedUnitsId
                        ? 'bg-rose-50 border-[#E04E2C] text-[#E04E2C] scale-105 shadow-sm'
                        : 'bg-stone-50 border-dashed border-stone-300 text-stone-400'
                    }`}
                  >
                    <span className="text-4xl font-black ethiopic-font">
                      {selectedUnitsId ? question.unitsNumeral?.geez : '?'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center animate-pop-in">
                  <div className="text-6xl font-black text-[#0C8A65] ethiopic-font numeral-display animate-combine-pulse">
                    {question.combinedGeez}
                  </div>
                  <div className="mt-1 text-xs font-black text-stone-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                    {question.geezFormula}
                  </div>
                </div>
              )}
            </div>

            {/* Palettes: Tens Row & Units Row (NO ARABIC NUMBERS) */}
            <div className="w-full flex flex-col gap-2.5">
              {/* Tens row */}
              <div>
                <div className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>1. የአሥር ምልክት ምረጡ</span>
                  {selectedTensId && (
                    <span className="text-[#0C8A65] flex items-center gap-1 font-bold">
                      <Check className="w-3 h-3" /> ተመርጧል
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {question.options
                    .filter((opt) => opt.id.startsWith('ten-'))
                    .map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleBuildSelect('tens', opt)}
                        disabled={isCombined}
                        className={`h-14 rounded-2xl border-2 flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
                          selectedTensId === opt.id
                            ? 'bg-indigo-50 border-[#3D5CEB] text-[#3D5CEB] shadow-xs'
                            : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300'
                        }`}
                      >
                        <span className="text-3xl font-black ethiopic-font">
                          {opt.geez}
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Units row */}
              <div>
                <div className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>2. የአንድ ምልክት ምረጡ</span>
                  {selectedUnitsId && (
                    <span className="text-[#0C8A65] flex items-center gap-1 font-bold">
                      <Check className="w-3 h-3" /> ተመርጧል
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {question.options
                    .filter((opt) => opt.id.startsWith('unit-'))
                    .map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleBuildSelect('units', opt)}
                        disabled={isCombined}
                        className={`h-14 rounded-2xl border-2 flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
                          selectedUnitsId === opt.id
                            ? 'bg-rose-50 border-[#E04E2C] text-[#E04E2C] shadow-xs'
                            : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300'
                        }`}
                      >
                        <span className="text-3xl font-black ethiopic-font">
                          {opt.geez}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TENS & COMBINED RECOGNITION (NO ARABIC NUMBERS OR AMHARIC TEXT) */
          <div className="w-full flex flex-col items-center gap-4">
            {/* Numeral Display Card */}
            <div
              onClick={() => audioManager.playNumber(question.targetNumber)}
              className="relative flex flex-col items-center justify-center w-48 h-48 sm:w-56 sm:h-56 rounded-[40px] bg-white border-3 border-stone-200/90 shadow-md cursor-pointer active:scale-98"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  audioManager.playTapSound();
                  audioManager.playNumber(question.targetNumber);
                }}
                className="absolute top-3 right-3 w-10 h-10 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-[#3D5CEB] flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-xs"
                aria-label="Sound"
              >
                <Volume2 className="w-5 h-5 stroke-[2.2] animate-bounce" />
              </button>

              <div className="text-7xl sm:text-8xl font-black text-stone-900 numeral-display leading-none">
                {stage === 'tens-recognition'
                  ? question.tensNumeral.geez
                  : question.combinedGeez}
              </div>
            </div>

            {/* Options */}
            <div className="w-full mt-2">
              <div className="grid grid-cols-3 gap-2.5 w-full">
                {question.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const isOptionCorrect =
                    isAnswered && option.id === question.correctOptionId;
                  const isOptionWrong = isSelected && !isCorrect;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option)}
                      disabled={isAnswered && isCorrect}
                      className={`h-20 sm:h-22 rounded-3xl border-3 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shadow-sm ${
                        isOptionCorrect
                          ? 'bg-emerald-50 border-[#0C8A65] text-[#0C8A65] scale-105 shadow-md'
                          : isOptionWrong
                          ? 'bg-rose-50 border-rose-400 text-rose-600 animate-shake'
                          : isSelected
                          ? 'bg-amber-50 border-amber-400 text-amber-700'
                          : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl font-black ethiopic-font">
                        {stage === 'tens-recognition'
                          ? option.geez
                          : option.partsFormula}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mascot Guidance */}
      <div className="w-full mt-2 pt-2 border-t border-stone-200/70">
        <MascotGelada
          size={56}
          expression={mascotExpression}
          variant="inline"
          message={mascotMessage}
          onTap={() => {
            audioManager.playTapSound();
            audioManager.playNumber(question.targetNumber);
          }}
        />
      </div>
    </div>
  );
};
