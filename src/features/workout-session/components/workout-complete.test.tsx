import { fireEvent, render, screen } from '@testing-library/react-native';

import { WorkoutComplete } from './workout-complete';

jest.mock('react-native-svg', () => {
  const Mock = ({ children }: { children?: React.ReactNode }) => children ?? null;
  return {
    __esModule: true,
    default: Mock,
    Defs: Mock,
    LinearGradient: Mock,
    Rect: Mock,
    Stop: Mock,
  };
});

jest.mock('uniwind', () => ({ useCSSVariable: () => '#ffffff' }));

describe('WorkoutComplete', () => {
  it('calls onDone when pressing Done', async () => {
    const onDone = jest.fn();
    await render(<WorkoutComplete onDone={onDone} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));

    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
