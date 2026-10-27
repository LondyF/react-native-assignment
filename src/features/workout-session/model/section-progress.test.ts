import type { Exercise, SectionKey } from '@/features/workout';

import type { ExerciseStep } from './build-steps';
import { getSectionProgress } from './section-progress';

const exercise: Exercise = {
  id: 'squat',
  name: 'Squat',
  thumbnailUrl: 'https://example.com/squat.jpg',
  bodyParts: [],
  kind: 'timed',
  durationSeconds: 30,
};

const createSteps = (sectionKey: SectionKey, setCount: number): ExerciseStep[] =>
  Array.from({ length: setCount }, (_, index) => ({
    sectionKey,
    exercise,
    setNumber: index + 1,
    setCount,
  }));

const steps = [...createSteps('warmUp', 3), ...createSteps('powerSet', 4)];

describe('getSectionProgress', () => {
  it('counts the current set as reached', () => {
    expect(getSectionProgress(steps, 0)).toEqual([
      { sectionKey: 'warmUp', progress: 1 / 3 },
      { sectionKey: 'powerSet', progress: 0 },
    ]);
  });

  it('fills earlier sections and part of the current one', () => {
    expect(getSectionProgress(steps, 4)).toEqual([
      { sectionKey: 'warmUp', progress: 1 },
      { sectionKey: 'powerSet', progress: 2 / 4 },
    ]);
  });

  it('leaves out sections without steps', () => {
    expect(getSectionProgress(createSteps('coolDown', 1), 0)).toEqual([
      { sectionKey: 'coolDown', progress: 1 },
    ]);
  });
});
