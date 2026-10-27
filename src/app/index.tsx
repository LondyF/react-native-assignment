import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { WorkoutList } from '@/features/workout';

const HomeScreen = () => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const handleSelectWorkout = (workoutId: string) =>
    router.push({ pathname: '/workout/[id]', params: { id: workoutId } });

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: top }}>
      <WorkoutList onSelectWorkout={handleSelectWorkout} />
    </View>
  );
};

export default HomeScreen;
