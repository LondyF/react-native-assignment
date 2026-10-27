import type { SectionKey } from '@/features/workout';

import type { Step } from './step';

export type SectionProgress = {
  sectionKey: SectionKey;
  progress: number;
};

export const getSectionProgress = (steps: Step[], currentStepIndex: number): SectionProgress[] => {
  const sectionKeys = [...new Set(steps.map((step) => step.sectionKey))];

  return sectionKeys.map((sectionKey) => {
    const sectionStepIndexes = steps.flatMap((step, index) =>
      step.kind !== 'rest' && step.sectionKey === sectionKey ? [index] : [],
    );
    const reachedStepCount = sectionStepIndexes.filter((index) => index <= currentStepIndex).length;

    return { sectionKey, progress: reachedStepCount / sectionStepIndexes.length };
  });
};
