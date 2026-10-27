import { ActivityIndicator, View } from 'react-native';
import { useCSSVariable } from 'uniwind';

export const LoadingState = () => {
  const accent = useCSSVariable('--color-accent');

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      className="flex-1 items-center justify-center bg-background"
    >
      <ActivityIndicator size="large" color={typeof accent === 'string' ? accent : undefined} />
    </View>
  );
};
