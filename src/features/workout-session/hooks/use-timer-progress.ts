import { useEffect } from 'react';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

import { getRemainingMs, type Timer } from '../model/timer';

export const useTimerProgress = (timer: Timer | null, totalMs: number) => {
  const remainingFraction = useSharedValue(1);

  useEffect(() => {
    if (!timer || totalMs === 0) return;

    const remainingMs = getRemainingMs(timer, Date.now());
    // Added time can push this past 1, which would make the dash offset negative and empty part of the ring.
    remainingFraction.value = Math.min(1, remainingMs / totalMs);

    if (timer.kind === 'paused' || remainingMs === 0) return;

    remainingFraction.value = withTiming(0, { duration: remainingMs, easing: Easing.linear });
  }, [timer, totalMs, remainingFraction]);

  return remainingFraction;
};
