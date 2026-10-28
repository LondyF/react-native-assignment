import { renderHook } from '@testing-library/react-native';

import { workoutFixture } from '../model/__fixtures__/workout';
import { buildSteps } from '../model/build-steps';
import type { Step } from '../model/step';
import { initialSession, sessionStore } from '../store/session-store';
import { useWorkoutSession } from './use-workout-session';

const WORKOUT_ID = workoutFixture.id;
const steps = buildSteps(workoutFixture);

beforeEach(() => {
  sessionStore.setState(initialSession);
});

describe('useWorkoutSession', () => {
  it('is inactive when there is no session', async () => {
    const { result } = await renderHook(() => useWorkoutSession(WORKOUT_ID));

    expect(result.current.status).toBe('inactive');
  });

  it('is inactive when the session belongs to another workout', async () => {
    sessionStore.setState({ status: 'active', workoutId: 'other', steps, stepIndex: 0 });

    const { result } = await renderHook(() => useWorkoutSession(WORKOUT_ID));

    expect(result.current.status).toBe('inactive');
  });

  it('is completed when the workout was finished', async () => {
    sessionStore.setState({ status: 'completed', workoutId: WORKOUT_ID });

    const { result } = await renderHook(() => useWorkoutSession(WORKOUT_ID));

    expect(result.current.status).toBe('completed');
  });

  it('is ready at the stored step', async () => {
    sessionStore.setState({ status: 'active', workoutId: WORKOUT_ID, steps, stepIndex: 2 });

    const { result } = await renderHook(() => useWorkoutSession(WORKOUT_ID));

    expect(result.current).toMatchObject({ status: 'ready', stepIndex: 2, step: steps[2] });
  });

  it('plays the steps saved in the session, not the current workout content', async () => {
    const savedSteps: Step[] = [
      {
        kind: 'timed',
        sectionKey: 'coolDown',
        exerciseId: 'stretch',
        exerciseName: 'Stretch',
        thumbnailUrl: 'https://example.com/stretch',
        durationSeconds: 60,
      },
    ];
    sessionStore.setState({
      status: 'active',
      workoutId: WORKOUT_ID,
      steps: savedSteps,
      stepIndex: 0,
    });

    const { result } = await renderHook(() => useWorkoutSession(WORKOUT_ID));

    expect(result.current).toMatchObject({ status: 'ready', step: savedSteps[0] });
  });
});
