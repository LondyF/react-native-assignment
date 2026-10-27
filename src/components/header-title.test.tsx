import { render, screen } from '@testing-library/react-native';

import { HeaderTitle } from './header-title';

describe('HeaderTitle', () => {
  it('renders the title as a header', async () => {
    await render(<HeaderTitle>Workouts</HeaderTitle>);

    expect(screen.getByRole('header', { name: 'Workouts' })).toBeTruthy();
  });
});
