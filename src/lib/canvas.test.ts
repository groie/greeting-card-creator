import { describe, expect, it } from 'vitest';
import { VIRTUAL_LONGEST_SIDE, getVirtualSize } from './canvas';

describe('getVirtualSize', () => {
  it('returns 1200x1200 for 1:1', () => {
    expect(getVirtualSize('1:1')).toEqual({ width: 1200, height: 1200 });
  });

  it('returns portrait 4:5 with longest side = 1200', () => {
    const size = getVirtualSize('4:5');
    expect(size.height).toBe(VIRTUAL_LONGEST_SIDE);
    expect(size.width).toBe(Math.round((1200 * 4) / 5));
  });

  it('returns portrait 9:16 with longest side = 1200', () => {
    const size = getVirtualSize('9:16');
    expect(size.height).toBe(VIRTUAL_LONGEST_SIDE);
    expect(size.width).toBe(Math.round((1200 * 9) / 16));
  });

  it('returns portrait 5:7 with longest side = 1200', () => {
    const size = getVirtualSize('5:7');
    expect(size.height).toBe(VIRTUAL_LONGEST_SIDE);
    expect(size.width).toBe(Math.round((1200 * 5) / 7));
  });

  it('always has longest side equal to VIRTUAL_LONGEST_SIDE', () => {
    const ids = ['1:1', '4:5', '9:16', '5:7'] as const;
    for (const id of ids) {
      const { width, height } = getVirtualSize(id);
      expect(Math.max(width, height)).toBe(VIRTUAL_LONGEST_SIDE);
    }
  });
});
