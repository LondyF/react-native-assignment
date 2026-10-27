import { Pressable, View } from 'react-native';

import { HeaderTitle } from '@/components/header-title';
import { Icon } from '@/components/icon';

type SessionHeaderProps = {
  title: string;
  onClose: () => void;
};

export const SessionHeader = ({ title, onClose }: SessionHeaderProps) => (
  <View className="flex-row items-center justify-center px-4 py-4">
    <HeaderTitle>{title}</HeaderTitle>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close workout"
      hitSlop={12}
      onPress={onClose}
      className="absolute right-4 active:opacity-80"
    >
      <Icon name="xmark" tone="ink" />
    </Pressable>
  </View>
);
