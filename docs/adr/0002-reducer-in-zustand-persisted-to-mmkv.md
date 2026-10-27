# Workout state is a pure reducer inside a Zustand store, persisted to MMKV

Local workout progress lives in a framework-free reducer (unit-tested without React) that a Zustand 5 store wraps with the `persist` middleware. The persisted storage is `react-native-mmkv` v4 behind `src/lib/storage.ts`. MMKV reads synchronously, so the store is restored before the first frame and no loading gate is needed, which makes "reopen and resume" the default behaviour instead of a special case.

## Considered Options

- **`useReducer` + Context with a hand-written persistence effect**: no dependency, but we would reimplement hydration, versioning and selectors that `persist` already provides.
- **XState v5 with snapshot persistence**: a good fit for the step flow, but heavier than the scope justifies and harder to read at a glance in a 4-hour assignment.
- **`expo-sqlite/kv-store` or AsyncStorage**: async, so the app must render something before the persisted state arrives and then correct itself.

## Consequences

- Server data (the workout definition) never goes into this store. It stays in TanStack Query, see [ADR 0003](0003-plain-fetch-and-zod-over-graphql-client.md).
- MMKV requires a development build, see [ADR 0001](0001-sdk-58-development-build.md).
- Tests mock MMKV in `jest.setup.ts`.
