/**
 * QuantityDotCard - Child-friendly tactile dot pattern visualizer (1 to 10)
 * Uses established ten-frame and dice dot configurations so kids can subitize easily.
 */

import React from 'react';

interface QuantityDotCardProps {
  count: number;
  isSelected?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const DOT_COLORS = [
  '#E04E2C', // Coral Red
  '#0C8A65', // Ras Emerald
  '#3D5CEB', // Indigo
  '#FFB020', // Warm Gold
  '#8A46EC', // Purple
  '#E04E2C',
  '#0C8A65',
  '#3D5CEB',
  '#FFB020',
  '#8A46EC',
];

export const QuantityDotCard: React.FC<QuantityDotCardProps> = ({
  count,
  isSelected = false,
  isCorrect = false,
  isIncorrect = false,
  size = 'md',
}) => {
  // Clamp between 1 and 10
  const validCount = Math.max(1, Math.min(10, count));

  // Determine grid layout based on count
  let cols = 2;
  if (validCount === 1) cols = 1;
  else if (validCount === 3) cols = 3;
  else if (validCount === 9) cols = 3;
  else if (validCount >= 7) cols = 5;

  const dotSizeClass =
    size === 'lg'
      ? 'w-4 h-4 sm:w-5 sm:h-5'
      : size === 'md'
      ? 'w-3.5 h-3.5 sm:w-4 sm:h-4'
      : 'w-2.5 h-2.5';

  return (
    <div
      className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 ${
        isCorrect
          ? 'bg-emerald-50 ring-3 ring-emerald-500'
          : isIncorrect
          ? 'bg-rose-50 ring-3 ring-rose-400 opacity-80'
          : isSelected
          ? 'bg-amber-50 ring-3 ring-amber-400'
          : 'bg-white hover:bg-stone-50'
      }`}
    >
      <div
        className="grid gap-2 items-center justify-center place-items-center"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: validCount }).map((_, i) => (
          <div
            key={i}
            className={`${dotSizeClass} rounded-full shadow-xs transition-transform duration-200 transform scale-100 hover:scale-110`}
            style={{
              backgroundColor: isCorrect
                ? '#0C8A65'
                : isIncorrect
                ? '#E04E2C'
                : DOT_COLORS[i % DOT_COLORS.length],
            }}
          />
        ))}
      </div>
    </div>
  );
};

