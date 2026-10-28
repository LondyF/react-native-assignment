import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useCSSVariable } from 'uniwind';

import { getRemainingMs, type Timer } from '../model/timer';

const SIZE = 220;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const RING_LENGTH = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type RestRingProps = {
  timer: Timer;
  totalMs: number;
  children: ReactNode;
};

export const RestRing = ({ timer, totalMs, children }: RestRingProps) => {
  const accent = useCSSVariable('--color-accent');
  const track = useCSSVariable('--color-track');

  const remainingFraction = useSharedValue(1);

  useEffect(() => {
    const remainingMs = getRemainingMs(timer, Date.now());
    // Added time can push this past 1, which would make the dash offset negative and empty part of the ring.
    remainingFraction.value = Math.min(1, remainingMs / totalMs);

    if (timer.kind === 'paused' || remainingMs === 0) return;

    remainingFraction.value = withTiming(0, { duration: remainingMs, easing: Easing.linear });
  }, [timer, totalMs, remainingFraction]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: RING_LENGTH * (1 - remainingFraction.value),
  }));

  return (
    <View className="items-center justify-center self-center" style={{ width: SIZE, height: SIZE }}>
      <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={typeof track === 'string' ? track : undefined}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={typeof accent === 'string' ? accent : undefined}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={RING_LENGTH}
          rotation={-90}
          originX={SIZE / 2}
          originY={SIZE / 2}
          fill="none"
          animatedProps={animatedProps}
        />
      </Svg>
      {children}
    </View>
  );
};
