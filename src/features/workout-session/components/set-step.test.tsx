import { fireEvent, render, screen } from '@testing-library/react-native';

import type { SetStep as SetStepModel } from '../model/step';
import { SetStep } from './set-step';

jest.mock('uniwind', () => ({
  withUniwind: <T,>(Component: T) => Component,
  useCSSVariable: () => '#000000',
}));

const step: SetStepModel = {
  kind: 'set',
  sectionKey: 'powerSet',
  exerciseId: 'squat',
  exerciseName: 'Squats',
  thumbnailUrl: 'https://example.com/squat.jpg',
  setNumber: 1,
  setCount: 3,
  reps: 10,
};

const renderSetStep = async () => {
  const handlers = { onNext: jest.fn(), onSkip: jest.fn(), onPrevious: jest.fn() };
  await render(<SetStep step={step} canGoPrevious {...handlers} />);
  return handlers;
};

describe('SetStep', () => {
  it('starts Reps at the planned reps and Kgs empty', async () => {
    await renderSetStep();

    expect(screen.getByLabelText('Reps').props.value).toBe('10');
    expect(screen.getByLabelText('Kgs').props.value).toBe('');
  });

  it('keeps digits only in Reps', async () => {
    await renderSetStep();

    await fireEvent.changeText(screen.getByLabelText('Reps'), '12a');

    expect(screen.getByLabelText('Reps').props.value).toBe('12');
  });

  it('completes the set', async () => {
    const { onNext } = await renderSetStep();

    await fireEvent.press(screen.getByRole('button', { name: 'Complete set' }));

    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
