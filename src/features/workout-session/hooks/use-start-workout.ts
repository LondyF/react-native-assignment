import { useWorkout } from '@/features/workout';

import { buildSteps } from '../model/build-steps';
import { useWorkoutSessionActions } from '../store/session-store';

export const useStartWorkout = (workoutId: string) => {
  const { data: workout } = useWorkout(workoutId);
  const actions = useWorkoutSessionActions();

  return () => {
    if (!workout) return;
    actions.start(workoutId, buildSteps(workout));
  };
};
