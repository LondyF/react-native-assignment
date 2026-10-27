import { Text, View } from 'react-native';

import { Image } from '@/components/image';

import type { SetStep, TimedStep } from '../model/step';

type CurrentExerciseProps = {
  step: SetStep | TimedStep;
};

export const CurrentExercise = ({ step }: CurrentExerciseProps) => (
  <View className="gap-3">
    <Image
      source={{ uri: step.thumbnailUrl }}
      accessibilityLabel={step.exerciseName}
      contentFit="cover"
      className="aspect-[4/3] w-full rounded-md"
    />
    <View className="gap-1">
      <Text accessibilityRole="header" className="font-label text-base text-ink">
        {step.exerciseName}
      </Text>
      {step.kind === 'set' ? (
        <Text className="font-body text-xs text-ink-muted">
          Sets {step.setNumber} of {step.setCount}
        </Text>
      ) : null}
    </View>
  </View>
);
