/**
 * Tests for Ge'ez Numerals, Additive Combinations, and Pedagogical Logic
 */

import {
  GEEZ_UNITS,
  GEEZ_TENS,
  GEEZ_HUNDRED,
  GEEZ_TENS_AND_HUNDRED,
  LEVEL_1_NUMERALS,
  decomposeToGeez,
} from './geezNumerals.ts';
import {
  generateLevel1Question,
  generateLevel2Question,
} from '../lib/questionGenerator.ts';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${msg}`);
  }
}

console.log('--- Running Ge\'ez Numeral Match Tests ---');

// 1. Test Units ፩ to ፱
assert(GEEZ_UNITS.length === 9, 'Should have exactly 9 units');
assert(GEEZ_UNITS[0].geez === '፩' && GEEZ_UNITS[0].value === 1, 'Unit 1 is ፩');
assert(GEEZ_UNITS[4].geez === '፭' && GEEZ_UNITS[4].value === 5, 'Unit 5 is ፭');
assert(GEEZ_UNITS[8].geez === '፱' && GEEZ_UNITS[8].value === 9, 'Unit 9 is ፱');
console.log('✓ Units ፩ to ፱ passed');

// 2. Test Tens ፲ to ፺
assert(GEEZ_TENS.length === 9, 'Should have exactly 9 tens');
assert(GEEZ_TENS[0].geez === '፲' && GEEZ_TENS[0].value === 10, 'Ten is ፲');
assert(GEEZ_TENS[1].geez === '፳' && GEEZ_TENS[1].value === 20, 'Twenty is ፳');
assert(GEEZ_TENS[2].geez === '፴' && GEEZ_TENS[2].value === 30, 'Thirty is ፴');
assert(GEEZ_TENS[3].geez === '፵' && GEEZ_TENS[3].value === 40, 'Forty is ፵');
assert(GEEZ_TENS[4].geez === '፶' && GEEZ_TENS[4].value === 50, 'Fifty is ፶');
assert(GEEZ_TENS[5].geez === '፷' && GEEZ_TENS[5].value === 60, 'Sixty is ፷');
assert(GEEZ_TENS[6].geez === '፸' && GEEZ_TENS[6].value === 70, 'Seventy is ፸');
assert(GEEZ_TENS[7].geez === '፹' && GEEZ_TENS[7].value === 80, 'Eighty is ፹');
assert(GEEZ_TENS[8].geez === '፺' && GEEZ_TENS[8].value === 90, 'Ninety is ፺');
console.log('✓ Tens ፲ to ፺ passed');

// 3. Test Level 1 Scope (፩ to ፲)
assert(LEVEL_1_NUMERALS.length === 10, 'Level 1 has exactly 10 numerals');
assert(LEVEL_1_NUMERALS[9].geez === '፲' && LEVEL_1_NUMERALS[9].value === 10, 'Level 1 includes ፲ (10)');
console.log('✓ Level 1 ፩ to ፲ passed');

// 4. Test Additive Combinations (11 to 99)
const test23 = decomposeToGeez(23);
assert(test23.geez === '፳፫', '23 should decompose to ፳፫');
assert(test23.tensValue === 20 && test23.tensSymbol === '፳', '23 tens should be 20 / ፳');
assert(test23.unitsValue === 3 && test23.unitsSymbol === '፫', '23 units should be 3 / ፫');

const test11 = decomposeToGeez(11);
assert(test11.geez === '፲፩', '11 should decompose to ፲፩');

const test45 = decomposeToGeez(45);
assert(test45.geez === '፵፭', '45 should decompose to ፵፭');

const test99 = decomposeToGeez(99);
assert(test99.geez === '፺፱', '99 should decompose to ፺፱');

const test70 = decomposeToGeez(70);
assert(test70.geez === '፸', '70 exact tens should be ፸ without zero');

// Test 100 (፻)
assert(GEEZ_HUNDRED.geez === '፻' && GEEZ_HUNDRED.value === 100, '100 is ፻');
const test100 = decomposeToGeez(100);
assert(test100.geez === '፻', '100 should decompose to ፻');
const test104 = decomposeToGeez(104);
assert(test104.geez === '፻፬', '104 should decompose to ፻፬');
assert(GEEZ_TENS_AND_HUNDRED.length === 10, 'Tens and hundred has 10 items (10..100)');
console.log('✓ Additive decompositions (11, 23, 45, 70, 99, 100, 104) passed');

// 5. Test Question Generator - Level 1 (Pure Ge'ez & Dots, NO Arabic text)
const q1Dots = generateLevel1Question('numeral-to-dots');
assert(q1Dots.options.length === 3, 'Level 1 question should have 3 options');
assert(
  q1Dots.options.some((opt) => opt.id === q1Dots.correctOptionId),
  'Level 1 options must contain the correct answer'
);
assert(
  q1Dots.options.every((opt) => typeof opt.dotCount === 'number'),
  'Options must have dot counts'
);

const q1Numeral = generateLevel1Question('dots-to-numeral');
assert(
  q1Numeral.options.every((opt) => Boolean(opt.geez)),
  'Options must have Ge\'ez numeral symbol'
);
console.log('✓ Level 1 Question Generator passed');

// 6. Test Question Generator - Level 2
const q2Tens = generateLevel2Question('tens-recognition', 0);
assert(q2Tens.options.length === 3, 'Tens recognition has 3 options');
assert(
  q2Tens.options.every((opt) => Boolean(opt.geez)),
  'Tens options are pure Ge\'ez'
);

const q2Build = generateLevel2Question('additive-build', 1);
assert(
  q2Build.options.some((opt) => opt.id.startsWith('ten-')),
  'Additive build provides tens choices'
);
assert(
  q2Build.options.some((opt) => opt.id.startsWith('unit-')),
  'Additive build provides units choices'
);

const q2Recog = generateLevel2Question('combined-recognition', 2);
assert(q2Recog.options.length === 3, 'Combined recognition provides 3 options');
assert(
  q2Recog.options.every((opt) => Boolean(opt.partsFormula)),
  'Combined recognition provides additive parts formula'
);
console.log('✓ Level 2 Question Generator passed');

console.log('ALL TESTS PASSED SUCCESSFULLY! 🎉');
