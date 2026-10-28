import '@/global.css';

import {
  Archivo_400Regular,
  Archivo_600SemiBold,
  Archivo_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/archivo';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRootNavigationState, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { useCSSVariable } from 'uniwind';

import { HeaderTitle } from '@/components/header-title';
import { useActiveSessionWorkoutId } from '@/features/workout-session';
import { queryClient } from '@/lib/query-client';

if (__DEV__) {
  // Dev-only side effect. A static import would ship Reactotron in release builds.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@/lib/reactotron');
}

export const unstable_settings = { anchor: '(main)' };

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    Archivo_400Regular,
    Archivo_600SemiBold,
    Archivo_800ExtraBold,
  });
  const background = useCSSVariable('--color-background');
  const ink = useCSSVariable('--color-ink');
  const surface = useCSSVariable('--color-surface');

  const isReady = fontsLoaded || fontError !== null;

  const router = useRouter();
  const isNavigationReady = useRootNavigationState()?.key !== undefined;
  const activeWorkoutId = useActiveSessionWorkoutId();
  const hasResumedRef = useRef(false);

  useEffect(() => {
    if (!isReady) return;
    SplashScreen.hideAsync();
  }, [isReady]);

  useEffect(() => {
    if (!isReady || !isNavigationReady || hasResumedRef.current) return;

    hasResumedRef.current = true;

    if (activeWorkoutId === null) return;

    // Active workout, so push the workout detail screen, so user can resume it.
    router.push({
      pathname: '/workout/[id]',
      params: { id: activeWorkoutId },
    });
  }, [isReady, isNavigationReady, activeWorkoutId, router]);

  if (!isReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: String(background) },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: String(ink),
        }}
      >
        <Stack.Screen
          name="(main)"
          options={{
            headerBackVisible: false,
            headerTitle: () => <HeaderTitle>Workouts</HeaderTitle>,
          }}
        />
        <Stack.Screen
          name="(detail)"
          options={{
            headerTransparent: true,
            headerStyle: { backgroundColor: 'transparent' },
            headerTitle: '',
            headerTintColor: String(surface),
          }}
        />
        <Stack.Screen
          name="session/[id]/index"
          options={{ presentation: 'fullScreenModal', headerShown: false }}
        />
        <Stack.Screen
          name="session/[id]/stop"
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: 'fitToContents',
            sheetGrabberVisible: true,
            headerShown: false,
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
};

export default RootLayout;
