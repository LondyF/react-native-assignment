import { render, screen } from '@testing-library/react-native';

import { SectionTabs } from './section-tabs';

describe('SectionTabs', () => {
  it('marks only the active section as selected', async () => {
    await render(
      <SectionTabs
        sections={[
          { sectionKey: 'warmUp', progress: 1 },
          { sectionKey: 'powerSet', progress: 1 / 3 },
          { sectionKey: 'coolDown', progress: 0 },
        ]}
        activeSection="powerSet"
      />,
    );

    expect(screen.getByRole('tab', { name: 'Power Set', selected: true })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Warm up', selected: false })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Cool Down', selected: false })).toBeTruthy();
  });

  it('exposes each section progress as a percentage', async () => {
    await render(
      <SectionTabs
        sections={[
          { sectionKey: 'warmUp', progress: 1 / 3 },
          { sectionKey: 'coolDown', progress: 0 },
        ]}
        activeSection="warmUp"
      />,
    );

    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.getByRole('tab', { name: 'Warm up', value: { now: 33 } })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Cool Down', value: { now: 0 } })).toBeTruthy();
  });
});
