import type { AspectRatioId } from '../types';

export const VIRTUAL_LONGEST_SIDE = 1200;

export function getVirtualSize(aspectId: AspectRatioId): { width: number; height: number } {
  const ratios: Record<AspectRatioId, [number, number]> = {
    '1:1': [1, 1],
    '4:5': [4, 5],
    '9:16': [9, 16],
    '5:7': [5, 7],
  };
  const [w, h] = ratios[aspectId];
  if (w >= h) {
    return { width: VIRTUAL_LONGEST_SIDE, height: Math.round((VIRTUAL_LONGEST_SIDE * h) / w) };
  }
  return { width: Math.round((VIRTUAL_LONGEST_SIDE * w) / h), height: VIRTUAL_LONGEST_SIDE };
}
