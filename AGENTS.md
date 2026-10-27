# Workout Player

React Native workout player for a take-home assignment: Expo SDK 58, TypeScript, Expo Router. It runs in a development build (`bun run ios`), since MMKV rules out Expo Go ([ADR 0001](docs/adr/0001-sdk-58-development-build.md)).

## Map

- `docs/assignment.md`: the brief and what is evaluated. `docs/example-design.png` is the design.
- `docs/design-system.md`: colour, font and text-role tokens. Read before styling any UI, and style only with its tokens.
- `docs/adr/`: the reasons behind the stack. Read the relevant ADR before changing state, persistence, data fetching, styling or folder layout. Record a hard-to-reverse decision as a new ADR.
- `GLOSSARY.md`: domain vocabulary. Name code with its terms.

## Layout

- `src/app/`: Expo Router routes only. Each route renders a feature component.
- `src/features/<feature>/`: feature code, with tests beside the code they cover ([ADR 0005](docs/adr/0005-feature-folders-with-layered-internals.md)). `workout` is the Contentful workout (server state); `workout-session` is a user's progress through it (local state). Dependencies run one way, from `workout-session` to `workout`.
- Layers inside a feature: `api/` (I/O), `model/` (pure TypeScript with unit tests: schemas, step building, timer maths), `store/` (Zustand), `hooks/` (React bindings), `components/` (UI).
- Each feature's public API is its `index.ts`. Code outside the feature imports it through that, e.g. `@/features/workout`.
- `src/components/`: UI used by two or more features.
- `src/lib/`: shared infrastructure (MMKV storage adapter, query client).
- Imports are relative inside a feature and use the `@/` alias everywhere else.

## Conventions

- Style with Uniwind `className`. Animated styles go in the `style` prop ([ADR 0004](docs/adr/0004-uniwind-with-stylesheet-fallback.md)).
- Zustand stores keep state at the top level and every action in an `actions` map. The store stays private to its feature, which exposes one selector hook per field and a `use<Feature>Actions()` hook. Test actions through `getState()` ([ADR 0002](docs/adr/0002-zustand-store-persisted-to-mmkv.md)).
- Parse every API response with Zod before it reaches the UI ([ADR 0003](docs/adr/0003-plain-fetch-and-zod-over-graphql-client.md)).
- Reach for an installed library or an Expo SDK package before writing your own. Install Expo packages with `bunx expo install` so their versions match SDK 58.

## Done

A task is done when `bun run check` passes.
