# Design system

Colours and fonts taken from [`example-design.png`](example-design.png). The tokens are defined once, in the `@theme` block of [`src/global.css`](../src/global.css); this doc explains when to use each one. Change a value there, never here.

Scope is deliberately small: custom tokens cover colour and font only. Spacing, radius and type sizes use Tailwind's defaults. The app is light only (`userInterfaceStyle: "light"`), so no `dark:` variants.

## Colours

| Token                             | Use                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| `primary`                         | Main actions: Start workout, play/pause, complete set, End workout, Skip rest            |
| `accent`                          | Progress: rest ring, set progress bar, active tab underline, tip icons, completion check |
| `background`                      | Every screen background                                                                  |
| `surface`                         | Cards, bottom sheet, reps/kg inputs                                                      |
| `track`                           | Unfilled part of the ring and progress bar; input borders                                |
| `chip`                            | Target muscle tags                                                                       |
| `border`                          | Card outlines                                                                            |
| `ink`                             | Headings, exercise names, timer digits                                                   |
| `ink-muted`                       | Body copy, "Sets 1 of 2"                                                                 |
| `ink-subtle`                      | Secondary values such as the total duration next to the progress bar                     |
| `scrim`                           | Overlay behind the bottom sheet                                                          |
| `celebrate-from` / `celebrate-to` | Workout complete background gradient                                                     |

Text on `primary` is `text-white`. Use tokens as utilities: `bg-primary`, `text-ink-muted`, `border-track`.

Code that cannot take a `className` (SVG strokes, Reanimated styles) reads the same value with Uniwind's `useCSSVariable('--color-accent')` instead of hard-coding the hex.

## Fonts

Archivo, loaded in [`src/app/_layout.tsx`](../src/app/_layout.tsx) via `@expo-google-fonts/archivo`. React Native does not synthesize weights for custom fonts, so each weight is its own family. Pick the family with `font-heading`, `font-label` or `font-body`; never combine them with `font-bold` and similar weight utilities.

| Token          | Family                | Use                                |
| -------------- | --------------------- | ---------------------------------- |
| `font-heading` | Archivo ExtraBold 800 | Titles, buttons, timer             |
| `font-label`   | Archivo SemiBold 600  | Exercise names, field labels, tabs |
| `font-body`    | Archivo Regular 400   | Everything else                    |

Adding a weight means importing it in `useFonts` and adding a `--font-*` token.

## Text roles

| Role             | Classes                                                   | Example               |
| ---------------- | --------------------------------------------------------- | --------------------- |
| Screen title     | `font-heading text-base uppercase tracking-wide text-ink` | WARM UP, REST         |
| Display title    | `font-heading text-xl uppercase tracking-wide text-ink`   | WORKOUT COMPLETE!     |
| Timer            | `font-heading text-6xl text-ink`                          | 1:30                  |
| Set timer        | `font-heading text-2xl text-ink`                          | 1:13                  |
| Exercise name    | `font-label text-base text-ink`                           | Squats                |
| Button           | `font-heading text-sm uppercase tracking-wide text-white` | START WORKOUT         |
| Tab, field label | `font-label text-xs text-ink`                             | Warm up, Kgs          |
| Body             | `font-body text-sm text-ink-muted`                        | Workout description   |
| Caption          | `font-body text-xs text-ink-muted`                        | Sets 1 of 2, Left Leg |

## Shapes

- Buttons, cards, inputs and chips: `rounded-md`.
- Round controls (play/pause, previous/next, complete set): `rounded-full`.
- Bottom sheet: `rounded-t-xl`.
