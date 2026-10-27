import { Text } from 'react-native';

type HeaderTitleProps = {
  children: string;
};

export const HeaderTitle = ({ children }: HeaderTitleProps) => (
  <Text
    accessibilityRole="header"
    numberOfLines={1}
    className="font-heading text-base uppercase tracking-wide text-ink"
  >
    {children}
  </Text>
);
