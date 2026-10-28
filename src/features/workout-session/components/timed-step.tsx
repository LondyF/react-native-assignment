import { View } from 'react-native';

import { usePauseOnBackground } from '../hooks/use-pause-on-background';
import type { TimedStep as TimedStepModel } from '../model/step';
import type { Timer } from '../model/timer';
import { CurrentExercise } from './current-exercise';
import { PlayerControls } from './player-controls';
import { TimedProgress } from './timed-progress';

const MS_PER_SECOND = 1000;

type TimedStepProps = {
  step: TimedStepModel;
  timer: Timer | null;
  canGoPrevious: boolean;
  onNext: () => void;
  onSkip: () => void;
  onPrevious: () => void;
  onTogglePause: () => void;
  onPause: () => void;
};

export const TimedStep = ({
  step,
  timer,
  canGoPrevious,
  onNext,
  onSkip,
  onPrevious,
  onTogglePause,
  onPause,
}: TimedStepProps) => {
  usePauseOnBackground(onPause);

  const isPaused = timer?.kind === 'paused';

  return (
    <>
      <View className="flex-1 gap-4 px-4 pt-4">
        <CurrentExercise step={step} />
        <TimedProgress
          timer={timer}
          totalMs={step.durationSeconds * MS_PER_SECOND}
          onElapsed={onNext}
        />
      </View>
      <View className="px-4 pb-4">
        <PlayerControls
          canGoPrevious={canGoPrevious}
          onPrevious={onPrevious}
          onNext={onSkip}
          primaryIcon={isPaused ? 'play.fill' : 'pause.fill'}
          primaryLabel={isPaused ? 'Resume exercise' : 'Pause exercise'}
          onPrimaryPress={onTogglePause}
        />
      </View>
    </>
  );
};
