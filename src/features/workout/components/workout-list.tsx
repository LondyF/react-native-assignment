import { FlatList, Pressable, Text, View } from 'react-native';

import { ErrorState } from '@/components/error-state';
import { Image } from '@/components/image';
import { LoadingState } from '@/components/loading-state';

import { useWorkouts } from '../hooks/use-workouts';
import type { Workout } from '../model/workout';
import { getExercises } from '../model/workout-summary';

type WorkoutListProps = {
  onSelectWorkout: (workoutId: string) => void;
};

export const WorkoutList = ({ onSelectWorkout }: WorkoutListProps) => {
  const { data: workouts, isPending, refetch } = useWorkouts();

  if (isPending) {
    return <LoadingState />;
  }

  if (!workouts) {
    return <ErrorState message="We could not load the workouts." onRetry={refetch} />;
  }

  const renderWorkout = ({ item }: { item: Workout }) => {
    const handlePress = () => onSelectWorkout(item.id);

    const summary = [item.level, `${getExercises(item).length} exercises`]
      .filter(Boolean)
      .join(' · ');

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, ${summary}`}
        onPress={handlePress}
        className="flex-row items-center gap-3"
      >
        {item.pictureUrl ? (
          <Image
            source={{ uri: item.pictureUrl }}
            accessibilityLabel={item.name}
            contentFit="cover"
            className="h-16 w-16 rounded-md"
          />
        ) : null}
        <View className="flex-1 gap-1">
          <Text className="font-heading text-sm uppercase tracking-wide text-ink">{item.name}</Text>
          <Text className="font-label text-xs text-ink-muted">{summary}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={workouts}
      keyExtractor={(workout) => workout.id}
      renderItem={renderWorkout}
      contentContainerClassName="gap-4 p-4"
      className="flex-1 bg-background"
    />
  );
};
