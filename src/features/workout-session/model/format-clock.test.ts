import { formatClock } from './format-clock';

describe('formatClock', () => {
  it('formats minutes and zero-padded seconds', () => {
    expect(formatClock(90_000)).toBe('1:30');
    expect(formatClock(5_000)).toBe('0:05');
  });

  it('rounds partial seconds up so the clock reaches 0:00 only at zero', () => {
    expect(formatClock(1)).toBe('0:01');
    expect(formatClock(29_001)).toBe('0:30');
  });

  it('shows zero for zero or negative time', () => {
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(-500)).toBe('0:00');
  });
});
