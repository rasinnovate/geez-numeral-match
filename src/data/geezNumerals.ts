/**
 * Centralized Ge'ez Numeral Dataset and Pedagogical Utilities
 * 
 * Ge'ez numerals are an additive, non-positional numeral system with no zero symbol.
 * Level 1: Single digits ፩ to ፲ (1-10)
 * Level 2: Tens ፲ to ፺ (10-90) and additive combinations (11 to 99), e.g. ፳ + ፫ = ፳፫ (23).
 */

import { NumeralItem } from '../types/index.ts';

/**
 * Fundamental Unit Numerals (1 to 9)
 */
export const GEEZ_UNITS: NumeralItem[] = [
  { geez: '፩', value: 1, amharicName: 'አንድ', phonetic: 'and', englishName: 'One', type: 'unit' },
  { geez: '፪', value: 2, amharicName: 'ሁለት', phonetic: 'hulet', englishName: 'Two', type: 'unit' },
  { geez: '፫', value: 3, amharicName: 'ሦስት', phonetic: 'sost', englishName: 'Three', type: 'unit' },
  { geez: '፬', value: 4, amharicName: 'አራት', phonetic: 'arat', englishName: 'Four', type: 'unit' },
  { geez: '፭', value: 5, amharicName: 'አምስት', phonetic: 'amist', englishName: 'Five', type: 'unit' },
  { geez: '፮', value: 6, amharicName: 'ስድስት', phonetic: 'sidist', englishName: 'Six', type: 'unit' },
  { geez: '፯', value: 7, amharicName: 'ሰባት', phonetic: 'sebat', englishName: 'Seven', type: 'unit' },
  { geez: '፰', value: 8, amharicName: 'ስምንት', phonetic: 'simint', englishName: 'Eight', type: 'unit' },
  { geez: '፱', value: 9, amharicName: 'ዘጠኝ', phonetic: 'zetegn', englishName: 'Nine', type: 'unit' },
];

/**
 * Fundamental Tens Numerals (10 to 90)
 */
export const GEEZ_TENS: NumeralItem[] = [
  { geez: '፲', value: 10, amharicName: 'አሥር', phonetic: 'asir', englishName: 'Ten', type: 'ten' },
  { geez: '፳', value: 20, amharicName: 'ሃያ', phonetic: 'haya', englishName: 'Twenty', type: 'ten' },
  { geez: '፴', value: 30, amharicName: 'ሠላሳ', phonetic: 'selasa', englishName: 'Thirty', type: 'ten' },
  { geez: '፵', value: 40, amharicName: 'አርባ', phonetic: 'arba', englishName: 'Forty', type: 'ten' },
  { geez: '፶', value: 50, amharicName: 'ኃምሳ', phonetic: 'hamsa', englishName: 'Fifty', type: 'ten' },
  { geez: '፷', value: 60, amharicName: 'ስድሳ', phonetic: 'sidsa', englishName: 'Sixty', type: 'ten' },
  { geez: '፸', value: 70, amharicName: 'ሰባ', phonetic: 'seba', englishName: 'Seventy', type: 'ten' },
  { geez: '፹', value: 80, amharicName: 'ሰማንያ', phonetic: 'semanya', englishName: 'Eighty', type: 'ten' },
  { geez: '፺', value: 90, amharicName: 'ዘጠና', phonetic: 'zetena', englishName: 'Ninety', type: 'ten' },
];

/**
 * Ge'ez Hundred (100)
 */
export const GEEZ_HUNDRED: NumeralItem = {
  geez: '፻',
  value: 100,
  amharicName: 'መቶ',
  phonetic: 'meto',
  englishName: 'Hundred',
  type: 'hundred',
};

/**
 * All Tens and Hundred
 */
export const GEEZ_TENS_AND_HUNDRED: NumeralItem[] = [
  ...GEEZ_TENS,
  GEEZ_HUNDRED,
];

/**
 * Level 1 Full Scope: ፩ through ፲ (1 to 10)
 */
export const LEVEL_1_NUMERALS: NumeralItem[] = [
  ...GEEZ_UNITS,
  GEEZ_TENS[0], // ፲ (10)
];

/**
 * Lookup maps
 */
export const UNIT_BY_VALUE = new Map<number, NumeralItem>(
  GEEZ_UNITS.map((item) => [item.value, item])
);

export const TEN_BY_VALUE = new Map<number, NumeralItem>(
  GEEZ_TENS_AND_HUNDRED.map((item) => [item.value, item])
);

/**
 * Decompose a number (1-109) into its additive Ge'ez components
 */
