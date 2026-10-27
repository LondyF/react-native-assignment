import { Slot } from 'expo-router';
import { View } from 'react-native';

const MainLayout = () => (
  <View className="flex-1 bg-background">
    <Slot />
  </View>
);

export default MainLayout;
