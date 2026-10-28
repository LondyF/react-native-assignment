import { useEffect, useRef, useState } from 'react';

import { getRemainingMs, type Timer } from '../model/timer';

const TICK_MS = 1000;

const readRemainingMs = (timer: Timer | null): number =>
  timer ? getRemainingMs(timer, Date.now()) : 0;

export const useCountdown = (timer: Timer | null, onElapsed: () => void): number => {
  const [remainingMs, setRemainingMs] = useState(() => readRemainingMs(timer));

  // Lets the interval call the latest onElapsed without listing it as a dependency.
  const onElapsedRef = useRef(onElapsed);

  useEffect(() => {
    onElapsedRef.current = onElapsed;
  });

  useEffect(() => {
    if (timer?.kind !== 'running') return;

    const updateRemaining = () => {
      const remaining = getRemainingMs(timer, Date.now());
      setRemainingMs(remaining);

      if (remaining === 0) {
        clearInterval(intervalId);
        onElapsedRef.current();
      }
    };

    const intervalId = setInterval(updateRemaining, TICK_MS);

    updateRemaining();

    return () => clearInterval(intervalId);
  }, [timer]);

  if (timer?.kind !== 'running') {
    return readRemainingMs(timer);
  }

  return remainingMs;
};
