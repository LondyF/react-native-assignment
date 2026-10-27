import type { SectionKey } from '@/features/workout';

import type { SetStep, Step } from './step';
import { getSectionProgress } from './section-progress';

const createSetsWithRests = (sectionKey: SectionKey, setCount: number): Step[] =>
  Array.from({ length: setCount }, (_, index): Step[] => {
    const setStep: SetStep = {
      kind: 'set',
      sectionKey,
      exerciseId: 'squat',
      exerciseName: 'Squat',
      thumbnailUrl: 'https://example.com/squat.jpg',
      setNumber: index + 1,
      setCount,
      reps: 10,
    };
    return [setStep, { kind: 'rest', sectionKey, durationSeconds: 30 }];
  }).flat();

const steps = [...createSetsWithRests('warmUp', 3), ...createSetsWithRests('powerSet', 4)];

describe('getSectionProgress', () => {
  it('counts the current set as reached', () => {
    expect(getSectionProgress(steps, 0)).toEqual([
      { sectionKey: 'warmUp', progress: 1 / 3 },
      { sectionKey: 'powerSet', progress: 0 },
    ]);
  });

  it('does not change the fill during a rest', () => {
    expect(getSectionProgress(steps, 1)).toEqual(getSectionProgress(steps, 0));
  });

  it('fills earlier sections and part of the current one', () => {
    expect(getSectionProgress(steps, 8)).toEqual([
      { sectionKey: 'warmUp', progress: 1 },
      { sectionKey: 'powerSet', progress: 2 / 4 },
    ]);
  });

  it('leaves out sections without steps', () => {
    expect(getSectionProgress(createSetsWithRests('coolDown', 1), 0)).toEqual([
      { sectionKey: 'coolDown', progress: 1 },
    ]);
  });
});
