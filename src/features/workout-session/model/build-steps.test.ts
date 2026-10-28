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
      'rest',
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

  it('gives a set with no rest the default rest', () => {
    expect(steps[6]).toMatchObject({ kind: 'set', exerciseId: 'pull-up', setNumber: 2 });
    expect(steps[7]).toMatchObject({ kind: 'rest', durationSeconds: 30, sectionKey: 'powerSet' });
    expect(steps[8]).toMatchObject({ kind: 'timed', durationSeconds: 90 });
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
      'powerSet',
      'coolDown',
    ]);
  });

  it('gives a timed exercise the default rest when more steps remain', () => {
    const [warmUp, , coolDown] = workoutFixture.sections;
    const timedFirst = buildSteps({ ...workoutFixture, sections: [coolDown, warmUp] });

    expect(timedFirst[0]).toMatchObject({ kind: 'timed' });
    expect(timedFirst[1]).toMatchObject({
      kind: 'rest',
      durationSeconds: 30,
      sectionKey: 'coolDown',
    });
  });

  it('never ends on a rest', () => {
    const [warmUp] = workoutFixture.sections;
    const restLast = buildSteps({ ...workoutFixture, sections: [warmUp] });

    expect(restLast.at(-1)?.kind).toBe('set');
  });
});
