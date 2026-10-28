import { useLocalSearchParams, useRouter } from 'expo-router';

import { WorkoutSession } from '@/features/workout-session';

const WorkoutSessionScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const handleRequestStop = () => {
    router.push({ pathname: '/session/[id]/stop', params: { id } });
  };

  return <WorkoutSession workoutId={id} onClose={handleClose} onRequestStop={handleRequestStop} />;
};

export default WorkoutSessionScreen;
