import type { Workout } from '@/features/workout';

import { buildSteps } from './build-steps';

const workout: Workout = {
  id: 'workout',
  name: 'Workout',
  description: null,
  level: null,
  pictureUrl: 'https://example.com/picture.jpg',
  sections: [
    {
      key: 'warmUp',
      exercises: [
        {
          id: 'burpee',
          name: 'Burpee',
          thumbnailUrl: 'https://example.com/burpee.jpg',
          bodyParts: [],
          kind: 'reps',
          sets: [
            { reps: 12, restSeconds: 30 },
            { reps: 10, restSeconds: 30 },
          ],
        },
      ],
    },
    { key: 'powerSet', exercises: [] },
    {
      key: 'coolDown',
      exercises: [
        {
          id: 'plank',
          name: 'Plank',
          thumbnailUrl: 'https://example.com/plank.jpg',
          bodyParts: [],
          kind: 'timed',
          durationSeconds: 90,
        },
      ],
    },
  ],
};

describe('buildSteps', () => {
  it('creates one step per set, in section order', () => {
    const steps = buildSteps(workout);

    expect(
      steps.map(({ sectionKey, exercise, setNumber, setCount }) => ({
        sectionKey,
        exerciseId: exercise.id,
        setNumber,
        setCount,
      })),
    ).toEqual([
      { sectionKey: 'warmUp', exerciseId: 'burpee', setNumber: 1, setCount: 2 },
      { sectionKey: 'warmUp', exerciseId: 'burpee', setNumber: 2, setCount: 2 },
      { sectionKey: 'coolDown', exerciseId: 'plank', setNumber: 1, setCount: 1 },
    ]);
  });

  it('returns no steps for a workout without exercises', () => {
    const emptyWorkout: Workout = {
      ...workout,
      sections: workout.sections.map((section) => ({ ...section, exercises: [] })),
    };

    expect(buildSteps(emptyWorkout)).toEqual([]);
  });
});
