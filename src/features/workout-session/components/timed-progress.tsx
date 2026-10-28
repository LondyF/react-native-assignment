import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { useCountdown } from '../hooks/use-countdown';
import { useTimerProgress } from '../hooks/use-timer-progress';
import { formatClock } from '../model/format-clock';
import type { Timer } from '../model/timer';

type TimedProgressProps = {
  timer: Timer | null;
  totalMs: number;
  onElapsed: () => void;
};

export const TimedProgress = ({ timer, totalMs, onElapsed }: TimedProgressProps) => {
  const remainingMs = useCountdown(timer, onElapsed);
  const remainingFraction = useTimerProgress(timer, totalMs);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: 1 - remainingFraction.value }],
  }));

  return (
    <View className="gap-2">
      <View className="flex-row items-end justify-between">
        <Text
          accessibilityRole="timer"
          accessibilityLabel={`${formatClock(remainingMs)} remaining`}
          className="font-heading text-2xl text-ink"
        >
          {formatClock(remainingMs)}
        </Text>
        <Text className="font-body text-xs text-ink-subtle">{formatClock(totalMs)}</Text>
      </View>
      <View className="h-1 overflow-hidden rounded-full bg-track">
        <Animated.View
          className="h-full w-full bg-accent"
          style={[{ transformOrigin: 'left' }, barStyle]}
        />
      </View>
    </View>
  );
};
