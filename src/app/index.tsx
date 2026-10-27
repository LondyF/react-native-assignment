import { Text, View } from 'react-native';
import { useMMKVNumber } from 'react-native-mmkv';

import { PrimaryButton } from '@/components/primary-button';

const HomeScreen = () => {
  const [count = 0, setCount] = useMMKVNumber('smoke-count');
  const handlePress = () => setCount(count + 1);

  return (
    <View className="flex-1 justify-center gap-4 bg-background px-4">
      <Text className="font-heading text-xl uppercase tracking-wide text-ink">Workout Player</Text>
      <Text className="font-body text-sm text-ink-muted">Taps: {count}</Text>
      <PrimaryButton label="Start workout" onPress={handlePress} />
    </View>
  );
};

export default HomeScreen;
