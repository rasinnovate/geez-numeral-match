/**
 * Mascot Avatar ("Anbessa" / አንበሳ - The Lion Cub)
 *
 * Visual representation matching the Ras Kids ecosystem:
 * - Green hood (#0C8A65)
 * - Two rounded ears touching at the top center
 * - Buttery yellow inner face (#FFF4BA -> #FEF08A)
 * - Warm dark chocolate oval eyes (#38200F)
 * - Cinnamon rounded nose (#8C4318)
 * - Expressive moods ('proud', 'encouraging', 'gently-concerned')
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotExpression } from '../types/index.ts';

export interface MascotGeladaProps {
  expression?: MascotExpression;
  size?: number;
  className?: string;
  isSpeaking?: boolean;
  message?: string;
  variant?: 'greeting' | 'inline' | 'compact';
  onTap?: () => void;
}

export const MascotGelada: React.FC<MascotGeladaProps> = ({
  expression = 'encouraging',
  size = 96,
  className = '',
  isSpeaking = false,
  message,
  variant = 'inline',
  onTap,
}) => {
  const isProud = expression === 'proud';
  const isConcerned = expression === 'gently-concerned';

  const avatarSvg = (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`w-full h-full select-none ${
        isProud ? 'animate-bounce' : isSpeaking ? 'animate-pulse' : ''
      }`}
      style={{
        filter:
          'drop-shadow(0 4px 10px rgba(12, 138, 101, 0.28)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))',
      }}
      aria-label={`Mascot Anbessa expressing ${expression}`}
    >
      <defs>
        <linearGradient id="anbessaFaceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF4BA" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
      </defs>

      {/* Round Ears at top */}
      <circle cx="33" cy="24" r="13.5" fill="#0C8A65" />
      <circle cx="67" cy="24" r="13.5" fill="#0C8A65" />

      {/* Outer Head Circle (Thick Green Hood) */}
      <circle cx="50" cy="56" r="39" fill="#0C8A65" />

      {/* Inner Face Circle (Warm Buttery Yellow) */}
      <circle
        cx="50"
        cy="56"
        r="29"
        fill="url(#anbessaFaceGrad)"
        stroke="#FDE047"
        strokeWidth="0.8"
      />

      {/* Eyes & Mouth based on expression */}
      {isProud ? (
        <g id="anbessa-proud">
          {/* Joyful crescent eyes */}
          <path
            d="M 37 51 Q 41 44 45 51"
            fill="none"
            stroke="#38200F"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 55 51 Q 59 44 63 51"
            fill="none"
            stroke="#38200F"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Cheerful open mouth */}
          <path
            d="M 44 67 Q 50 76 56 67 Z"
            fill="#DC2626"
            stroke="#8C4318"
            strokeWidth="1.2"
          />
        </g>
      ) : isConcerned ? (
        <g id="anbessa-concerned">
          {/* Gentle caring brows */}
          <path
            d="M 37 42 Q 41 39 45 42"
            fill="none"
            stroke="#8C4318"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 55 42 Q 59 39 63 42"
            fill="none"
            stroke="#8C4318"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Soft eyes */}
          <ellipse cx="41" cy="51" rx="3.5" ry="5.2" fill="#38200F" />
          <circle cx="42" cy="49.5" r="1.3" fill="#FFFFFF" />
          <ellipse cx="59" cy="51" rx="3.5" ry="5.2" fill="#38200F" />
          <circle cx="60" cy="49.5" r="1.3" fill="#FFFFFF" />
          {/* Small comforting smile */}
          <path
            d="M 46 69 Q 50 72 54 69"
            fill="none"
            stroke="#8C4318"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      ) : (
        <g id="anbessa-encouraging">
          {/* Bright attentive eyes */}
          <ellipse
            cx={isSpeaking ? 42 : 41}
            cy={isSpeaking ? 52 : 50}
            rx="3.5"
            ry="5.5"
            fill="#38200F"
          />
          <circle
            cx={isSpeaking ? 43 : 42}
            cy={isSpeaking ? 50.5 : 48.5}
            r="1.4"
            fill="#FFFFFF"
          />
          <ellipse
            cx={isSpeaking ? 60 : 59}
            cy={isSpeaking ? 52 : 50}
            rx="3.5"
            ry="5.5"
            fill="#38200F"
          />
          <circle
            cx={isSpeaking ? 61 : 60}
            cy={isSpeaking ? 50.5 : 48.5}
            r="1.4"
            fill="#FFFFFF"
          />
          {/* Gentle sweet smile */}
          <path
            d="M 46 68 Q 50 72 54 68"
            fill="none"
            stroke="#8C4318"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Cinnamon Cub Nose */}
      <path
        d="M 45 58 C 45 56.5, 55 56.5, 55 58 C 55 62, 52 64.5, 50 64.5 C 48 64.5, 45 62, 45 58 Z"
        fill="#8C4318"
      />
    </svg>
  );

  if (variant === 'compact') {
    return (
      <div
        onClick={onTap}
        className={`relative shrink-0 select-none cursor-pointer active:scale-95 transition-transform ${className}`}
        style={{ width: size, height: size }}
      >
        {avatarSvg}
      </div>
    );
  }

  if (variant === 'greeting') {
    return (
      <div className={`flex flex-col items-center gap-2.5 ${className}`}>
        <motion.div
          onClick={onTap}
          whileTap={{ scale: 0.95 }}
          className="relative shrink-0 select-none cursor-pointer"
          style={{ width: size, height: size }}
        >
          {avatarSvg}
        </motion.div>
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="bg-white/95 backdrop-blur-xs rounded-2xl border-2 border-[#0C8A65]/25 px-4 py-2 text-center shadow-sm max-w-[320px]"
            >
              <p className="text-sm sm:text-base font-bold text-[#0C8A65] leading-snug ethiopic-font">
                {message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default 'inline' layout with side speech bubble
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        onClick={onTap}
        whileTap={{ scale: 0.92 }}
        className="relative shrink-0 select-none cursor-pointer"
        style={{ width: size, height: size }}
      >
        {avatarSvg}
      </motion.div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, x: -6, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white text-[#141414] px-3.5 py-2 rounded-2xl border-2 border-[#0C8A65]/25 shadow-sm text-xs sm:text-sm font-semibold max-w-[280px] leading-snug ethiopic-font"
          >
            {message}
            {/* Bubble pointer triangle */}
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[8px] border-r-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

