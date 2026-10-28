import { renderHook, waitFor } from '@testing-library/react-native';

import { useWorkout } from '@/features/workout';

import { workoutFixture } from '../model/__fixtures__/workout';
import { buildSteps } from '../model/build-steps';
import { initialSession, sessionStore } from '../store/session-store';
import { useWorkoutSession } from './use-workout-session';

jest.mock('@/features/workout', () => ({ useWorkout: jest.fn() }));

const WORKOUT_ID = workoutFixture.id;
const steps = buildSteps(workoutFixture);

beforeEach(() => {
  sessionStore.setState(initialSession);
  jest.mocked(useWorkout).mockReturnValue({
    data: workoutFixture,
    isPending: false,
    refetch: jest.fn(),
  } as unknown as ReturnType<typeof useWorkout>);
});

describe('useWorkoutSession', () => {
  it('is inactive when there is no session', async () => {
    const { result } = await renderHook(() => useWorkoutSession(WORKOUT_ID));

    expect(result.current.status).toBe('inactive');
  });

  it('is inactive when the session belongs to another workout', async () => {
    sessionStore.setState({ status: 'active', workoutId: 'other', stepIndex: 0, timer: null });

    const { result } = await renderHook(() => useWorkoutSession(WORKOUT_ID));

    expect(result.current.status).toBe('inactive');
  });

  it('is inactive after the stale guard ends a session', async () => {
    sessionStore.setState({
      status: 'active',
      workoutId: WORKOUT_ID,
      stepIndex: steps.length + 5,
      timer: null,
    });

    const { result } = await renderHook(() => useWorkoutSession(WORKOUT_ID));

    await waitFor(() => expect(result.current.status).toBe('inactive'));
    expect(sessionStore.getState().status).toBe('idle');
  });

  it('is ready at the stored step', async () => {
    sessionStore.setState({ status: 'active', workoutId: WORKOUT_ID, stepIndex: 2, timer: null });

    const { result } = await renderHook(() => useWorkoutSession(WORKOUT_ID));

    expect(result.current).toMatchObject({ status: 'ready', stepIndex: 2, step: steps[2] });
  });
});
