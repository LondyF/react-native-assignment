import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStateStorage } from '@/lib/storage';

import type { Step } from '../model/step';
import { findNextExerciseIndex, findPreviousExerciseIndex } from '../model/step-navigation';
import {
  adjustTimer,
  pauseTimer,
  resumeTimer,
  startTimerForStep,
  type Timer,
} from '../model/timer';

type SessionState = {
  status: 'idle' | 'active' | 'completed' | 'ended';
  workoutId: string | null;
  steps: Step[];
  stepIndex: number;
  timer: Timer | null;
};

type SessionActions = {
  start: (workoutId: string, steps: Step[]) => void;
  next: () => void;
  skip: () => void;
  previous: () => void;
  adjustRest: (deltaMs: number) => void;
  togglePause: () => void;
  pauseTimer: () => void;
  end: () => void;
  reset: () => void;
};

type SessionStore = SessionState & { actions: SessionActions };

const SESSION_STORAGE_KEY = 'workout-session';
// Bump when the persisted shape changes. Older saved sessions are discarded.
const SESSION_STORAGE_VERSION = 1;

export const initialSession: SessionState = {
  status: 'idle',
  workoutId: null,
  steps: [],
  stepIndex: 0,
  timer: null,
};

export const sessionStore = create<SessionStore>()(
  persist(
    (set, get) => {
      const goToStep = (stepIndex: number) => {
        const { steps, workoutId } = get();
        if (stepIndex >= steps.length) {
          set({ ...initialSession, status: 'completed', workoutId });
          return;
        }
        set({ stepIndex, timer: startTimerForStep(steps[stepIndex], Date.now()) });
      };

      const updateTimer = (update: (timer: Timer, now: number) => Timer) =>
        set(({ timer }) => ({ timer: timer && update(timer, Date.now()) }));

      return {
        ...initialSession,
        actions: {
          start: (workoutId, steps) => {
            if (steps.length === 0) return;
            const { status, workoutId: activeWorkoutId } = get();
            if (status === 'active' && activeWorkoutId === workoutId) return;
            set({
              status: 'active',
              workoutId,
              steps,
              stepIndex: 0,
              timer: startTimerForStep(steps[0], Date.now()),
            });
          },
          next: () => goToStep(get().stepIndex + 1),
          skip: () => goToStep(findNextExerciseIndex(get().steps, get().stepIndex)),
          previous: () => {
            const previousIndex = findPreviousExerciseIndex(get().steps, get().stepIndex);
            if (previousIndex === -1) return;
            goToStep(previousIndex);
          },
          adjustRest: (deltaMs) => updateTimer((timer, now) => adjustTimer(timer, deltaMs, now)),
          togglePause: () =>
            updateTimer((timer, now) =>
              timer.kind === 'running' ? pauseTimer(timer, now) : resumeTimer(timer, now),
            ),
          pauseTimer: () => updateTimer(pauseTimer),
          end: () => set({ ...initialSession, status: 'ended', workoutId: get().workoutId }),
          reset: () => set(initialSession),
        },
      };
    },
    {
      name: SESSION_STORAGE_KEY,
      version: SESSION_STORAGE_VERSION,
      storage: createJSONStorage(() => mmkvStateStorage),
      migrate: () => initialSession,
      partialize: ({ status, workoutId, steps, stepIndex, timer }): SessionState =>
        status === 'active' ? { status, workoutId, steps, stepIndex, timer } : initialSession,
    },
  ),
);

export const useSessionStatus = () => sessionStore((state) => state.status);
export const useSessionWorkoutId = () => sessionStore((state) => state.workoutId);
export const useSessionSteps = () => sessionStore((state) => state.steps);
export const useSessionStepIndex = () => sessionStore((state) => state.stepIndex);
export const useSessionTimer = () => sessionStore((state) => state.timer);
export const useWorkoutSessionActions = () => sessionStore((state) => state.actions);
