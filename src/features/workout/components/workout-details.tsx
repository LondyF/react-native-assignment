import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { ErrorState } from '@/components/error-state';
import { Image } from '@/components/image';
import { LoadingState } from '@/components/loading-state';

import { useWorkout } from '../hooks/use-workout';
import { getExercises, getTargetBodyParts } from '../model/workout-summary';

type WorkoutDetailsProps = {
  workoutId: string;
  children?: ReactNode;
};

export const WorkoutDetails = ({ workoutId, children }: WorkoutDetailsProps) => {
  const { data: workout, isPending, refetch } = useWorkout(workoutId);

  if (isPending) {
    return <LoadingState />;
  }

  if (!workout) {
    return <ErrorState message="We could not load this workout." onRetry={refetch} />;
  }

  const exerciseCount = getExercises(workout).length;
  const targets = getTargetBodyParts(workout);

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerClassName="pb-4">
        {workout.pictureUrl ? (
          <Image
            source={{ uri: workout.pictureUrl }}
            accessibilityLabel={workout.name}
            contentFit="cover"
            className="h-72 w-full"
          />
        ) : null}
        <View className="gap-3 px-4 pt-4">
          <Text
            accessibilityRole="header"
            className="font-heading text-xl uppercase tracking-wide text-ink"
          >
            {workout.name}
          </Text>
          <Text className="font-label text-xs text-ink">
            {[workout.level, `${exerciseCount} exercises`].filter(Boolean).join(' · ')}
          </Text>
          {workout.description ? (
            <Text className="font-body text-sm text-ink-muted">{workout.description}</Text>
          ) : null}
          {targets.length > 0 ? (
            <View className="gap-2">
              <Text className="font-label text-xs text-ink">What you&apos;ll target</Text>
              <View className="flex-row flex-wrap gap-2">
                {targets.map((target) => (
                  <View key={target} className="rounded-md bg-chip px-3 py-1">
                    <Text className="font-body text-xs text-ink">{target}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <View className="px-4 pb-4 pt-2">{children}</View>
    </View>
  );
};
