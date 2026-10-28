# Workout Player

## Known limitations

- Next on a timed exercise skips its rest as well, like Next on a set. Only completing the exercise (or letting the countdown run out) goes into the rest.
- Kgs and Reps are local component state. They are not stored or persisted, so they reset when the set changes or the app restarts. The fix is a `setLogs` map in the session store, keyed by step index and written by `next`.
- The stop reason is not stored. End workout only requires one to be picked.
- The stop sheet has a "Continue later" action that the design does not show. It leaves the session active, so a workout can be left and resumed without closing the app.
