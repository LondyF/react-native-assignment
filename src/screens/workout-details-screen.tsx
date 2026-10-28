import { useLocalSearchParams, useRouter } from 'expo-router';

import { WorkoutDetails } from '@/features/workout';
import { useStartWorkout } from '@/features/workout-session';

const WorkoutDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const startWorkout = useStartWorkout(id);

  const handleStartWorkout = () => {
    startWorkout();
    router.push({ pathname: '/session/[id]', params: { id } });
  };

  return <WorkoutDetails workoutId={id} onStartWorkout={handleStartWorkout} />;
};

export default WorkoutDetailsScreen;
