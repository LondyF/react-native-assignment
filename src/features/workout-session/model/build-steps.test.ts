import { workoutFixture } from './__fixtures__/workout';
import { buildSteps } from './build-steps';

describe('buildSteps', () => {
  const steps = buildSteps(workoutFixture);

  it('flattens sets, rests and timed exercises in playback order', () => {
    expect(steps.map((step) => step.kind)).toEqual([
      'set',
      'rest',
      'set',
      'rest',
      'set',
      'rest',
      'set',
      'timed',
    ]);
  });

  it('numbers the sets of an exercise', () => {
    expect(steps[0]).toMatchObject({ setNumber: 1, setCount: 2, reps: 10 });
    expect(steps[2]).toMatchObject({ setNumber: 2, setCount: 2 });
  });

  it('keeps a rest that follows the last set of an exercise when more steps remain', () => {
    expect(steps[3]).toMatchObject({ kind: 'rest', durationSeconds: 30, sectionKey: 'warmUp' });
  });

  it('skips a rest with zero seconds', () => {
    expect(steps[6]).toMatchObject({ kind: 'set', exerciseId: 'pull-up', setNumber: 2 });
    expect(steps[7]).toMatchObject({ kind: 'timed', durationSeconds: 90 });
  });

  it('tags every step with its section', () => {
    expect(steps.map((step) => step.sectionKey)).toEqual([
      'warmUp',
      'warmUp',
      'warmUp',
      'warmUp',
      'powerSet',
      'powerSet',
      'powerSet',
      'coolDown',
    ]);
  });

  it('never ends on a rest', () => {
    const [warmUp] = workoutFixture.sections;
    const restLast = buildSteps({ ...workoutFixture, sections: [warmUp] });

    expect(restLast.at(-1)?.kind).toBe('set');
  });
});
