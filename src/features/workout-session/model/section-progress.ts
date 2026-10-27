import type { SectionKey } from '@/features/workout';

import type { ExerciseStep } from './build-steps';

export type SectionProgress = {
  sectionKey: SectionKey;
  progress: number;
};

export const getSectionProgress = (
  steps: ExerciseStep[],
  currentStepIndex: number,
): SectionProgress[] => {
  const sectionKeys = [...new Set(steps.map((step) => step.sectionKey))];

  return sectionKeys.map((sectionKey) => {
    const sectionStepIndexes = steps.flatMap((step, index) =>
      step.sectionKey === sectionKey ? [index] : [],
    );
    const reachedStepCount = sectionStepIndexes.filter((index) => index <= currentStepIndex).length;

    return { sectionKey, progress: reachedStepCount / sectionStepIndexes.length };
  });
};
