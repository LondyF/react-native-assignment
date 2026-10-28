# Workout session plan

The session screen is built in milestones. Each one ends in a commit, and a milestone is done when `bun run check` passes. Tick the boxes as work lands.

Much of the code already exists in `stash@{0}` ("wip: workout-session and misc"). That stash was made before the `Button` rename and the session route, and it has its own versions of `build-steps`, `section-tabs`, `section-progress` and `section-labels`, which `main` has since replaced. Do not `git stash pop` it. Copy files out one by one instead. The workout-session files were untracked when stashed, so they live in the stash's third parent:

```sh
git show 'stash@{0}^3:src/features/workout-session/model/timer.ts'
```

## Milestone 0: sections and current exercise (done)

Commit `d9f58bd`.

- [x] `buildSteps` creates one step per set.
- [x] `SectionTabs` fills each tab by the sets reached in that section. The current set counts, so set 1 of 3 shows one third.
- [x] `CurrentExercise` shows the thumbnail, the name and "Sets X of Y".

## Milestone 1: session model and store

No UI change. Everything here is pure TypeScript or the Zustand store, and is unit tested.

Copy from the stash unchanged:

- [x] `model/step.ts`: the `Step` union of `set`, `timed` and `rest`.
- [x] `model/step-navigation.ts` and test: next and previous exercise, skipping rests.
- [x] `model/timer.ts` and test: `endsAt` while running, `remainingMs` while paused, clamped at zero.
- [x] `model/format-clock.ts` and test.
- [x] `store/session-store.ts` and test: `status`, `workoutId`, `stepIndex` and `timer`, with an `actions` map, persisted to MMKV while active.

Replace with the stash version:

- [x] `model/build-steps.ts` and test: adds a rest step after each set that has rest time, and drops a rest at the very end of the workout.
- [x] `model/__fixtures__/workout.ts`: change `pictureUrl: null` to a URL string so it matches the `Workout` type.

Change:

- [x] `model/section-progress.ts` takes `Step[]` and counts only set and timed steps, so a rest does not change the fill. Update its test with a step list that has rests in it.
- [x] The store's `start(workoutId, steps)` resumes when a session is already active for the same workout, and starts from step 0 for a different one. Add a test for each case.

## Milestone 2: start a session and play through sets

- [x] `hooks/use-start-workout.ts`, exported from the feature's `index.ts`, returns a function that builds the steps from the cached workout and calls `start`. Start workout calls it, then pushes `/session/[id]`. The session starts from that press, not from an effect, so a background refetch cannot restart it.
- [x] `hooks/use-workout-session.ts` (adapted from the stash) takes the workout id from the route. It returns `loading`, `error` or `ready`, and `ready` comes with the actions, already bound to the steps.
  - Keep the stash's guard that ends a session whose stored step index no longer exists in the workout.
- [x] `components/player-controls.tsx` from the stash. Previous is disabled on the first exercise.
- [x] `WorkoutSession` renders the current step:
  - The header title is the section label, or "Rest" during a rest.
  - Section tabs come from `getSectionProgress(steps, stepIndex)`.
  - A set step shows `CurrentExercise` and the controls: Previous, Complete set (calls `next`), and Next (calls `skip`, moving on without resting).
  - A timed step shows `CurrentExercise` with "Complete exercise" as its main button until milestone 5 adds the countdown.
- [x] `CurrentExercise` takes `SetStep | TimedStep` and reads `exerciseName` and `thumbnailUrl` from the step.
- [x] Close still goes back, and the session stays active.

## Milestone 3: rest timer

- [x] Copy from the stash: `components/rest-step.tsx`, `components/rest-ring.tsx` and `hooks/use-countdown.ts`.
- [x] The ring is animated with Reanimated.
- [x] Plus and minus 15 seconds call `adjustRest`. The timer never goes below zero.
- [x] Skip rest calls `next`.
- [x] When the countdown reaches zero, it calls `next`. This also handles reopening the app after the rest has already run out.
- [x] Component test: the plus and minus buttons call `adjustRest` with ±15,000 ms, and Skip rest calls `next`.

## Milestone 4: workout complete

