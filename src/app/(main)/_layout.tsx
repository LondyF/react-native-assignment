import { Slot } from 'expo-router';

import { SafeAreaView } from '@/components/safe-area-view';

const MainLayout = () => (
  <SafeAreaView edges={['top']} className="flex-1 bg-background">
    <Slot />
  </SafeAreaView>
);

export default MainLayout;
