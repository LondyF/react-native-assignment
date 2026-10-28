import { useSessionStatus, useSessionWorkoutId } from '../store/session-store';

export const useActiveSessionWorkoutId = () => {
  const status = useSessionStatus();
  const workoutId = useSessionWorkoutId();

  return status === 'active' ? workoutId : null;
};
