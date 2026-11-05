/**
 * Question Generator for Ge'ez Numeral Match
 * Produces pure Ge'ez and tactile dot-count questions without Arabic digits or written Amharic text.
 */

import {
  LEVEL_1_NUMERALS,
  GEEZ_TENS,
  GEEZ_UNITS,
  GEEZ_TENS_AND_HUNDRED,
  CURATED_LEVEL_2_COMBINATIONS,
  decomposeToGeez,
} from '../data/geezNumerals.ts';
import {
  Level1GameMode,
  Level1Question,
  Level2GameStage,
  Level2Question,
  ChoiceOption,
} from '../types/index.ts';

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Generate a Level 1 Question without Arabic numerals or written Amharic text
 */
export function generateLevel1Question(
  mode: Level1GameMode,
  usedValues: number[] = []
): Level1Question {
  let pool = LEVEL_1_NUMERALS.filter((n) => !usedValues.includes(n.value));
  if (pool.length === 0) {
    pool = [...LEVEL_1_NUMERALS];
  }

  const targetNumeral = pool[Math.floor(Math.random() * pool.length)];

  // Pick 2 distinct distractors
  const otherNumerals = LEVEL_1_NUMERALS.filter((n) => n.value !== targetNumeral.value);
  const sortedByDistance = [...otherNumerals].sort(
    (a, b) => Math.abs(a.value - targetNumeral.value) - Math.abs(b.value - targetNumeral.value)
  );

  const distractor1 = sortedByDistance[0];
  const distractor2 = sortedByDistance[1 + Math.floor(Math.random() * (sortedByDistance.length - 1))];

  const optionNumerals = shuffleArray([targetNumeral, distractor1, distractor2]);

  const options: ChoiceOption[] = optionNumerals.map((num) => ({
    id: `opt-${num.value}`,
    numericValue: num.value,
    geez: num.geez,
    dotCount: num.value,
  }));

  return {
    id: `l1-${targetNumeral.value}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    numeral: targetNumeral,
    mode,
    options,
    correctOptionId: `opt-${targetNumeral.value}`,
  };
}

/**
 * Generate a Level 2 Question without Arabic numerals or written Amharic text
 */
export function generateLevel2Question(
  stage: Level2GameStage,
  roundIndex: number
): Level2Question {
  if (stage === 'tens-recognition') {
    // Pure Ge'ez Tens: given spoken/dots/tens, choose matching Ge'ez Tens
    const targetTen = GEEZ_TENS_AND_HUNDRED[roundIndex % GEEZ_TENS_AND_HUNDRED.length];
    const otherTens = shuffleArray(GEEZ_TENS_AND_HUNDRED.filter((t) => t.value !== targetTen.value));

    const optionTens = shuffleArray([targetTen, otherTens[0], otherTens[1]]);
    const options: ChoiceOption[] = optionTens.map((ten) => ({
      id: `opt-${ten.value}`,
      numericValue: ten.value,
      geez: ten.geez,
      dotCount: ten.value,
    }));

    return {
      id: `l2-tens-${targetTen.value}-${Date.now()}`,
      stage: 'tens-recognition',
      targetNumber: targetTen.value,
      tensNumeral: targetTen,
      combinedGeez: targetTen.geez,
      options,
      correctOptionId: `opt-${targetTen.value}`,
      geezFormula: targetTen.geez,
    };
  }

  // Stages 2 & 3: Additive Combination
  const targetNumber =
    CURATED_LEVEL_2_COMBINATIONS[roundIndex % CURATED_LEVEL_2_COMBINATIONS.length];
  const decomposed = decomposeToGeez(targetNumber);

  const tensItem = GEEZ_TENS_AND_HUNDRED.find((t) => t.value === decomposed.tensValue)!;
  const unitsItem = GEEZ_UNITS.find((u) => u.value === decomposed.unitsValue)!;

  if (stage === 'additive-build') {
    // Provide pure Ge'ez tens choices and pure Ge'ez units choices (NO Arabic numbers!)
    const otherTens = shuffleArray(GEEZ_TENS_AND_HUNDRED.filter((t) => t.value !== tensItem.value)).slice(0, 2);
    const otherUnits = shuffleArray(GEEZ_UNITS.filter((u) => u.value !== unitsItem.value)).slice(0, 2);

    const tensChoices: ChoiceOption[] = shuffleArray([tensItem, ...otherTens]).map((t) => ({
      id: `ten-${t.value}`,
      numericValue: t.value,
      geez: t.geez,
    }));

    const unitsChoices: ChoiceOption[] = shuffleArray([unitsItem, ...otherUnits]).map((u) => ({
      id: `unit-${u.value}`,
      numericValue: u.value,
      geez: u.geez,
    }));

    return {
      id: `l2-build-${targetNumber}-${Date.now()}`,
      stage: 'additive-build',
      targetNumber,
      tensNumeral: tensItem,
      unitsNumeral: unitsItem,
      combinedGeez: decomposed.geez,
      options: [...tensChoices, ...unitsChoices],
      geezFormula: `${tensItem.geez} + ${unitsItem.geez} = ${decomposed.geez}`,
    };
  }

  // Combined Recognition: Given ፳፫, pick the matching additive parts: e.g. [ ፳ + ፫ ] vs [ ፳ + ፭ ] vs [ ፴ + ፫ ]
  const otherTens = shuffleArray(GEEZ_TENS.filter((t) => t.value !== tensItem.value))[0];
  const otherUnits = shuffleArray(GEEZ_UNITS.filter((u) => u.value !== unitsItem.value))[0];

  const correctFormula = `${tensItem.geez} + ${unitsItem.geez}`;
  const distractor1Formula = `${tensItem.geez} + ${otherUnits.geez}`;
  const distractor2Formula = `${otherTens.geez} + ${unitsItem.geez}`;

  const optionFormulas = shuffleArray([
    { id: `opt-correct`, formula: correctFormula, val: targetNumber },
    { id: `opt-dist1`, formula: distractor1Formula, val: tensItem.value + otherUnits.value },
    { id: `opt-dist2`, formula: distractor2Formula, val: otherTens.value + unitsItem.value },
  ]);

  const options: ChoiceOption[] = optionFormulas.map((item) => ({
    id: item.id,
    numericValue: item.val,
    partsFormula: item.formula,
  }));

  return {
    id: `l2-recog-${targetNumber}-${Date.now()}`,
    stage: 'combined-recognition',
    targetNumber,
    tensNumeral: tensItem,
    unitsNumeral: unitsItem,
    combinedGeez: decomposed.geez,
    options,
    correctOptionId: `opt-correct`,
    geezFormula: `${tensItem.geez} + ${unitsItem.geez} = ${decomposed.geez}`,
  };
}
