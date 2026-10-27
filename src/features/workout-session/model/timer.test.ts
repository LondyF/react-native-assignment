import {
  adjustTimer,
  getRemainingMs,
  pauseTimer,
  resumeTimer,
  startTimer,
  startTimerForStep,
} from './timer';

const NOW = 1_000_000;

describe('timer', () => {
  it('starts running and ends after the duration', () => {
    expect(startTimer(30, NOW)).toEqual({ kind: 'running', endsAt: NOW + 30_000 });
  });

  it('reports the remaining time and floors it at zero', () => {
    const timer = startTimer(30, NOW);

    expect(getRemainingMs(timer, NOW + 10_000)).toBe(20_000);
    expect(getRemainingMs(timer, NOW + 60_000)).toBe(0);
  });

  it('adds time to a running timer', () => {
    expect(adjustTimer(startTimer(30, NOW), 15_000, NOW)).toEqual({
      kind: 'running',
      endsAt: NOW + 45_000,
    });
  });

  it('never removes more time than remains on a running timer', () => {
    const timer = startTimer(10, NOW);

    expect(getRemainingMs(adjustTimer(timer, -15_000, NOW), NOW)).toBe(0);
  });

  it('survives repeated removals without going below zero', () => {
    let timer = startTimer(40, NOW);
    for (let tap = 0; tap < 10; tap += 1) timer = adjustTimer(timer, -15_000, NOW);

    expect(getRemainingMs(timer, NOW)).toBe(0);
    expect(adjustTimer(timer, 15_000, NOW)).toEqual({ kind: 'running', endsAt: NOW + 15_000 });
  });

  it('adjusts a paused timer and floors it at zero', () => {
    const paused = { kind: 'paused', remainingMs: 10_000 } as const;

    expect(adjustTimer(paused, 15_000, NOW)).toEqual({ kind: 'paused', remainingMs: 25_000 });
    expect(adjustTimer(paused, -15_000, NOW)).toEqual({ kind: 'paused', remainingMs: 0 });
  });

  it('pauses with the remaining time and resumes from it', () => {
    const paused = pauseTimer(startTimer(30, NOW), NOW + 10_000);

    expect(paused).toEqual({ kind: 'paused', remainingMs: 20_000 });
    expect(resumeTimer(paused, NOW + 50_000)).toEqual({ kind: 'running', endsAt: NOW + 70_000 });
  });

  it('leaves a timer alone when it is already in the requested state', () => {
    const paused = { kind: 'paused', remainingMs: 5_000 } as const;
    const running = startTimer(5, NOW);

    expect(pauseTimer(paused, NOW)).toBe(paused);
    expect(resumeTimer(running, NOW)).toBe(running);
  });

  it('starts a timer for rest and timed steps but not for sets', () => {
    expect(
      startTimerForStep({ kind: 'rest', sectionKey: 'warmUp', durationSeconds: 30 }, NOW),
    ).toEqual({ kind: 'running', endsAt: NOW + 30_000 });
    expect(
      startTimerForStep(
        {
          kind: 'set',
          sectionKey: 'warmUp',
          exerciseId: 'a',
          exerciseName: 'A',
          thumbnailUrl: '',
          setNumber: 1,
          setCount: 1,
          reps: 5,
        },
        NOW,
      ),
    ).toBeNull();
  });
});
