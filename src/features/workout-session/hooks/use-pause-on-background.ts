import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export const usePauseOnBackground = (onBackground: () => void) => {
  // Lets the listener call the latest callback without resubscribing.
  const onBackgroundRef = useRef(onBackground);

  useEffect(() => {
    onBackgroundRef.current = onBackground;
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background') onBackgroundRef.current();
    });

    return () => subscription.remove();
  }, []);
};
