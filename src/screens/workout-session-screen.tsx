import { useLocalSearchParams, useRouter } from 'expo-router';

import { WorkoutSession } from '@/features/workout-session';

const WorkoutSessionScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const handleInactive = () => {
    router.replace({ pathname: '/workout/[id]', params: { id } });
  };

  return <WorkoutSession workoutId={id} onClose={handleClose} onInactive={handleInactive} />;
};

export default WorkoutSessionScreen;
