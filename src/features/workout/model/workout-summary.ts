import type { Exercise, Workout } from './workout';

export const getExercises = (workout: Workout): Exercise[] =>
  workout.sections.flatMap((section) => section.exercises);

export const getTargetBodyParts = (workout: Workout): string[] => [
  ...new Set(getExercises(workout).flatMap((exercise) => exercise.bodyParts)),
];
