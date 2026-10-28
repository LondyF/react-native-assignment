import { fireEvent, render, screen } from '@testing-library/react-native';

import { StopSessionSheet } from './stop-session-sheet';

jest.mock('uniwind', () => ({
  withUniwind: <T,>(Component: T) => Component,
  useCSSVariable: () => '#000000',
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const renderSheet = async () => {
  const handlers = { onEnd: jest.fn(), onContinueLater: jest.fn(), onClose: jest.fn() };
  await render(<StopSessionSheet {...handlers} />);
  return handlers;
};

describe('StopSessionSheet', () => {
  it('disables End workout until a reason is picked', async () => {
    const { onEnd } = await renderSheet();

    await fireEvent.press(screen.getByRole('button', { name: 'End workout' }));
    expect(onEnd).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByRole('radio', { name: 'Too Hard' }));

    expect(screen.getByRole('radio', { name: 'Too Hard', checked: true })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'End workout' }));
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('continues later without a reason', async () => {
    const { onContinueLater } = await renderSheet();

    await fireEvent.press(screen.getByRole('button', { name: 'Continue later' }));

    expect(onContinueLater).toHaveBeenCalledTimes(1);
  });

  it('closes', async () => {
    const { onClose } = await renderSheet();

    await fireEvent.press(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
