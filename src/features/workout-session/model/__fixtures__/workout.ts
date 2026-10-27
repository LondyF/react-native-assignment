import type { Exercise, Workout } from '@/features/workout';

const repsExercise = (id: string, restSeconds: number[]): Exercise => ({
  kind: 'reps',
  id,
  name: `Exercise ${id}`,
  thumbnailUrl: `https://example.com/${id}`,
  bodyParts: [],
  sets: restSeconds.map((rest) => ({ reps: 10, restSeconds: rest })),
});

export const workoutFixture: Workout = {
  id: 'workout-1',
  name: 'Fixture workout',
  description: null,
  level: null,
  pictureUrl: 'https://example.com/workout.jpg',
  sections: [
    { key: 'warmUp', exercises: [repsExercise('burpee', [30, 30])] },
    { key: 'powerSet', exercises: [repsExercise('pull-up', [60, 0])] },
    {
      key: 'coolDown',
      exercises: [
        {
          kind: 'timed',
          id: 'plank',
          name: 'Plank',
          thumbnailUrl: 'https://example.com/plank',
          bodyParts: [],
          durationSeconds: 90,
        },
      ],
    },
  ],
};
