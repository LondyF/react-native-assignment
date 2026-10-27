import contentfulWorkout from '../model/__fixtures__/contentful-workout.json';
import { fetchWorkout, fetchWorkouts, WorkoutNotFoundError } from './fetch-workout';

const mockFetchResponse = (body: unknown, ok = true, status = 200) => {
  globalThis.fetch = jest.fn().mockResolvedValue({ ok, status, json: async () => body });
};

describe('fetchWorkouts', () => {
  it('returns every parsed workout', async () => {
    mockFetchResponse({ data: { workoutCollection: { items: [contentfulWorkout] } } });

    await expect(fetchWorkouts()).resolves.toMatchObject([{ id: '1qxS37UJepjiXhLPVqM8tX' }]);
  });

  it('skips workouts that do not match the schema', async () => {
    mockFetchResponse({
      data: { workoutCollection: { items: [{ sys: { id: 'broken' } }, contentfulWorkout] } },
    });

    await expect(fetchWorkouts()).resolves.toMatchObject([{ id: '1qxS37UJepjiXhLPVqM8tX' }]);
  });

  it('returns an empty list when there are no workouts', async () => {
    mockFetchResponse({ data: { workoutCollection: { items: [] } } });

    await expect(fetchWorkouts()).resolves.toEqual([]);
  });
});

describe('fetchWorkout', () => {
  it('returns the parsed workout', async () => {
    mockFetchResponse({ data: { workoutCollection: { items: [contentfulWorkout] } } });

    await expect(fetchWorkout('1qxS37UJepjiXhLPVqM8tX')).resolves.toMatchObject({
      id: '1qxS37UJepjiXhLPVqM8tX',
    });
  });

  it('throws WorkoutNotFoundError when the collection is empty', async () => {
    mockFetchResponse({ data: { workoutCollection: { items: [] } } });

    await expect(fetchWorkout('missing')).rejects.toBeInstanceOf(WorkoutNotFoundError);
  });

  it('throws when the response is not ok', async () => {
    mockFetchResponse({}, false, 500);

    await expect(fetchWorkout('any')).rejects.toThrow('Contentful responded with 500');
  });

  it('throws when the payload does not match the schema', async () => {
    mockFetchResponse({ errors: [{ message: 'boom' }] });

    await expect(fetchWorkout('any')).rejects.toThrow();
  });
});
