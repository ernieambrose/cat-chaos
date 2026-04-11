import { describe, it, expect } from 'vitest';
import { CAT_TYPES, getCatConfig } from '../src/config/cats.js';

describe('CAT_TYPES', () => {
  it('defines mittens, colonel, and duchess', () => {
    expect(CAT_TYPES).toHaveProperty('mittens');
    expect(CAT_TYPES).toHaveProperty('colonel');
    expect(CAT_TYPES).toHaveProperty('duchess');
  });

  it('colonel has higher mass than mittens', () => {
    expect(CAT_TYPES.colonel.physics.mass).toBeGreaterThan(CAT_TYPES.mittens.physics.mass);
  });

  it('duchess has lower mass than mittens', () => {
    expect(CAT_TYPES.duchess.physics.mass).toBeLessThan(CAT_TYPES.mittens.physics.mass);
  });

  it('duchess has speedBurst ability', () => {
    expect(CAT_TYPES.duchess.ability).toBe('speedBurst');
  });

  it('mittens and colonel have no ability', () => {
    expect(CAT_TYPES.mittens.ability).toBeNull();
    expect(CAT_TYPES.colonel.ability).toBeNull();
  });
});

describe('getCatConfig', () => {
  it('returns config for valid type', () => {
    expect(getCatConfig('mittens').id).toBe('mittens');
  });

  it('throws for unknown type', () => {
    expect(() => getCatConfig('unknown')).toThrow();
  });
});
