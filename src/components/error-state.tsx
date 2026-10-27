import { Text, View } from 'react-native';

import { PrimaryButton } from './primary-button';

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <View className="flex-1 items-center justify-center gap-4 bg-background px-4">
    <Text accessibilityRole="alert" className="text-center font-body text-sm text-ink-muted">
      {message}
    </Text>
    <PrimaryButton label="Try again" onPress={onRetry} />
  </View>
);
