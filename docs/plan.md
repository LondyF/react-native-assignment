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

- [ ] When the app opens with an active session, go straight to `/session/[workoutId]`.
- [ ] The details screen shows "Resume workout" while this workout's session is active.
- [ ] Test the edge cases from the brief by hand: close mid-set, close during a rest, and reopen after the rest would have ended.

## Milestone 7: set inputs and ending early

- [ ] Kgs and Reps fields on a set step (`SetFields` in the stash's `exercise-step.tsx`), starting with the planned reps.
- [ ] The close button opens the "What stopped you?" bottom sheet. End workout calls `end` and goes back.

## Milestone 8: submission

- [ ] README: setup, structure, server state, local state, persistence, trade-offs and known limitations.
- [ ] AI usage section: what it was used for and what it got wrong.
- [ ] List anything left unfinished and how it would be done.
