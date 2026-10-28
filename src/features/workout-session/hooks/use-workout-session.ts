import { useEffect, useMemo } from 'react';

import { useWorkout } from '@/features/workout';

import { buildSteps } from '../model/build-steps';
import type { Step } from '../model/step';
import { findPreviousExerciseIndex } from '../model/step-navigation';
import type { Timer } from '../model/timer';
import {
  useSessionStatus,
  useSessionStepIndex,
  useSessionTimer,
  useSessionWorkoutId,
  useWorkoutSessionActions,
} from '../store/session-store';

export type WorkoutSessionView =
  | { status: 'loading' }
  | { status: 'error'; retry: () => void }
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
    };

export const useWorkoutSession = (workoutId: string): WorkoutSessionView => {
  const sessionStatus = useSessionStatus();
  const sessionWorkoutId = useSessionWorkoutId();
  const stepIndex = useSessionStepIndex();
  const timer = useSessionTimer();
  const actions = useWorkoutSessionActions();
  const { data: workout, isPending, refetch } = useWorkout(workoutId);

  const isActive = sessionStatus === 'active' && sessionWorkoutId === workoutId;
  const steps = useMemo(() => (workout ? buildSteps(workout) : []), [workout]);
  const isStale = isActive && workout !== undefined && stepIndex >= steps.length;

  useEffect(() => {
    if (isStale) actions.end();
  }, [isStale, actions]);

  if (!isActive) return { status: 'inactive' };
  if (isPending || isStale) return { status: 'loading' };
  if (!workout) return { status: 'error', retry: refetch };

  return {
    status: 'ready',
    steps,
    step: steps[stepIndex],
    stepIndex,
    timer,
    canGoPrevious: findPreviousExerciseIndex(steps, stepIndex) !== -1,
    next: () => actions.next(steps),
    skip: () => actions.skip(steps),
    previous: () => actions.previous(steps),
    adjustRest: actions.adjustRest,
  };
};
