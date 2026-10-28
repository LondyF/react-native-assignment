import { act, fireEvent, render, screen } from '@testing-library/react-native';

import type { TimedStep as TimedStepModel } from '../model/step';
import type { Timer } from '../model/timer';
import { TimedStep } from './timed-step';

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View },
    useAnimatedStyle: () => ({}),
  };
});
jest.mock('../hooks/use-timer-progress', () => ({
  useTimerProgress: () => ({ value: 1 }),
}));
jest.mock('uniwind', () => ({
  withUniwind: <T,>(Component: T) => Component,
  useCSSVariable: () => '#000000',
}));

const step: TimedStepModel = {
  kind: 'timed',
  sectionKey: 'powerSet',
  exerciseId: 'plank',
  exerciseName: 'Plank',
  thumbnailUrl: 'https://example.com/plank.jpg',
  durationSeconds: 45,
};

const renderTimedStep = async (timer: Timer) => {
  const handlers = {
    onNext: jest.fn(),
    onSkip: jest.fn(),
    onPrevious: jest.fn(),
    onTogglePause: jest.fn(),
    onPause: jest.fn(),
  };
  await render(<TimedStep step={step} timer={timer} canGoPrevious {...handlers} />);
  return handlers;
};

describe('TimedStep', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows the remaining clock and the total', async () => {
    await renderTimedStep({ kind: 'paused', remainingMs: 30_000 });

    expect(screen.getByText('0:30')).toBeOnTheScreen();
    expect(screen.getByText('0:45')).toBeOnTheScreen();
  });

  it('offers pause while running and toggles it', async () => {
    const { onTogglePause } = await renderTimedStep({
      kind: 'running',
      endsAt: Date.now() + 30_000,
    });

    await fireEvent.press(screen.getByRole('button', { name: 'Pause exercise' }));

    expect(onTogglePause).toHaveBeenCalledTimes(1);
  });

  it('offers resume while paused and toggles it', async () => {
    const { onTogglePause } = await renderTimedStep({ kind: 'paused', remainingMs: 30_000 });

    await fireEvent.press(screen.getByRole('button', { name: 'Resume exercise' }));

    expect(onTogglePause).toHaveBeenCalledTimes(1);
  });

  it('skips with Next and goes back with Previous', async () => {
    const { onSkip, onPrevious } = await renderTimedStep({ kind: 'paused', remainingMs: 30_000 });

    await fireEvent.press(screen.getByRole('button', { name: 'Next exercise' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Previous exercise' }));

    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it('calls next once when the duration has passed', async () => {
    const { onNext } = await renderTimedStep({ kind: 'running', endsAt: Date.now() + 45_000 });

    await act(async () => {
      jest.advanceTimersByTime(46_000);
    });

    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
