import type { Exercise, SectionKey, Workout } from '@/features/workout';

import type { Step } from './step';

const DEFAULT_REST_SECONDS = 30;

const withRest = (step: Step, restSeconds?: number): Step[] => [
  step,
  {
    kind: 'rest',
    sectionKey: step.sectionKey,
    durationSeconds: restSeconds || DEFAULT_REST_SECONDS,
  },
];

const buildExerciseSteps = (sectionKey: SectionKey, exercise: Exercise): Step[] => {
  const exerciseFields = {
    sectionKey,
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    thumbnailUrl: exercise.thumbnailUrl,
  };

  if (exercise.kind === 'timed') {
    return withRest({
      ...exerciseFields,
      kind: 'timed',
      durationSeconds: exercise.durationSeconds,
    });
  }

  return exercise.sets.flatMap((set, index) =>
    withRest(
      {
        ...exerciseFields,
        kind: 'set',
        setNumber: index + 1,
        setCount: exercise.sets.length,
        reps: set.reps,
      },
      set.restSeconds,
    ),
  );
};

export const buildSteps = (workout: Workout): Step[] => {
  const steps: Step[] = [];

  for (const section of workout.sections) {
    for (const exercise of section.exercises) {
      steps.push(...buildExerciseSteps(section.key, exercise));
    }
  }

  // Drop the last rest step if it exists. This way, the workout session will end with the last exercise.
  return steps.at(-1)?.kind === 'rest' ? steps.slice(0, -1) : steps;
};