export function decomposeToGeez(num: number): {
  arabic: number;
  geez: string;
  tensValue?: number;
  tensSymbol?: string;
  unitsValue?: number;
  unitsSymbol?: string;
  amharicName: string;
  englishName: string;
} {
  if (num < 1 || num > 109) {
    throw new Error(`Number ${num} out of supported 1-109 range`);
  }

  if (num === 100) {
    return {
      arabic: 100,
      geez: GEEZ_HUNDRED.geez,
      tensValue: 100,
      tensSymbol: GEEZ_HUNDRED.geez,
      amharicName: GEEZ_HUNDRED.amharicName,
      englishName: GEEZ_HUNDRED.englishName,
    };
  }

  if (num > 100) {
    const unitsVal = num - 100;
    const unitItem = UNIT_BY_VALUE.get(unitsVal)!;
    return {
      arabic: num,
      geez: `${GEEZ_HUNDRED.geez}${unitItem.geez}`,
      tensValue: 100,
      tensSymbol: GEEZ_HUNDRED.geez,
      unitsValue: unitsVal,
      unitsSymbol: unitItem.geez,
      amharicName: `መቶ ${unitItem.amharicName}`,
      englishName: `One hundred ${unitItem.englishName}`,
    };
  }

  // Exact tens or single units
  if (num <= 9) {
    const unit = UNIT_BY_VALUE.get(num)!;
    return {
      arabic: num,
      geez: unit.geez,
      unitsValue: num,
      unitsSymbol: unit.geez,
      amharicName: unit.amharicName,
      englishName: unit.englishName,
    };
  }

  const tensVal = Math.floor(num / 10) * 10;
  const unitsVal = num % 10;
  const tenItem = TEN_BY_VALUE.get(tensVal)!;

  if (unitsVal === 0) {
    return {
      arabic: num,
      geez: tenItem.geez,
      tensValue: tensVal,
      tensSymbol: tenItem.geez,
      amharicName: tenItem.amharicName,
      englishName: tenItem.englishName,
    };
  }

  const unitItem = UNIT_BY_VALUE.get(unitsVal)!;
  const combinedGeez = `${tenItem.geez}${unitItem.geez}`;
  const amharicName = `${tenItem.amharicName} ${unitItem.amharicName}`;
  const englishName = `${tenItem.englishName}-${unitItem.englishName}`;

  return {
    arabic: num,
    geez: combinedGeez,
    tensValue: tensVal,
    tensSymbol: tenItem.geez,
    unitsValue: unitsVal,
    unitsSymbol: unitItem.geez,
    amharicName,
    englishName,
  };
}

/**
 * Generate a friendly set of representative Level 2 additive combination numbers (11 to 99)
 * Designed for a gentle learning curve for 6-8 year olds.
 */
export const CURATED_LEVEL_2_COMBINATIONS: number[] = [
  // Intro to tens: 10 + units (teens)
  11, 12, 13, 15, 17, 18,
  // 20s
  21, 23, 24, 25, 27, 28,
  // 30s
  32, 33, 35, 36, 39,
  // 40s
  41, 44, 45, 47,
  // 50s
  52, 55, 58,
  // 60s
  63, 66, 67,
  // 70s
  72, 75, 77,
  // 80s
  81, 84, 88,
  // 90s
  93, 95, 99,
];

/**
 * Historical facts and discovery points
 */
export const NO_ZERO_DISCOVERY_FACTS = {
  titleAm: 'የዜሮ ምስጢር በግዕዝ ቁጥሮች',
  titleEn: 'The Mystery of Zero in Ge’ez',
  mainPointAm: 'የግዕዝ የቁጥር ሥርዓት ለዜሮ የተለየ ምልክት የለውም!',
  mainPointEn: 'The Ge’ez numeral system does not have a zero symbol!',
  explanationAm: 'በግዕዝ ቁጥሮች ፳ (ሃያ) እና ፫ (ሦስት) ተደምረው ፳፫ (23) ይሆናሉ እንጂ ዜሮ ተቀምጦ የሚሰራ አይደለም። ይህም ከ2000 ዓመታት በላይ ሲሰራበት የቆየ ድንቅ ጥንታዊ ጥበብ ነው።',
  explanationEn: 'In Ge’ez, twenty (፳) and three (፫) combine directly into ፳፫ (23) by adding values together. For over 2,000 years, Ethiopian calendars, books, and stone inscriptions have used this unique additive math!',
  examples: [
    { geez: '፲', arabic: 10, note: 'አሥር (Ten) - A single symbol represents 10 directly without a zero!' },
    { geez: '፳፫', arabic: 23, formula: '፳ (20) + ፫ (3) = ፳፫ (23)', note: 'Additive combination (20 + 3)' },
    { geez: '፶፭', arabic: 55, formula: '፶ (50) + ፭ (5) = ፶፭ (55)', note: 'Additive combination (50 + 5)' },
  ],
};

