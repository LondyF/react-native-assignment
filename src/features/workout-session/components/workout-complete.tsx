import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useCSSVariable } from 'uniwind';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';

type WorkoutCompleteProps = {
  onDone: () => void;
};

export const WorkoutComplete = ({ onDone }: WorkoutCompleteProps) => {
  const from = useCSSVariable('--color-celebrate-from');
  const to = useCSSVariable('--color-celebrate-to');

  return (
    <View className="flex-1 items-center justify-center gap-4 px-8">
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="celebrate" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={typeof from === 'string' ? from : undefined} />
            <Stop offset="1" stopColor={typeof to === 'string' ? to : undefined} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#celebrate)" />
      </Svg>
      <Icon name="checkmark.circle" tone="accent" size={96} />
      <View className="items-center gap-1">
        <Text
          accessibilityRole="header"
          className="text-center font-heading text-xl uppercase tracking-wide text-ink"
        >
          Workout complete!
        </Text>
        <Text className="font-body text-sm text-ink-muted">Well done!</Text>
      </View>
      <View className="self-stretch pt-4">
        <Button label="Done" onPress={onDone} />
      </View>
    </View>
  );
};
