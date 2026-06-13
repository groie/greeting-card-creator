export type AspectRatioId = '1:1' | '4:5' | '9:16' | '5:7';

export interface AspectRatioPreset {
  id: AspectRatioId;
  label: string;
  value: number;
}

export const ASPECT_RATIOS: AspectRatioPreset[] = [
  { id: '1:1', label: 'Square', value: 1 },
  { id: '4:5', label: 'Portrait', value: 4 / 5 },
  { id: '9:16', label: 'Story', value: 9 / 16 },
  { id: '5:7', label: 'Card', value: 5 / 7 },
];

export interface CropResult {
  dataUrl: string;
  aspectId: AspectRatioId;
  width: number;
  height: number;
}
