import { useQuery } from '@tanstack/react-query';

import { fetchWorkouts } from '../api/fetch-workout';

export const useWorkouts = () =>
  useQuery({
    queryKey: ['workouts'],
    queryFn: fetchWorkouts,
  });
