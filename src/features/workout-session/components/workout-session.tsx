import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';

import { useWorkoutSession } from '../hooks/use-workout-session';
import { SECTION_LABELS } from '../model/section-labels';
import { getSectionProgress } from '../model/section-progress';
import { CurrentExercise } from './current-exercise';
import { PlayerControls } from './player-controls';
import { RestStep } from './rest-step';
import { SectionTabs } from './section-tabs';
import { SessionHeader } from './session-header';
import { TimedStep } from './timed-step';
import { WorkoutComplete } from './workout-complete';

type WorkoutSessionProps = {
  workoutId: string;
  onClose: () => void;
};

export const WorkoutSession = ({ workoutId, onClose }: WorkoutSessionProps) => {
  const session = useWorkoutSession(workoutId);
  const { top, bottom } = useSafeAreaInsets();

  if (session.status === 'completed') {
    return <WorkoutComplete onDone={onClose} />;
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

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top, paddingBottom: bottom }}>
      <SessionHeader
        title={step.kind === 'rest' ? 'Rest' : SECTION_LABELS[step.sectionKey]}
        onClose={onClose}
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
        <>
          <View className="flex-1 px-4 pt-4">
            <CurrentExercise step={step} />
          </View>
          <View className="px-4 pb-4">
            <PlayerControls
              canGoPrevious={canGoPrevious}
              onPrevious={session.previous}
              onNext={session.skip}
              primaryIcon="checkmark"
              primaryLabel="Complete set"
              onPrimaryPress={session.next}
            />
          </View>
        </>
      ) : null}
    </View>
  );
};
