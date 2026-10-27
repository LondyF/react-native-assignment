# Uniwind (free) for styling, with `StyleSheet` as the fallback

Styling uses Uniwind, the free MIT-licensed Tailwind CSS v4 binding for React Native, through `className`. Its SDK 58 support was documented only for the Pro version at decision time, so we verified the free version during setup: `className` styles render on SDK 58 in the development build. If it breaks on a future upgrade, the fallback is `StyleSheet` plus a theme tokens file, which keeps components working because styling is limited to the `className` prop.

## Considered Options

- **NativeWind v5**: its docs mark it as a pre-release not meant for production, tested against SDK 57.
- **Uniwind Pro**: documented SDK 58 support, but commercial and needs a license.
- **Plain `StyleSheet`**: always works, but the project's conventions favour Tailwind utilities.

## Consequences

- The free version does not translate `className` into Reanimated animations. Animated styles (the rest timer ring) use the `style` prop instead.
- Tailwind is configured in CSS (`src/global.css`), not in a `tailwind.config.js`.
