import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useCSSVariable } from 'uniwind';

const TONE_VARIABLES = {
  ink: '--color-ink',
  primary: '--color-primary',
  accent: '--color-accent',
  onPrimary: '--color-surface',
} as const;

type IconProps = {
  name: SymbolViewProps['name'];
  tone: keyof typeof TONE_VARIABLES;
  size?: number;
};

export const Icon = ({ name, tone, size = 20 }: IconProps) => {
  const color = useCSSVariable(TONE_VARIABLES[tone]);

  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={typeof color === 'string' ? color : undefined}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
};
