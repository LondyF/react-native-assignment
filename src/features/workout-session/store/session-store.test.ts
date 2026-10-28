import { mmkvStateStorage } from '@/lib/storage';

import { workoutFixture } from '../model/__fixtures__/workout';
import { buildSteps } from '../model/build-steps';
import { initialSession, sessionStore } from './session-store';

const NOW = 1_700_000_000_000;
const steps = buildSteps(workoutFixture);
const WORKOUT_ID = workoutFixture.id;

const { actions } = sessionStore.getState();
const getState = () => sessionStore.getState();
const readPersisted = () => {
  const raw = mmkvStateStorage.getItem('workout-session');
  return raw === null ? null : JSON.parse(raw as string).state;
};

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(NOW);
  sessionStore.setState(initialSession);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('start', () => {
  it('activates the session on the first step', () => {
    actions.start(WORKOUT_ID, steps);

    expect(getState()).toMatchObject({
      status: 'active',
      workoutId: WORKOUT_ID,
      steps,
      stepIndex: 0,
      timer: null,
    });
  });

  it('resumes an active session for the same workout', () => {
    actions.start(WORKOUT_ID, steps);
    actions.next();
    actions.next();
    actions.start(WORKOUT_ID, steps);

    expect(getState()).toMatchObject({ status: 'active', stepIndex: 2 });
  });

  it('starts from the first step for a different workout', () => {
    actions.start(WORKOUT_ID, steps);
    actions.next();
    actions.start('another-workout', steps);

    expect(getState()).toMatchObject({
      status: 'active',
      workoutId: 'another-workout',
      stepIndex: 0,
      timer: null,
    });
  });

  it('ignores a workout without steps', () => {
    actions.start(WORKOUT_ID, []);

    expect(getState().status).toBe('idle');
  });
});

describe('next', () => {
  beforeEach(() => actions.start(WORKOUT_ID, steps));

  it('starts a running timer when it lands on a rest', () => {
    actions.next();

    expect(getState().stepIndex).toBe(1);
    expect(getState().timer).toEqual({ kind: 'running', endsAt: NOW + 30_000 });
  });

  it('clears the timer when it lands on a set', () => {
    actions.next();
    actions.next();

    expect(getState()).toMatchObject({ stepIndex: 2, timer: null });
  });

  it('completes the workout after the last step', () => {
    sessionStore.setState({ stepIndex: steps.length - 1 });
    actions.next();

    expect(getState()).toMatchObject({ status: 'completed', workoutId: WORKOUT_ID, timer: null });
  });
});

describe('skip and previous', () => {
  beforeEach(() => actions.start(WORKOUT_ID, steps));

  it('skip jumps over a rest', () => {
    actions.skip();

    expect(getState().stepIndex).toBe(2);
  });

  it('skip completes the workout from the last step', () => {
    sessionStore.setState({ stepIndex: steps.length - 1 });
    actions.skip();

    expect(getState().status).toBe('completed');
  });

  it('previous steps back over a rest', () => {
    sessionStore.setState({ stepIndex: 4 });
    actions.previous();

    expect(getState().stepIndex).toBe(2);
  });

  it('previous does nothing on the first step', () => {
    actions.previous();

    expect(getState().stepIndex).toBe(0);
  });
});

describe('timer actions', () => {
  beforeEach(() => {
    actions.start(WORKOUT_ID, steps);
    actions.next();
  });

  it('adds and removes fifteen seconds', () => {
    actions.adjustRest(15_000);
    expect(getState().timer).toEqual({ kind: 'running', endsAt: NOW + 45_000 });

    actions.adjustRest(-15_000);
    expect(getState().timer).toEqual({ kind: 'running', endsAt: NOW + 30_000 });
  });

  it('never lets the timer go below zero when time is removed repeatedly', () => {
    for (let tap = 0; tap < 5; tap += 1) actions.adjustRest(-15_000);

    expect(getState().timer).toEqual({ kind: 'running', endsAt: NOW });
  });

  it('pauses and resumes with the remaining time', () => {
    jest.setSystemTime(NOW + 10_000);
    actions.togglePause();
    expect(getState().timer).toEqual({ kind: 'paused', remainingMs: 20_000 });

    jest.setSystemTime(NOW + 60_000);
    actions.togglePause();
    expect(getState().timer).toEqual({ kind: 'running', endsAt: NOW + 80_000 });
  });

  it('pauseTimer is idempotent', () => {
    actions.pauseTimer();
    const paused = getState().timer;
    actions.pauseTimer();

    expect(getState().timer).toBe(paused);
  });

  it('ignores timer actions when there is no timer', () => {
    actions.next();
    actions.adjustRest(15_000);
    actions.togglePause();

    expect(getState().timer).toBeNull();
  });
});

