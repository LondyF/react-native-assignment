export const SECTION_KEYS = ['warmUp', 'powerSet', 'coolDown'] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

type ExerciseBase = {
  id: string;
  name: string;
  thumbnailUrl: string;
  bodyParts: string[];
};

export type ExerciseSet = {
  reps: number;
  restSeconds: number;
};

export type RepsExercise = ExerciseBase & {
  kind: 'reps';
  sets: ExerciseSet[];
};

export type TimedExercise = ExerciseBase & {
  kind: 'timed';
  durationSeconds: number;
};

export type Exercise = RepsExercise | TimedExercise;

export type Section = {
  key: SectionKey;
  exercises: Exercise[];
};

export type Workout = {
  id: string;
  name: string;
  description: string | null;
  level: string | null;
  pictureUrl: string;
  sections: Section[];
};
