import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { WorkoutDetails } from '@/features/workout';
import { useActiveSessionWorkoutId, useStartWorkout } from '@/features/workout-session';

const WorkoutDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const startWorkout = useStartWorkout(id);
  const activeWorkoutId = useActiveSessionWorkoutId();
  const isInProgress = activeWorkoutId === id;
  const hasOtherWorkoutInProgress = activeWorkoutId !== null && !isInProgress;

  const openSession = () => {
    startWorkout();
    router.push({ pathname: '/session/[id]', params: { id } });
  };

  const handleStartWorkout = () => {
    if (!hasOtherWorkoutInProgress) {
      openSession();
      return;
    }

    Alert.alert('You have a workout in progress. Starting this one ends it.', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Start', onPress: openSession },
    ]);
  };

  return (
    <WorkoutDetails
      workoutId={id}
      isInProgress={isInProgress}
      onStartWorkout={handleStartWorkout}
    />
  );
};

export default WorkoutDetailsScreen;
