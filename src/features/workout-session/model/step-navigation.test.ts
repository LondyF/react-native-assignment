import { workoutFixture } from './__fixtures__/workout';
import { buildSteps } from './build-steps';
import { findNextExerciseIndex, findPreviousExerciseIndex } from './step-navigation';

const steps = buildSteps(workoutFixture);

describe('step navigation', () => {
  it('skips rests when moving forward', () => {
    expect(findNextExerciseIndex(steps, 0)).toBe(2);
    expect(findNextExerciseIndex(steps, 1)).toBe(2);
  });

  it('returns the step count when nothing follows', () => {
    expect(findNextExerciseIndex(steps, steps.length - 1)).toBe(steps.length);
  });

  it('skips rests when moving backward', () => {
    expect(findPreviousExerciseIndex(steps, 4)).toBe(2);
    expect(findPreviousExerciseIndex(steps, 3)).toBe(2);
  });

  it('returns -1 when nothing precedes', () => {
    expect(findPreviousExerciseIndex(steps, 0)).toBe(-1);
    expect(findPreviousExerciseIndex(steps, 1)).toBe(0);
  });
});
