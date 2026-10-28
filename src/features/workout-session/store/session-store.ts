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
  status: 'idle' | 'active' | 'completed';
  workoutId: string | null;
  stepIndex: number;
  timer: Timer | null;
};

type SessionActions = {
  start: (workoutId: string, steps: Step[]) => void;
  next: (steps: Step[]) => void;
  skip: (steps: Step[]) => void;
  previous: (steps: Step[]) => void;
  adjustRest: (deltaMs: number) => void;
  togglePause: () => void;
  pauseTimer: () => void;
  end: () => void;
};

type SessionStore = SessionState & { actions: SessionActions };

const SESSION_STORAGE_KEY = 'workout-session';

export const initialSession: SessionState = {
  status: 'idle',
  workoutId: null,
  stepIndex: 0,
  timer: null,
};

export const sessionStore = create<SessionStore>()(
  persist(
    (set, get) => {
      const goToStep = (stepIndex: number, steps: Step[]) => {
        if (stepIndex >= steps.length) {
          set({ ...initialSession, status: 'completed', workoutId: get().workoutId });
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
              stepIndex: 0,
              timer: startTimerForStep(steps[0], Date.now()),
            });
          },
          next: (steps) => goToStep(get().stepIndex + 1, steps),
          skip: (steps) => goToStep(findNextExerciseIndex(steps, get().stepIndex), steps),
          previous: (steps) => {
            const previousIndex = findPreviousExerciseIndex(steps, get().stepIndex);
            if (previousIndex === -1) return;
            goToStep(previousIndex, steps);
          },
          adjustRest: (deltaMs) => updateTimer((timer, now) => adjustTimer(timer, deltaMs, now)),
          togglePause: () =>
            updateTimer((timer, now) =>
              timer.kind === 'running' ? pauseTimer(timer, now) : resumeTimer(timer, now),
            ),
          pauseTimer: () => updateTimer(pauseTimer),
          end: () => set(initialSession),
        },
      };
    },
    {
      name: SESSION_STORAGE_KEY,
      storage: createJSONStorage(() => mmkvStateStorage),
      partialize: ({ status, workoutId, stepIndex, timer }) =>
        status === 'active' ? { status, workoutId, stepIndex, timer } : initialSession,
    },
  ),
);

export const useSessionStatus = () => sessionStore((state) => state.status);
export const useSessionWorkoutId = () => sessionStore((state) => state.workoutId);
export const useSessionStepIndex = () => sessionStore((state) => state.stepIndex);
export const useSessionTimer = () => sessionStore((state) => state.timer);
export const useWorkoutSessionActions = () => sessionStore((state) => state.actions);
