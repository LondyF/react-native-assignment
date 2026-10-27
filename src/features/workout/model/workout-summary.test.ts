import contentfulWorkout from './__fixtures__/contentful-workout.json';
import { getExercises, getTargetBodyParts } from './workout-summary';
import { workoutSchema } from './workout-schema';

const workout = workoutSchema.parse(contentfulWorkout);

describe('workout summary', () => {
  it('lists every exercise in section order', () => {
    expect(getExercises(workout).map((exercise) => exercise.id)).toEqual([
      '20GhLvNUZZQm3AKsC2ayS9',
      '4UggMmQksusOkbX58sGeed',
      '1CMCYR6E79U8rz4ulDNxV4',
      '5YPtT9bCXhwyuhn6Hh09Ts',
    ]);
  });

  it('lists each target body part once', () => {
    expect(getTargetBodyParts(workout)).toEqual(['Back', 'Legs']);
  });
});
