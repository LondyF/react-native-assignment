import { useLocalSearchParams, useRouter } from 'expo-router';

import { WorkoutDetails } from '@/features/workout';

const WorkoutDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleStartWorkout = () => {
    router.push({ pathname: '/session/[id]', params: { id } });
  };

  return <WorkoutDetails workoutId={id} onStartWorkout={handleStartWorkout} />;
};

export default WorkoutDetailsScreen;
