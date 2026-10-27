import '@/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { queryClient } from '@/lib/query-client';

const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <StatusBar style="auto" />
    <Stack screenOptions={{ headerShown: false }} />
  </QueryClientProvider>
);

export default RootLayout;
