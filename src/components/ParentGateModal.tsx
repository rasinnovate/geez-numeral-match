/**
 * ParentGateModal - 4-digit PIN verification modal
 * Matches the Ras Kids grown-ups security gate.
 */

import React, { useState } from 'react';
import { ChevronLeft, Delete, ShieldAlert } from 'lucide-react';
import { getParentPin } from '../lib/storageService.ts';
import { audioManager } from '../lib/audioManager.ts';

interface ParentGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [shaking, setShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const correctPin = getParentPin();

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    audioManager.playTapSound();
    const nextPin = pin + digit;
    setPin(nextPin);
    setErrorMessage('');

    if (nextPin.length === 4) {
      if (nextPin === correctPin) {
        audioManager.playSuccessChime();
        setPin('');
        onSuccess();
      } else {
        audioManager.playGentleRetry();
        setShaking(true);
        setErrorMessage('የተሳሳተ የይለፍ ቃል ነው (Default: 1234)');
        setTimeout(() => {
          setShaking(false);
          setPin('');
        }, 700);
      }
    }
  };

  const handleBackspace = () => {
    audioManager.playTapSound();
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-ras-fade"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-[320px] rounded-[32px] bg-[#111114] text-[#F4F4F2] shadow-2xl overflow-hidden flex flex-col p-5 border border-white/10 animate-pop-in">
        {/* Header back button */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => {
              audioManager.playTapSound();
              setPin('');
              onClose();
            }}
            className="flex items-center gap-1 text-xs font-bold text-stone-400 active:opacity-70 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            ተመለስ
          </button>
          <span className="text-[10px] tracking-wider uppercase text-emerald-400 font-mono font-bold">
            Parent Gate
          </span>
        </div>

        {/* Lock icon & Title */}
        <div className="flex flex-col items-center mt-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-2.5">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-xl font-black text-white text-center leading-tight">
            የወላጆች ክፍል
          </h2>
          <p className="text-xs text-stone-400 text-center mt-1">
            ለመግባት ባለ 4-ዲጂት ሚስጥር ቁጥር ያስገቡ
          </p>

          {/* PIN dots */}
          <div
            className={`flex items-center gap-4 mt-4 mb-2 ${
              shaking ? 'animate-shake' : ''
            }`}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border-2 transition-all duration-150"
                style={{
                  background: i < pin.length ? '#10B981' : 'transparent',
                  borderColor: i < pin.length ? '#10B981' : 'rgba(255,255,255,0.3)',
                  transform: i < pin.length ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>

          <p className="text-[11px] font-bold text-rose-400 min-h-[16px] text-center">
            {errorMessage}
          </p>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          {keys.map((k, idx) => {
            if (k === '') {
              return <div key={`empty-${idx}`} />;
            }
            if (k === 'del') {
              return (
                <button
                  key="del"
                  onClick={handleBackspace}
                  className="h-13 rounded-2xl bg-white/10 flex items-center justify-center text-stone-300 active:scale-95 transition-transform cursor-pointer hover:bg-white/15"
                  aria-label="Delete"
                >
                  <Delete className="w-5 h-5" />
                </button>
              );
            }
            return (
              <button
                key={k}
                onClick={() => handleDigit(k)}
                className="h-13 rounded-2xl bg-white/10 text-xl font-bold text-white flex items-center justify-center active:scale-95 transition-transform cursor-pointer hover:bg-white/15 shadow-inner"
              >
                {k}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

