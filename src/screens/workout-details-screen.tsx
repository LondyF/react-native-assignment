import { useLocalSearchParams } from 'expo-router';

import { WorkoutDetails } from '@/features/workout';

const WorkoutDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <WorkoutDetails workoutId={id} />;
};

export default WorkoutDetailsScreen;
