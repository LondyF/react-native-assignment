import { renderHook } from '@testing-library/react-native';
import { AppState, type AppStateStatus } from 'react-native';

import { usePauseOnBackground } from './use-pause-on-background';

const setup = () => {
  const remove = jest.fn();
  let listener: (state: AppStateStatus) => void = () => {};
  jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, handler) => {
    listener = handler;
    return { remove };
  });
  return { remove, emit: (state: AppStateStatus) => listener(state) };
};

describe('usePauseOnBackground', () => {
  afterEach(() => jest.restoreAllMocks());

  it('calls the callback when the app goes to the background', async () => {
    const { emit } = setup();
    const onBackground = jest.fn();
    await renderHook(() => usePauseOnBackground(onBackground));

    emit('background');

    expect(onBackground).toHaveBeenCalledTimes(1);
  });

  it('ignores the inactive state', async () => {
    const { emit } = setup();
    const onBackground = jest.fn();
    await renderHook(() => usePauseOnBackground(onBackground));

    emit('inactive');

    expect(onBackground).not.toHaveBeenCalled();
  });

  it('removes the listener on unmount', async () => {
    const { remove } = setup();
    const { unmount } = await renderHook(() => usePauseOnBackground(jest.fn()));

    await unmount();

    expect(remove).toHaveBeenCalledTimes(1);
  });
});
