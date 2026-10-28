import { Pressable, Text } from 'react-native';

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export const Button = ({ label, onPress, disabled = false }: ButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ disabled }}
    disabled={disabled}
    onPress={onPress}
    className="items-center rounded-md bg-primary px-6 py-4 active:opacity-80 disabled:opacity-40"
  >
    <Text className="font-heading text-sm uppercase tracking-wide text-white">{label}</Text>
  </Pressable>
);
