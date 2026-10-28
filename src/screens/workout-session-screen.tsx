import { useLocalSearchParams, useRouter } from 'expo-router';

import { WorkoutSession } from '@/features/workout-session';

const WorkoutSessionScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return <WorkoutSession workoutId={id} onClose={handleClose} />;
};

export default WorkoutSessionScreen;
