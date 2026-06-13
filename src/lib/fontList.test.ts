import { describe, expect, it } from 'vitest';
import { DEFAULT_FONT, FONTS } from './fontList';

describe('FONTS', () => {
  it('has a non-empty list', () => {
    expect(FONTS.length).toBeGreaterThan(0);
  });

  it('has unique names', () => {
    const names = FONTS.map((f) => f.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('every font has at least one weight', () => {
    for (const f of FONTS) {
      expect(f.weights.length).toBeGreaterThan(0);
      for (const w of f.weights) {
        expect(w).toBeGreaterThanOrEqual(100);
        expect(w).toBeLessThanOrEqual(900);
      }
    }
  });

  it('only uses known categories', () => {
    const allowed = new Set(['sans', 'serif', 'script', 'display']);
    for (const f of FONTS) {
      expect(allowed.has(f.category)).toBe(true);
    }
  });

  it('DEFAULT_FONT is in FONTS', () => {
    expect(FONTS.find((f) => f.name === DEFAULT_FONT)).toBeDefined();
  });
});
