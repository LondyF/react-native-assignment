import type { SectionKey } from '@/features/workout';

type StepBase = {
  sectionKey: SectionKey;
};

type ExerciseStepBase = StepBase & {
  exerciseId: string;
  exerciseName: string;
  thumbnailUrl: string;
};

export type SetStep = ExerciseStepBase & {
  kind: 'set';
  setNumber: number;
  setCount: number;
  reps: number;
};

export type TimedStep = ExerciseStepBase & {
  kind: 'timed';
  durationSeconds: number;
};

export type RestStep = StepBase & {
  kind: 'rest';
  durationSeconds: number;
};

export type Step = SetStep | TimedStep | RestStep;
