import type { SymbolViewProps } from 'expo-symbols';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/icon';

type PlayerControlsProps = {
  canGoPrevious: boolean;
  onPrevious: () => void;
  onNext: () => void;
  primaryIcon: SymbolViewProps['name'];
  primaryLabel: string;
  onPrimaryPress: () => void;
};

export const PlayerControls = ({
  canGoPrevious,
  onPrevious,
  onNext,
  primaryIcon,
  primaryLabel,
  onPrimaryPress,
}: PlayerControlsProps) => (
  <View className="flex-row items-center justify-center gap-6">
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Previous exercise"
      accessibilityState={{ disabled: !canGoPrevious }}
      disabled={!canGoPrevious}
      onPress={onPrevious}
      className="h-9 w-9 items-center justify-center rounded-full border border-primary active:opacity-80 disabled:opacity-40"
    >
      <Icon name="backward.end.fill" tone="primary" size={14} />
    </Pressable>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={primaryLabel}
      onPress={onPrimaryPress}
      className="h-16 w-16 items-center justify-center rounded-full bg-primary active:opacity-80"
    >
      <Icon name={primaryIcon} tone="onPrimary" size={24} />
    </Pressable>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Next exercise"
      onPress={onNext}
      className="h-9 w-9 items-center justify-center rounded-full border border-primary active:opacity-80"
    >
      <Icon name="forward.end.fill" tone="primary" size={14} />
    </Pressable>
  </View>
);
