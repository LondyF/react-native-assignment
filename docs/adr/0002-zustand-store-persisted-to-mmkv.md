# Workout session is a plain Zustand store with an actions map, persisted to MMKV

Local workout progress lives in one Zustand 5 store wrapped with the `persist` middleware. State fields sit at the top level and every action lives in an `actions` map. The store itself is private to its module: components read state through one selector hook per field (`useSessionStepIndex`) and get every action from `useWorkoutSessionActions()`. The persisted storage is `react-native-mmkv` v4 behind `src/lib/storage.ts`. MMKV reads synchronously, so the store is restored before the first frame and no loading gate is needed, which makes "reopen and resume" the default behaviour instead of a special case.

Only `active` sessions are persisted, and the timer is stored as an `endsAt` wall-clock timestamp, so a rest that was running when the app closed is still correct when it reopens.

## Considered Options

- **A pure reducer wrapped by the store**: testable without React, but `dispatch` adds an indirection layer on top of a store whose actions are already plain functions that can be tested through `getState()`.
- **Persisting a snapshot of the steps inside the session**: the player would never wait on the network, but the store would keep its own copy of data that TanStack Query already owns. The trade-off we accept is that resuming needs the network.
- **`useReducer` + Context with a hand-written persistence effect**: no dependency, but we would reimplement hydration, versioning and selectors that `persist` already provides.
- **XState v5 with snapshot persistence**: a good fit for the step flow, but heavier than the scope justifies and harder to read at a glance in a 4-hour assignment.
- **`expo-sqlite/kv-store` or AsyncStorage**: async, so the app must render something before the persisted state arrives and then correct itself.

## Consequences

- Server data (the workout definition) never goes into this store. It stays in TanStack Query, see [ADR 0003](0003-plain-fetch-and-zod-over-graphql-client.md). Actions that need the step list take `steps` as an argument, and `useWorkoutSession()` binds it.
- Store tests call `sessionStore.getState().actions.next(steps)` directly and use `jest.useFakeTimers()` to control `Date.now()`.
- MMKV requires a development build, see [ADR 0001](0001-sdk-58-development-build.md).
- Tests mock MMKV in `jest.setup.ts`.
