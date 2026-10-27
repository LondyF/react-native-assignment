import { render, screen } from '@testing-library/react-native';

import type { ExerciseStep } from '../model/build-steps';
import { CurrentExercise } from './current-exercise';

jest.mock('uniwind', () => ({ withUniwind: <T,>(Component: T) => Component }));

const repsStep: ExerciseStep = {
  sectionKey: 'powerSet',
  exercise: {
    id: 'squat',
    name: 'Hack squat',
    thumbnailUrl: 'https://example.com/squat.jpg',
    bodyParts: [],
    kind: 'reps',
    sets: [
      { reps: 10, restSeconds: 20 },
      { reps: 10, restSeconds: 20 },
      { reps: 10, restSeconds: 20 },
    ],
  },
  setNumber: 2,
  setCount: 3,
};

const timedStep: ExerciseStep = {
  sectionKey: 'coolDown',
  exercise: {
    id: 'plank',
    name: 'Plank drag',
    thumbnailUrl: 'https://example.com/plank.jpg',
    bodyParts: [],
    kind: 'timed',
    durationSeconds: 90,
  },
  setNumber: 1,
  setCount: 1,
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
