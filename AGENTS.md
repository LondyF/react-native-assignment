# Workout Player

React Native workout player for a take-home assignment: Expo SDK 58, TypeScript, Expo Router.

## Map

- `docs/assignment.md`: the brief, the requirements and what is evaluated. `docs/example-design.png` is the design.
- `docs/adr/`: why the stack is what it is. Read the relevant ADR before changing state, persistence, data fetching or styling.
- `GLOSSARY.md`: domain vocabulary. Use its terms in code and names.
- `docs/ai-usage.md`: log of AI-assisted work, required by the brief. Append an entry after AI-assisted work, creating the file if it is missing.

## Verify

`bun run check` runs lint, Prettier, `tsc` and tests. Run it before declaring any task done.

## Layout

- `src/app/`: Expo Router routes only. Components, hooks and logic live elsewhere.
- `src/lib/`: shared infrastructure (MMKV storage adapter, query client).
- Feature code goes in `src/features/<feature>/`, with tests beside the code they cover.
- Import with the `@/` alias for `src/`.

## Conventions

- Style with Uniwind `className`. Animated styles use the `style` prop ([ADR 0004](docs/adr/0004-uniwind-with-stylesheet-fallback.md)).
- Keep workout logic in a pure reducer with unit tests. The Zustand store only wraps it ([ADR 0002](docs/adr/0002-reducer-in-zustand-persisted-to-mmkv.md)).
- Validate everything from the API with Zod before it reaches the UI ([ADR 0003](docs/adr/0003-plain-fetch-and-zod-over-graphql-client.md)).
- Record hard-to-reverse decisions as a new ADR in `docs/adr/`.

## Rules

- Prefer expo packages over custom libraries
- Don't reinvent the wheel
