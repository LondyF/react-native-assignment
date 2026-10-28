import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';

import { useWorkoutSession } from '../hooks/use-workout-session';
import { SECTION_LABELS } from '../model/section-labels';
import { getSectionProgress } from '../model/section-progress';
import { RestStep } from './rest-step';
import { SectionTabs } from './section-tabs';
import { SessionHeader } from './session-header';
import { SetStep } from './set-step';
import { TimedStep } from './timed-step';
import { WorkoutComplete } from './workout-complete';

type WorkoutSessionProps = {
  workoutId: string;
  onClose: () => void;
  onRequestStop: () => void;
};

export const WorkoutSession = ({ workoutId, onClose, onRequestStop }: WorkoutSessionProps) => {
  const session = useWorkoutSession(workoutId);
  const { top, bottom } = useSafeAreaInsets();

  if (session.status === 'completed') {
    return <WorkoutComplete onDone={onClose} />;
  }

  if (session.status === 'ended') {
    return <View className="flex-1 bg-background" />;
  }

  if (session.status === 'loading') {
    return <LoadingState />;
  }

  if (session.status === 'inactive') {
    return (
      <ErrorState
        message="Your progress on this workout could not be restored."
        actionLabel="Back to workout"
        onRetry={onClose}
      />
    );
  }

  if (session.status === 'error') {
    return <ErrorState message="We could not load this workout." onRetry={session.retry} />;
  }

  const { step, steps, stepIndex, canGoPrevious } = session;

  const handleRequestStop = () => {
    if (step.kind === 'timed') session.pause();
    onRequestStop();
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top, paddingBottom: bottom }}>
      <SessionHeader
        title={step.kind === 'rest' ? 'Rest' : SECTION_LABELS[step.sectionKey]}
        onClose={handleRequestStop}
      />
      <SectionTabs
        sections={getSectionProgress(steps, stepIndex)}
        activeSection={step.sectionKey}
      />
      {step.kind === 'rest' ? (
        <View className="flex-1 pt-4 pb-4">
          <RestStep
            key={stepIndex}
            step={step}
            timer={session.timer}
            onNext={session.next}
            onAdjustRest={session.adjustRest}
          />
        </View>
      ) : null}
      {step.kind === 'timed' ? (
        <TimedStep
          key={stepIndex}
          step={step}
          timer={session.timer}
          canGoPrevious={canGoPrevious}
          onNext={session.next}
          onSkip={session.skip}
          onPrevious={session.previous}
          onTogglePause={session.togglePause}
          onPause={session.pause}
        />
      ) : null}
      {step.kind === 'set' ? (
        <SetStep
          key={stepIndex}
          step={step}
          canGoPrevious={canGoPrevious}
          onNext={session.next}
          onSkip={session.skip}
          onPrevious={session.previous}
        />
      ) : null}
    </View>
  );
};
