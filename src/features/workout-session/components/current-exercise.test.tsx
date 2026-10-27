import { render, screen } from '@testing-library/react-native';

import type { SetStep, TimedStep } from '../model/step';
import { CurrentExercise } from './current-exercise';

jest.mock('uniwind', () => ({ withUniwind: <T,>(Component: T) => Component }));

const repsStep: SetStep = {
  kind: 'set',
  sectionKey: 'powerSet',
  exerciseId: 'squat',
  exerciseName: 'Hack squat',
  thumbnailUrl: 'https://example.com/squat.jpg',
  setNumber: 2,
  setCount: 3,
  reps: 10,
};

const timedStep: TimedStep = {
  kind: 'timed',
  sectionKey: 'coolDown',
  exerciseId: 'plank',
  exerciseName: 'Plank drag',
  thumbnailUrl: 'https://example.com/plank.jpg',
  durationSeconds: 90,
};

describe('CurrentExercise', () => {
  it('shows the thumbnail, name and set progress of a reps exercise', async () => {
    await render(<CurrentExercise step={repsStep} />);

    expect(screen.getByLabelText('Hack squat')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Hack squat' })).toBeTruthy();
    expect(screen.getByText('Sets 2 of 3')).toBeTruthy();
  });

  it('shows no set progress for a timed exercise', async () => {
    await render(<CurrentExercise step={timedStep} />);

    expect(screen.getByRole('header', { name: 'Plank drag' })).toBeTruthy();
    expect(screen.queryByText(/Sets/)).toBeNull();
  });
});
