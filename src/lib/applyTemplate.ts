import { Textbox, Shadow, type Canvas, type FabricObject } from 'fabric';
import type { Template } from './templates';
import { loadGoogleFont } from './fonts';

const SHADOW_PRESET = new Shadow({
  color: 'rgba(0,0,0,0.5)',
  blur: 8,
  offsetX: 0,
  offsetY: 2,
});

export function countTextLayers(canvas: Canvas): number {
  return canvas.getObjects().filter((o: FabricObject) => o.type === 'textbox').length;
}

export async function applyTemplate(
  canvas: Canvas,
  template: Template,
  virtualWidth: number,
  virtualHeight: number,
): Promise<void> {
  await Promise.all(
    template.layers.map((l) => loadGoogleFont(l.fontFamily).catch(() => {})),
  );

  canvas
    .getObjects()
    .filter((o: FabricObject) => o.type === 'textbox')
    .forEach((o) => canvas.remove(o));

  for (const layer of template.layers) {
    const tb = new Textbox(layer.text, {
      left: layer.leftFrac * virtualWidth,
      top: layer.topFrac * virtualHeight,
      originX: 'center',
      originY: 'center',
      width: layer.widthFrac * virtualWidth,
      fontFamily: layer.fontFamily,
      fontSize: Math.round(layer.fontSizeFrac * virtualHeight),
      fontWeight: layer.fontWeight ?? 'normal',
      fontStyle: layer.italic ? 'italic' : 'normal',
      fill: layer.fill ?? '#ffffff',
      textAlign: layer.textAlign ?? 'center',
      opacity: layer.opacity ?? 1,
      editable: true,
    });
    if (layer.shadow !== false) tb.set('shadow', SHADOW_PRESET);
    if (layer.blend && layer.blend !== 'normal') {
      tb.set('globalCompositeOperation', layer.blend);
    }
    canvas.add(tb);
  }

  canvas.discardActiveObject();
  canvas.requestRenderAll();
}
