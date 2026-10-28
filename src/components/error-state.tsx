import { Text, View } from 'react-native';

import { Button } from './button';

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
  actionLabel?: string;
};

export const ErrorState = ({ message, onRetry, actionLabel = 'Try again' }: ErrorStateProps) => (
  <View className="flex-1 items-center justify-center gap-4 bg-background px-4">
    <Text accessibilityRole="alert" className="text-center font-body text-sm text-ink-muted">
      {message}
    </Text>
    <Button label={actionLabel} onPress={onRetry} />
  </View>
);
