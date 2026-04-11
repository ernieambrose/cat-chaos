import { describe, it, expect } from 'vitest';
import { calculateStars } from '../src/utils/Stars.js';

describe('calculateStars', () => {
  const thresholds = [0, 1, 2];

  it('returns 3 stars when cats remaining meets highest threshold', () => {
    expect(calculateStars(2, thresholds)).toBe(3);
    expect(calculateStars(5, thresholds)).toBe(3);
  });

  it('returns 2 stars when cats remaining meets middle threshold only', () => {
    expect(calculateStars(1, thresholds)).toBe(2);
  });

  it('returns 1 star when only lowest threshold is met', () => {
    expect(calculateStars(0, thresholds)).toBe(1);
  });
});
