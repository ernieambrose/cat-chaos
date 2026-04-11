import { describe, it, expect } from 'vitest';
import { parseLevel, validateLevel } from '../src/utils/LevelLoader.js';

const validLevel = {
  id: 1,
  name: 'Wake-Up Call',
  catQueue: ['mittens', 'mittens', 'mittens'],
  napSpot: { x: 120, y: 490 },
  slingshot: { x: 220, y: 470 },
  structures: [
    { type: 'wood', x: 600, y: 490, width: 40, height: 80 }
  ],
  dogs: [{ x: 620, y: 450 }],
  tables: [],
  starThresholds: [0, 1, 2]
};

describe('parseLevel', () => {
  it('returns normalized level data', () => {
    const result = parseLevel(validLevel);
    expect(result.id).toBe(1);
    expect(result.catQueue).toEqual(['mittens', 'mittens', 'mittens']);
    expect(result.tables).toEqual([]);
  });

  it('defaults tables to empty array if missing', () => {
    const { tables, ...noTables } = validLevel;
    const result = parseLevel(noTables);
    expect(result.tables).toEqual([]);
  });
});

describe('validateLevel', () => {
  it('returns true for a valid level', () => {
    expect(validateLevel(validLevel)).toBe(true);
  });

  it('returns false when catQueue is empty', () => {
    expect(validateLevel({ ...validLevel, catQueue: [] })).toBe(false);
  });

  it('returns false when dogs array is missing', () => {
    const { dogs, ...noDogs } = validLevel;
    expect(validateLevel(noDogs)).toBe(false);
  });

  it('returns false when starThresholds does not have 3 entries', () => {
    expect(validateLevel({ ...validLevel, starThresholds: [0, 1] })).toBe(false);
  });
});
