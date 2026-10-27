import { Pressable, Text, View } from 'react-native';
import { useMMKVNumber } from 'react-native-mmkv';

const HomeScreen = () => {
  const [count = 0, setCount] = useMMKVNumber('smoke-count');
  const handlePress = () => setCount(count + 1);

  return (
    <View className="flex-1 items-center justify-center bg-[#FBF6EE]">
      <Text className="text-2xl font-bold text-[#5B2DB0]">Workout Player</Text>
      <Pressable onPress={handlePress} accessibilityRole="button" accessibilityLabel="increment">
        <Text className="mt-4 text-lg text-[#5B2DB0]">taps: {count}</Text>
      </Pressable>
    </View>
  );
};

export default HomeScreen;
