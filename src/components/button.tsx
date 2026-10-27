import { Pressable, Text } from 'react-native';

type ButtonProps = {
  label: string;
  onPress: () => void;
};

export const Button = ({ label, onPress }: ButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    onPress={onPress}
    className="items-center rounded-md bg-primary px-6 py-4 active:opacity-80"
  >
    <Text className="font-heading text-sm uppercase tracking-wide text-white">{label}</Text>
  </Pressable>
);
