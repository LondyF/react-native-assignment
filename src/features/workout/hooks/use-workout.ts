import { skipToken, useQuery } from '@tanstack/react-query';

import { fetchWorkout } from '../api/fetch-workout';

const keys = {
  workout: (workoutId: string | null) => ['workout', workoutId],
} as const;

export const useWorkout = (workoutId: string | null) =>
  useQuery({
    queryKey: keys.workout(workoutId),
    queryFn: workoutId === null ? skipToken : () => fetchWorkout(workoutId),
  });
