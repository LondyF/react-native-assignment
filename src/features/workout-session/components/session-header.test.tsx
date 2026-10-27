import { fireEvent, render, screen } from '@testing-library/react-native';

import { SessionHeader } from './session-header';

jest.mock('uniwind', () => ({ useCSSVariable: () => '#000000' }));

describe('SessionHeader', () => {
  it('renders the title as a header', async () => {
    await render(<SessionHeader title="Warm up" onClose={jest.fn()} />);

    expect(screen.getByRole('header', { name: 'Warm up' })).toBeTruthy();
  });

  it('calls onClose when the close button is pressed', async () => {
    const onClose = jest.fn();
    await render(<SessionHeader title="Warm up" onClose={onClose} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Close workout' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
