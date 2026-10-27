import { z } from 'zod';

import { SECTION_KEYS, type Exercise, type Workout } from './workout';

const THUMBNAIL_BASE_URL = 'https://static.cdn.vixyvideo.com/p/380/thumbnail/entry_id';

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;

const durationSchema = z
  .union([z.number(), z.tuple([z.number(), z.number(), z.number()])])
  .nullish()
  .transform((duration) => {
    if (duration === null || duration === undefined) return 0;
    if (typeof duration === 'number') return duration;
    const [hours, minutes, seconds] = duration;
    return hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE + seconds;
  });

const restSchema = z.coerce.number().catch(0);

const exerciseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    vixyVideo: z.string(),
    durationBased: z.boolean(),
    duration: durationSchema,
    reps: z.array(z.coerce.number()),
    rest: z.array(restSchema),
    bodyPartsIndex: z.array(z.string()).nullish(),
  })
  .transform((raw): Exercise => {
    const base = {
      id: raw.id,
      name: raw.name,
      thumbnailUrl: `${THUMBNAIL_BASE_URL}/${raw.vixyVideo}`,
      bodyParts: raw.bodyPartsIndex ?? [],
    };
    if (raw.durationBased) return { ...base, kind: 'timed', durationSeconds: raw.duration };
    return {
      ...base,
      kind: 'reps',
      sets: raw.reps.map((reps, index) => ({ reps, restSeconds: raw.rest[index] ?? 0 })),
    };
  });

const exerciseListSchema = z.array(exerciseSchema).nullish();

export const workoutSchema = z
  .object({
    sys: z.object({ id: z.string() }),
    name: z.string(),
    description: z.string().nullish(),
    levelIndex: z.array(z.string()).nullish(),
    picture: z.object({ url: z.string() }).nullish(),
    warmUp: exerciseListSchema,
    powerSet: exerciseListSchema,
    coolDown: exerciseListSchema,
  })
  .transform((raw): Workout => ({
    id: raw.sys.id,
    name: raw.name,
    description: raw.description ?? null,
    level: raw.levelIndex?.[0] ?? null,
    pictureUrl: raw.picture?.url ?? null,
    sections: SECTION_KEYS.map((key) => ({ key, exercises: raw[key] ?? [] })),
  }));

const playableWorkoutListSchema = z.array(z.unknown()).transform((items) =>
  items.flatMap((item) => {
    const result = workoutSchema.safeParse(item);
    return result.success ? [result.data] : [];
  }),
);

export const workoutListResponseSchema = z.object({
  data: z.object({
    workoutCollection: z.object({ items: playableWorkoutListSchema }),
  }),
});

export const workoutResponseSchema = z.object({
  data: z.object({
    workoutCollection: z.object({ items: z.array(workoutSchema) }),
  }),
});
