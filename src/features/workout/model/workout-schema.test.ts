import contentfulWorkout from './__fixtures__/contentful-workout.json';
import { workoutResponseSchema, workoutSchema } from './workout-schema';

describe('workoutSchema', () => {
  const workout = workoutSchema.parse(contentfulWorkout);

  it('maps the identity and presentation fields', () => {
    expect(workout).toMatchObject({
      id: '1qxS37UJepjiXhLPVqM8tX',
      name: 'Medium intensity workout',
      level: 'Beginner',
    });
    expect(workout.pictureUrl).toContain('images.ctfassets.net');
  });

  it('orders the sections warm up, power set, cool down', () => {
    expect(workout.sections.map((section) => section.key)).toEqual([
      'warmUp',
      'powerSet',
      'coolDown',
    ]);
  });

  it('builds a reps exercise with a rest per set and a thumbnail url', () => {
    const [burpee] = workout.sections[0].exercises;

    expect(burpee).toMatchObject({
      kind: 'reps',
      thumbnailUrl: 'https://static.cdn.vixyvideo.com/p/380/thumbnail/entry_id/0_4j3rw31s',
      sets: [
        { reps: 12, restSeconds: 30 },
        { reps: 10, restSeconds: 30 },
        { reps: 8, restSeconds: 30 },
      ],
    });
  });

  it('gives a set zero rest when the rest list is shorter than the rep list', () => {
    const [pullUp] = workout.sections[1].exercises;

    expect(pullUp.kind === 'reps' && pullUp.sets.map((set) => set.restSeconds)).toEqual([
      60, 60, 0,
    ]);
  });

  it('coerces string rests to numbers', () => {
    const hackSquat = workout.sections[1].exercises[1];

    expect(hackSquat.kind === 'reps' && hackSquat.sets.map((set) => set.restSeconds)).toEqual([
      20, 0, 20,
    ]);
  });

  it('converts an [h, m, s] duration to seconds for a timed exercise', () => {
    const [plank] = workout.sections[2].exercises;

    expect(plank).toMatchObject({ kind: 'timed', durationSeconds: 90 });
  });

  it('reads a numeric duration as seconds', () => {
    const timed = workoutSchema.parse({
      ...contentfulWorkout,
      coolDown: [{ ...contentfulWorkout.coolDown[0], duration: 45 }],
    });

    expect(timed.sections[2].exercises[0]).toMatchObject({ durationSeconds: 45 });
  });

  it('treats missing sections as empty', () => {
    const sparse = workoutSchema.parse({ ...contentfulWorkout, warmUp: null, coolDown: null });

    expect(sparse.sections[0].exercises).toEqual([]);
    expect(sparse.sections[2].exercises).toEqual([]);
  });

  it('rejects an exercise without an id', () => {
    const { id: _id, ...withoutId } = contentfulWorkout.warmUp[0];

    expect(() => workoutSchema.parse({ ...contentfulWorkout, warmUp: [withoutId] })).toThrow();
  });
});

describe('workoutResponseSchema', () => {
  it('parses a collection response', () => {
    const response = workoutResponseSchema.parse({
      data: { workoutCollection: { items: [contentfulWorkout] } },
    });

    expect(response.data.workoutCollection.items).toHaveLength(1);
  });

  it('rejects a response without data', () => {
    expect(() => workoutResponseSchema.parse({ errors: [{ message: 'boom' }] })).toThrow();
  });
});
