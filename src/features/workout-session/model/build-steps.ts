import type { Exercise, SectionKey, Workout } from '@/features/workout';

export type ExerciseStep = {
  sectionKey: SectionKey;
  exercise: Exercise;
  setNumber: number;
  setCount: number;
};

const getSetCount = (exercise: Exercise): number =>
  exercise.kind === 'reps' ? exercise.sets.length : 1;

export const buildSteps = (workout: Workout): ExerciseStep[] =>
  workout.sections.flatMap((section) =>
    section.exercises.flatMap((exercise) => {
      const setCount = getSetCount(exercise);

      return Array.from({ length: setCount }, (_, index) => ({
        sectionKey: section.key,
        exercise,
        setNumber: index + 1,
        setCount,
      }));
    }),
  );