- [x] Completing the last step keeps `workoutId` in the store, so the session route knows which workout finished.
- [x] `useWorkoutSession` returns `completed` when the store's session for this workout has completed.
- [x] Copy `components/workout-complete.tsx` from the stash and change `PrimaryButton` to `Button`. Delete the unused `src/components/primary-button.tsx`.
- [x] `WorkoutSession` shows it full screen, without the header or section tabs, when the session is completed. Done calls `onClose`, which goes back to the workout details. It does not call `end`: the next `start` replaces a completed session.
- [x] Completing a workout clears the persisted session, because only active sessions are persisted.
- [x] Store tests: `next` on the last step completes and keeps `workoutId`, a completed session persists as `initialSession`, and `start` after completing begins at step 0.
- [x] Component test: Done calls `onClose`.

## Milestone 5: timed exercises

The store already has `togglePause` and `pauseTimer`, with tests. This milestone is UI, hooks and wiring.

- [x] `useWorkoutSession`'s `ready` view exposes `togglePause` and `pause` (`pauseTimer`).
- [x] `components/timed-step.tsx`, rendered as `<TimedStep key={stepIndex} />` beside `RestStep`, so `WorkoutSession` switches on rest, timed or set. It takes narrow props (`step`, `timer`, `canGoPrevious`, `onNext`, `onSkip`, `onPrevious`, `onTogglePause`, `onPause`), not the whole session. It renders `CurrentExercise`, `TimedProgress` and `PlayerControls`.
- [x] `TimedProgress` (based on the stash's `exercise-step.tsx`) shows the remaining clock, the total, and a progress bar. The clock ticks through `useCountdown`. The bar fills smoothly with Reanimated, using `scaleX` in the `style` prop.
- [x] `hooks/use-timer-progress.ts` returns a shared value with the remaining fraction: it snaps on every `timer` change and runs `withTiming` to 0 while running. `RestRing` and `TimedProgress` both use it, and the bar shows `1 - value`.
- [x] The main button is pause/resume (`togglePause`), labelled "Pause exercise" or "Resume exercise" with a `pause.fill` or `play.fill` icon.
- [x] Next calls `skip` on timed steps, like on sets, so skipping a timed exercise also skips its rest. Note this as a known limitation in the README.
- [x] When the countdown reaches zero, it calls `next`, which goes into the rest.
- [x] `hooks/use-pause-on-background.ts` takes an `onBackground` callback (kept in a latest ref, like `useCountdown`) and calls it only on `'background'`, not `'inactive'`, so Control Center does not pause a plank. `TimedStep` calls it with `onPause`, so rests are never paused. Coming back to the foreground does not resume: the user taps resume.
- [x] `timed-step.test.tsx`: shows the clock and total; the main button label follows the timer kind and calls `onTogglePause`; Next calls `onSkip` and Previous calls `onPrevious`; with fake timers, passing the duration calls `onNext` once.
- [x] `use-pause-on-background.test.ts`: `'background'` calls the callback, `'inactive'` does not, and unmounting removes the listener.
- [x] No test for `use-timer-progress`, because Reanimated is mocked. Check the bar on the simulator instead.

## Milestone 6: resume on launch

The store hydrates synchronously from MMKV, so the first render already knows whether a session is active. Only active sessions are persisted, so on launch the status is `active` or `idle`, never `completed`.

- [ ] `hooks/use-active-session-workout-id.ts`, exported from the feature's `index.ts`, returns the session's `workoutId` while its status is `active`, and `null` otherwise. The store stays private.
- [ ] The root layout runs a one-shot effect once the fonts are loaded and the Stack is mounted. When a session is active, it pushes `/workout/[id]` and then `/session/[id]`, so the stack matches a normal session and Close and Done land on the details screen. It runs once per cold launch, so coming back from the background or closing a session does not trigger it again.
- [ ] `WorkoutDetails` takes an `isInProgress` boolean and labels its button "Resume workout" or "Start workout". The details screen sets it from `useActiveSessionWorkoutId() === id`, because the `workout` feature cannot import `workout-session`.
- [ ] When a different workout is in progress, Start first asks with `Alert.alert`: "You have a workout in progress. Starting this one ends it.", with Cancel and Start. The store's `start` already replaces the session, so it does not change.
- [ ] `useWorkoutSession` returns `inactive` when the store has no active or completed session for this workout. This covers a session the stale guard ended and a `/session/[id]` deep link with no session behind it. Without it, the screen shows a spinner forever.
- [ ] `WorkoutSession` shows `inactive` as an `ErrorState`: "Your progress on this workout could not be restored.", with a "Back to workout" button that calls `onClose`.
- [ ] `ErrorState` takes an optional `actionLabel`, defaulting to "Try again".
- [ ] `use-workout-session.test.ts`, with `useWorkout` mocked to return the fixture workout: `inactive` with no session, `inactive` after the stale guard ends a session, and `ready` at the stored step when the store was seeded mid-workout.
- [ ] `workout-details.test.tsx`: `isInProgress` switches the label between "Start workout" and "Resume workout".
- [ ] Check by hand on the simulator: the launch redirect, the confirmation Alert, closing mid-set, closing during a rest, and reopening after the rest would have ended.

## Milestone 7: set inputs and ending early

Start after milestone 6 is ticked.

Set inputs:

- [x] `components/set-step.tsx`, rendered as `<SetStep key={stepIndex} />` beside `TimedStep`, renders `CurrentExercise`, the Kgs and Reps fields (based on `SetFields` and `NumberField` in the stash's `exercise-step.tsx`) and `PlayerControls`. The key resets the fields for each set.
- [x] Kgs and Reps live in `useState` only. They are not stored or persisted. Note this as a known limitation in the README, with the fix: a `setLogs` map in the store, keyed by step index and written by `next`.
- [x] Kgs uses `decimal-pad`, starts empty and shows a `0` placeholder. Reps uses `number-pad` and starts at the planned reps.
- [x] The fields strip characters that are not numbers: Reps keeps digits only, Kgs keeps digits and decimal separators. This covers paste and hardware keyboards.
- [x] Tapping outside the fields calls `Keyboard.dismiss`. A `KeyboardAvoidingView` (`padding` on iOS) keeps the controls above the keyboard.
- [x] `set-step.test.tsx`: Reps starts at the planned reps, typing `12a` leaves `12`, and Complete set calls `onNext`.

Store:

- [x] Add `'ended'` to the status. `end()` sets `{ ...initialSession, status: 'ended', workoutId }`, so the session screen knows the user stopped this workout. Only active sessions are persisted, so `ended` never reaches MMKV.
- [x] New `reset()` sets `initialSession`. The stale guard in `useWorkoutSession` calls `reset` instead of `end`, so it still shows the `inactive` error.
- [x] `useWorkoutSession` returns `ended` for an ended session of this workout. `WorkoutSession` renders a plain `bg-background` view for it, so nothing flashes while the screens dismiss.
- [x] Store tests: `end` sets `ended` and keeps `workoutId`, an ended session persists as `initialSession`, `reset` sets `initialSession`, and `start` after `end` begins at step 0.

Stop sheet:

- [x] Move `src/app/session/[id].tsx` to `session/[id]/index.tsx` and add `session/[id]/stop.tsx`. Register the sheet in the root `Stack` with `presentation: 'formSheet'`, `sheetAllowedDetents: 'fitToContents'`, `sheetGrabberVisible: true` and `headerShown: false`.
- [x] `model/stop-reasons.ts`: a `STOP_REASONS` tuple (Too Hard, Too Easy, Run out of time, Busy Equipment, Did not enjoy this workout, Other) and a `StopReason` type.
- [x] `components/stop-session-sheet.tsx`, exported from the feature's `index.ts`: "What stopped you?", a close button, the reasons as a radio group (`radiogroup`, and `radio` rows with `checked` state), End workout and Continue later. The selected reason is `useState<StopReason | null>(null)`. End workout is disabled until a reason is picked. The reason is not stored. Note this in the README.
- [x] `src/screens/stop-session-screen.tsx` uses `useWorkoutSessionActions`. End workout calls `end()` and then `router.dismissTo` the workout details. Continue later only calls `dismissTo`, so the session stays active. The close button and swipe-down call `router.back()`, back to the session.
- [x] `WorkoutSession`'s header close calls a new `onRequestStop`, which pushes `/session/[id]/stop`. On a timed step it calls `pause` first. Rests keep running, as they do when the app goes to the background. Done on `WorkoutComplete` and "Back to workout" on the `inactive` error still call `onClose`.
- [x] Note Continue later in the README as a deviation from the design, kept so a session can be left and resumed without closing the app.
- [x] `stop-session-sheet.test.tsx`: End workout is disabled at first, enabled after picking a reason, and calls `onEnd`. Continue later calls `onContinueLater`.
- [x] Check by hand on the simulator: the sheet fits its content, a timed step is paused after the sheet closes, End workout lands on details showing "Start workout" without an error flash, and Continue later lands on details showing "Resume workout".

## Milestone 8: submission

- [ ] README: setup, structure, server state, local state, persistence, trade-offs and known limitations.
- [ ] AI usage section: what it was used for and what it got wrong.
- [ ] List anything left unfinished and how it would be done.
