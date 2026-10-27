import type { Step } from './step';

export type Timer = { kind: 'running'; endsAt: number } | { kind: 'paused'; remainingMs: number };

const MS_PER_SECOND = 1000;

export const startTimer = (durationSeconds: number, now: number): Timer => ({
  kind: 'running',
  endsAt: now + durationSeconds * MS_PER_SECOND,
});

export const startTimerForStep = (step: Step, now: number): Timer | null =>
  step.kind === 'set' ? null : startTimer(step.durationSeconds, now);

export const getRemainingMs = (timer: Timer, now: number): number =>
  Math.max(0, timer.kind === 'running' ? timer.endsAt - now : timer.remainingMs);

export const adjustTimer = (timer: Timer, deltaMs: number, now: number): Timer => {
  if (timer.kind === 'paused') {
    return { kind: 'paused', remainingMs: Math.max(0, timer.remainingMs + deltaMs) };
  }
  return { kind: 'running', endsAt: Math.max(now, timer.endsAt + deltaMs) };
};

export const pauseTimer = (timer: Timer, now: number): Timer =>
  timer.kind === 'paused' ? timer : { kind: 'paused', remainingMs: getRemainingMs(timer, now) };

export const resumeTimer = (timer: Timer, now: number): Timer =>
  timer.kind === 'running' ? timer : { kind: 'running', endsAt: now + timer.remainingMs };
