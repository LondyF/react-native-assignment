import { Text, View } from 'react-native';

import type { SectionKey } from '@/features/workout';

import { SECTION_LABELS } from '../model/section-labels';
import type { SectionProgress } from '../model/section-progress';

type SectionTabsProps = {
  sections: SectionProgress[];
  activeSection: SectionKey;
};

export const SectionTabs = ({ sections, activeSection }: SectionTabsProps) => (
  <View accessibilityRole="tablist" className="flex-row gap-2 px-4">
    {sections.map(({ sectionKey, progress }) => {
      const progressPercentage = Math.round(progress * 100);

      return (
        <View
          key={sectionKey}
          accessible
          accessibilityRole="tab"
          accessibilityLabel={SECTION_LABELS[sectionKey]}
          accessibilityState={{ selected: sectionKey === activeSection }}
          accessibilityValue={{ min: 0, max: 100, now: progressPercentage }}
          className="flex-1 gap-1"
        >
          <Text className="font-label text-xs text-ink">{SECTION_LABELS[sectionKey]}</Text>
          <View className="h-0.5 overflow-hidden rounded-full bg-track">
            <View className="h-full bg-accent" style={{ width: `${progressPercentage}%` }} />
          </View>
        </View>
      );
    })}
  </View>
);