describe('end', () => {
  it('marks the session ended and keeps the workout id', () => {
    actions.start(WORKOUT_ID, steps);
    actions.end();

    expect(getState()).toMatchObject({
      ...initialSession,
      status: 'ended',
      workoutId: WORKOUT_ID,
    });
  });

  it('lets start begin at step 0 afterwards', () => {
    actions.start(WORKOUT_ID, steps);
    actions.next();
    actions.end();
    actions.start(WORKOUT_ID, steps);

    expect(getState()).toMatchObject({ status: 'active', stepIndex: 0 });
  });
});

describe('reset', () => {
  it('returns to the initial session', () => {
    actions.start(WORKOUT_ID, steps);
    actions.reset();

    expect(getState()).toMatchObject(initialSession);
  });
});

describe('persistence', () => {
  it('persists idle once the session is ended', () => {
    actions.start(WORKOUT_ID, steps);
    actions.end();

    expect(getState().status).toBe('ended');
    expect(readPersisted()).toEqual(initialSession);
  });

  it('persists an active session without the actions', () => {
    actions.start(WORKOUT_ID, steps);
    actions.next();

    expect(readPersisted()).toEqual({
      status: 'active',
      workoutId: WORKOUT_ID,
      steps,
      stepIndex: 1,
      timer: { kind: 'running', endsAt: NOW + 30_000 },
    });
  });

  it('persists idle once the workout is completed', () => {
    actions.start(WORKOUT_ID, steps);
    sessionStore.setState({ stepIndex: steps.length - 1 });
    actions.next();

    expect(getState().status).toBe('completed');
    expect(readPersisted()).toEqual(initialSession);
  });

  it('starts from the first step after completing a workout', () => {
    actions.start(WORKOUT_ID, steps);
    sessionStore.setState({ stepIndex: steps.length - 1 });
    actions.next();
    actions.start(WORKOUT_ID, steps);

    expect(getState()).toMatchObject({ status: 'active', workoutId: WORKOUT_ID, stepIndex: 0 });
  });

  it('restores an active session on rehydrate and keeps the actions', async () => {
    actions.start(WORKOUT_ID, steps);
    actions.next();
    const saved = mmkvStateStorage.getItem('workout-session') as string;

    sessionStore.setState(initialSession);
    mmkvStateStorage.setItem('workout-session', saved);
    await sessionStore.persist.rehydrate();

    expect(getState()).toMatchObject({
      status: 'active',
      steps,
      stepIndex: 1,
      timer: { kind: 'running', endsAt: NOW + 30_000 },
    });
    expect(getState().actions).toBe(actions);
  });

  it('keeps navigating the saved steps after rehydrate', async () => {
    actions.start(WORKOUT_ID, steps);
    const saved = mmkvStateStorage.getItem('workout-session') as string;

    sessionStore.setState(initialSession);
    mmkvStateStorage.setItem('workout-session', saved);
    await sessionStore.persist.rehydrate();
    actions.skip();

    expect(getState()).toMatchObject({ status: 'active', stepIndex: 2, timer: null });
  });

  it('discards a session saved before steps were persisted', async () => {
    actions.start(WORKOUT_ID, steps);
    mmkvStateStorage.setItem(
      'workout-session',
      JSON.stringify({
        state: { status: 'active', workoutId: WORKOUT_ID, stepIndex: 4, timer: null },
        version: 0,
      }),
    );

    await sessionStore.persist.rehydrate();

    expect(getState()).toMatchObject(initialSession);
  });
});
