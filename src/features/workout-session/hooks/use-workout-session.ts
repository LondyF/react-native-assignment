import type { Step } from '../model/step';
import { findPreviousExerciseIndex } from '../model/step-navigation';
import type { Timer } from '../model/timer';
import {
  useSessionStatus,
  useSessionStepIndex,
  useSessionSteps,
  useSessionTimer,
  useSessionWorkoutId,
  useWorkoutSessionActions,
} from '../store/session-store';

export type WorkoutSessionView =
  | { status: 'completed' }
  | { status: 'ended' }
  | { status: 'inactive' }
  | {
      status: 'ready';
      steps: Step[];
      step: Step;
      stepIndex: number;
      timer: Timer | null;
      canGoPrevious: boolean;
      next: () => void;
      skip: () => void;
      previous: () => void;
      adjustRest: (deltaMs: number) => void;
      togglePause: () => void;
      pause: () => void;
    };

export const useWorkoutSession = (workoutId: string): WorkoutSessionView => {
  const sessionStatus = useSessionStatus();
  const sessionWorkoutId = useSessionWorkoutId();
  const steps = useSessionSteps();
  const stepIndex = useSessionStepIndex();
  const timer = useSessionTimer();
  const actions = useWorkoutSessionActions();

  if (sessionWorkoutId !== workoutId) return { status: 'inactive' };
  if (sessionStatus === 'completed') return { status: 'completed' };
  if (sessionStatus === 'ended') return { status: 'ended' };
  if (sessionStatus !== 'active') return { status: 'inactive' };

  return {
    status: 'ready',
    steps,
    step: steps[stepIndex],
    stepIndex,
    timer,
    canGoPrevious: findPreviousExerciseIndex(steps, stepIndex) !== -1,
    next: actions.next,
    skip: actions.skip,
    previous: actions.previous,
    adjustRest: actions.adjustRest,
    togglePause: actions.togglePause,
    pause: actions.pauseTimer,
  };
};
