import type { Exercise, SectionKey, Workout } from '@/features/workout';

import type { Step } from './step';

const buildExerciseSteps = (sectionKey: SectionKey, exercise: Exercise): Step[] => {
  const exerciseFields = {
    sectionKey,
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    thumbnailUrl: exercise.thumbnailUrl,
  };

  if (exercise.kind === 'timed') {
    return [{ ...exerciseFields, kind: 'timed', durationSeconds: exercise.durationSeconds }];
  }

  return exercise.sets.flatMap((set, index): Step[] => {
    const setStep: Step = {
      ...exerciseFields,
      kind: 'set',
      setNumber: index + 1,
      setCount: exercise.sets.length,
      reps: set.reps,
    };

    if (set.restSeconds <= 0) {
      return [setStep];
    }

    // After the set, we add a rest step
    return [setStep, { kind: 'rest', sectionKey, durationSeconds: set.restSeconds }];
  });
};

export const buildSteps = (workout: Workout): Step[] => {
  const steps = workout.sections.flatMap((section) =>
    section.exercises.flatMap((exercise) => buildExerciseSteps(section.key, exercise)),
  );

  return steps.at(-1)?.kind === 'rest' ? steps.slice(0, -1) : steps;
};
