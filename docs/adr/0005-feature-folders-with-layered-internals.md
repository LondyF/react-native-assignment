# Feature folders with layered internals and a public API per feature

Code is grouped by feature under `src/features/`, and there are two features. `workout` is what a workout is: the Contentful fetch, the Zod schema, the domain types and the details screen. `workout-session` is a user's progress through it: the Zustand store, the player, the rest timer and completion. Dependencies go one way: `workout-session` imports `workout`, never the reverse. This is also the server-state vs local-state line from [ADR 0002](0002-zustand-store-persisted-to-mmkv.md) and [ADR 0003](0003-plain-fetch-and-zod-over-graphql-client.md).

Inside a feature, files are grouped by layer:

- `api/`: I/O only (fetch).
- `model/`: pure TypeScript, no React imports (schemas, types, step building, timer maths), so the workout flow is testable without rendering.
- `store/`: Zustand stores and their selector hooks.
- `hooks/`: React bindings that join the layers.
- `components/`: UI.

Each feature has an `index.ts` that exports its public surface. An ESLint `no-restricted-imports` rule blocks `@/features/<feature>/<anything>` from outside the feature, so the one-way dependency is enforced by tooling. Inside a feature, files use relative imports. Routes in `src/app/` only render a feature component.

## Considered Options

- **One `workout` feature**: fewest folders, but mixes server and local state, which the brief evaluates separately.
- **One feature per screen** (details, player, rest timer, complete): mirrors the design, but the rest timer is a step of the same session state machine, so the logic would be spread across features.
- **Flat feature folders or no barrels**: less ceremony, but the layer boundaries and the public API would only be convention.

## Consequences

- A barrel is one more file to keep in sync with each feature's public surface.
- Some layer folders hold one or two files for now. That is accepted so that new code has an obvious place.
- A component moves to `src/components/` only once a second feature uses it.
