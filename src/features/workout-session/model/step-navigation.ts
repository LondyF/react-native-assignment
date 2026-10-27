import type { Step } from './step';

export const findNextExerciseIndex = (steps: Step[], fromIndex: number): number => {
  const offset = steps.slice(fromIndex + 1).findIndex((step) => step.kind !== 'rest');
  return offset === -1 ? steps.length : fromIndex + 1 + offset;
};

export const findPreviousExerciseIndex = (steps: Step[], fromIndex: number): number => {
  for (let index = fromIndex - 1; index >= 0; index -= 1) {
    if (steps[index].kind !== 'rest') return index;
  }
  return -1;
};
