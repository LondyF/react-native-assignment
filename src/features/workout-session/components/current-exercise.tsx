import { Text, View } from 'react-native';

import { Image } from '@/components/image';

import type { ExerciseStep } from '../model/build-steps';

type CurrentExerciseProps = {
  step: ExerciseStep;
};

export const CurrentExercise = ({ step }: CurrentExerciseProps) => {
  const { exercise, setNumber, setCount } = step;

  return (
    <View className="gap-3">
      <Image
        source={{ uri: exercise.thumbnailUrl }}
        accessibilityLabel={exercise.name}
        contentFit="cover"
        className="aspect-[4/3] w-full rounded-md"
      />
      <View className="gap-1">
        <Text accessibilityRole="header" className="font-label text-base text-ink">
          {exercise.name}
        </Text>
        {exercise.kind === 'reps' ? (
          <Text className="font-body text-xs text-ink-muted">
            Sets {setNumber} of {setCount}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
