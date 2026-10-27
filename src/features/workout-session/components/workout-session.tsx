import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { useWorkout } from '@/features/workout';

import { buildSteps } from '../model/build-steps';
import { SECTION_LABELS } from '../model/section-labels';
import { getSectionProgress } from '../model/section-progress';
import { CurrentExercise } from './current-exercise';
import { SectionTabs } from './section-tabs';
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

  const steps = buildSteps(workout);
  const currentStepIndex = 0;
  const currentStep = steps[currentStepIndex];

  if (!currentStep) {
    return <ErrorState message="This workout has no exercises." onRetry={refetch} />;
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top, paddingBottom: bottom }}>
      <SessionHeader title={SECTION_LABELS[currentStep.sectionKey]} onClose={onClose} />
      <SectionTabs
        sections={getSectionProgress(steps, currentStepIndex)}
        activeSection={currentStep.sectionKey}
      />
      <View className="flex-1 px-4 pt-4">
        <CurrentExercise step={currentStep} />
      </View>
    </View>
  );
};
