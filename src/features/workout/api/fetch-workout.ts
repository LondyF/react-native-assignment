import { contentfulRequest } from '@/lib/contentful-client';
import { workoutListResponseSchema, workoutResponseSchema } from '../model/workout-schema';
import type { Workout } from '../model/workout';
import { WORKOUT_QUERY, WORKOUTS_QUERY } from './workout-query';

export const fetchWorkouts = async (): Promise<Workout[]> => {
  const { data } = await contentfulRequest({
    query: WORKOUTS_QUERY,
    schema: workoutListResponseSchema,
  });
  return data.workoutCollection.items;
};

export class WorkoutNotFoundError extends Error {
  constructor(workoutId: string) {
    super(`Workout ${workoutId} was not found`);
    this.name = 'WorkoutNotFoundError';
  }
}

export const fetchWorkout = async (workoutId: string): Promise<Workout> => {
  const { data } = await contentfulRequest({
    query: WORKOUT_QUERY,
    variables: { id: workoutId },
    schema: workoutResponseSchema,
  });
  const [workout] = data.workoutCollection.items;
  if (!workout) throw new WorkoutNotFoundError(workoutId);
  return workout;
};
