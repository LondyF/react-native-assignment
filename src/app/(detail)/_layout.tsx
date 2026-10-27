import { Slot } from 'expo-router';

import { SafeAreaView } from '@/components/safe-area-view';

const DetailLayout = () => (
  <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
    <Slot />
  </SafeAreaView>
);

export default DetailLayout;
