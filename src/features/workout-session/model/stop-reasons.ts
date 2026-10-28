export const STOP_REASONS = [
  'Too Hard',
  'Too Easy',
  'Run out of time',
  'Busy Equipment',
  'Did not enjoy this workout',
  'Other',
] as const;

export type StopReason = (typeof STOP_REASONS)[number];
