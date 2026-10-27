import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { useWorkout } from '@/features/workout';

import { SECTION_LABELS } from '../model/section-labels';
import { SessionHeader } from './session-header';

type WorkoutSessionProps = {
  workoutId: string;
  onClose: () => void;
};

export const WorkoutSession = ({ workoutId, onClose }: WorkoutSessionProps) => {
  const { data: workout, isPending, refetch } = useWorkout(workoutId);
  const { top, bottom } = useSafeAreaInsets();

  if (isPending) {
    return <LoadingState />;
  }

  if (!workout) {
    return <ErrorState message="We could not load this workout." onRetry={refetch} />;
  }

  const firstSection = workout.sections[0];
  const title = firstSection ? SECTION_LABELS[firstSection.key] : workout.name;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top, paddingBottom: bottom }}>
      <SessionHeader title={title} onClose={onClose} />
      <View className="flex-1" />
    </View>
  );
};
