import '@/global.css';

import {
  Archivo_400Regular,
  Archivo_600SemiBold,
  Archivo_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/archivo';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useCSSVariable } from 'uniwind';

import { HeaderTitle } from '@/components/header-title';
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

  useEffect(() => {
    if (!isReady) return;
    SplashScreen.hideAsync();
  }, [isReady]);

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
          name="session/[id]"
          options={{ presentation: 'fullScreenModal', headerShown: false }}
        />
      </Stack>
    </QueryClientProvider>
  );
};

export default RootLayout;
