import { describe, it, expect, beforeEach } from 'vitest';

const store = {};
global.localStorage = {
  getItem: (k) => store[k] ?? null,
  setItem: (k, v) => { store[k] = v; },
  removeItem: (k) => { delete store[k]; }
};

import { saveResult, getBestStars, getHighestCompletedLevel, isLevelUnlocked } from '../src/utils/Progress.js';

beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k]);
});

describe('saveResult', () => {
  it('saves star count for a level', () => {
    saveResult(1, 2);
    expect(getBestStars(1)).toBe(2);
  });

  it('keeps highest star count on re-save', () => {
    saveResult(1, 3);
    saveResult(1, 1);
    expect(getBestStars(1)).toBe(3);
  });
});

describe('getHighestCompletedLevel', () => {
  it('returns 0 when no levels completed', () => {
    expect(getHighestCompletedLevel()).toBe(0);
  });

  it('returns max level with any stars', () => {
    saveResult(1, 1);
    saveResult(3, 2);
    expect(getHighestCompletedLevel()).toBe(3);
  });
});

describe('isLevelUnlocked', () => {
  it('level 1 is always unlocked', () => {
    expect(isLevelUnlocked(1)).toBe(true);
  });

  it('level N is unlocked if level N-1 is completed', () => {
    expect(isLevelUnlocked(2)).toBe(false);
    saveResult(1, 1);
    expect(isLevelUnlocked(2)).toBe(true);
  });
});
