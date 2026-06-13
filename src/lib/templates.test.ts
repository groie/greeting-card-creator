import { describe, expect, it } from 'vitest';
import { TEMPLATES } from './templates';
import { FONTS } from './fontList';

describe('TEMPLATES', () => {
  it('contains at least one template', () => {
    expect(TEMPLATES.length).toBeGreaterThan(0);
  });

  it('has unique ids', () => {
    const ids = TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every template has a name and at least one layer', () => {
    for (const t of TEMPLATES) {
      expect(t.name.length).toBeGreaterThan(0);
      expect(t.layers.length).toBeGreaterThan(0);
    }
  });

  it('every layer references a known font', () => {
    const known = new Set(FONTS.map((f) => f.name));
    for (const t of TEMPLATES) {
      for (const layer of t.layers) {
        expect(known.has(layer.fontFamily)).toBe(true);
      }
    }
  });

  it('every layer has fractional positions/sizes within sane bounds', () => {
    for (const t of TEMPLATES) {
      for (const layer of t.layers) {
        expect(layer.leftFrac).toBeGreaterThanOrEqual(0);
        expect(layer.leftFrac).toBeLessThanOrEqual(1);
        expect(layer.topFrac).toBeGreaterThanOrEqual(0);
        expect(layer.topFrac).toBeLessThanOrEqual(1);
        expect(layer.widthFrac).toBeGreaterThan(0);
        expect(layer.widthFrac).toBeLessThanOrEqual(1);
        expect(layer.fontSizeFrac).toBeGreaterThan(0);
        expect(layer.fontSizeFrac).toBeLessThan(1);
      }
    }
  });
});
