import { useLocalSearchParams, useRouter } from 'expo-router';

import { StopSessionSheet, useWorkoutSessionActions } from '@/features/workout-session';

const StopSessionScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { end } = useWorkoutSessionActions();

  const openWorkoutDetails = () => {
    router.dismissTo({ pathname: '/workout/[id]', params: { id } });
  };

  const handleEnd = () => {
    end();
    openWorkoutDetails();
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <StopSessionSheet
      onEnd={handleEnd}
      onContinueLater={openWorkoutDetails}
      onClose={handleClose}
    />
  );
};

export default StopSessionScreen;
