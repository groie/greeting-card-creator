import type { Canvas } from 'fabric';

const MAX_LONGEST_SIDE = 3000;
const HIGH_QUALITY_TARGET_MULTIPLIER = 3;

export type ExportPresetId = 'standard' | 'high';

export interface ExportPreset {
  id: ExportPresetId;
  label: string;
  multiplier: number;
  width: number;
  height: number;
}

export function getExportPresets(virtualWidth: number, virtualHeight: number): ExportPreset[] {
  const longest = Math.max(virtualWidth, virtualHeight);
  const highMultiplier = Math.min(HIGH_QUALITY_TARGET_MULTIPLIER, MAX_LONGEST_SIDE / longest);
  return [
    {
      id: 'standard',
      label: 'Standard',
      multiplier: 1,
      width: Math.round(virtualWidth),
      height: Math.round(virtualHeight),
    },
    {
      id: 'high',
      label: 'High quality',
      multiplier: highMultiplier,
      width: Math.round(virtualWidth * highMultiplier),
      height: Math.round(virtualHeight * highMultiplier),
    },
  ];
}

export async function exportCanvasToPng(canvas: Canvas, multiplier: number): Promise<Blob> {
  const previousActive = canvas.getActiveObject();
  canvas.discardActiveObject();
  canvas.renderAll();

  const tmp = canvas.toCanvasElement(multiplier);

  if (previousActive) {
    canvas.setActiveObject(previousActive);
    canvas.requestRenderAll();
  }

  return new Promise<Blob>((resolve, reject) => {
    tmp.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob returned null'))),
      'image/png',
    );
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
