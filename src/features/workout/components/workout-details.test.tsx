import { render, screen } from '@testing-library/react-native';

import type { Workout } from '../model/workout';
import { useWorkout } from '../hooks/use-workout';
import { WorkoutDetails } from './workout-details';

jest.mock('../hooks/use-workout', () => ({ useWorkout: jest.fn() }));
jest.mock('uniwind', () => ({ useCSSVariable: () => '#ffffff' }));
jest.mock('@/components/image', () => ({ Image: () => null }));

const workout: Workout = {
  id: 'workout-1',
  name: 'Fixture workout',
  description: null,
  level: null,
  pictureUrl: 'https://example.com/workout.jpg',
  sections: [
    {
      key: 'warmUp',
      exercises: [
        {
          kind: 'reps',
          id: 'burpee',
          name: 'Burpee',
          thumbnailUrl: 'https://example.com/burpee',
          bodyParts: [],
          sets: [{ reps: 10, restSeconds: 30 }],
        },
      ],
    },
  ],
};

beforeEach(() => {
  jest.mocked(useWorkout).mockReturnValue({
    data: workout,
    isPending: false,
    refetch: jest.fn(),
  } as unknown as ReturnType<typeof useWorkout>);
});

describe('WorkoutDetails', () => {
  it('shows Start workout when nothing is in progress', async () => {
    await render(
      <WorkoutDetails workoutId="workout-1" isInProgress={false} onStartWorkout={jest.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Start workout' })).toBeTruthy();
  });

  it('shows Resume workout when the workout is in progress', async () => {
    await render(<WorkoutDetails workoutId="workout-1" isInProgress onStartWorkout={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Resume workout' })).toBeTruthy();
  });
});
