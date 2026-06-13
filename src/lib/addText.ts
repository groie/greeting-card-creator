import { Textbox, type Canvas } from 'fabric';
import { DEFAULT_FONT } from './fontList';
import { loadGoogleFont } from './fonts';

export async function addTextLayer(
  canvas: Canvas,
  virtualWidth: number,
  virtualHeight: number,
): Promise<void> {
  await loadGoogleFont(DEFAULT_FONT);
  const fontSize = Math.round(virtualHeight * 0.07);
  const text = new Textbox('Your text here', {
    left: virtualWidth / 2,
    top: virtualHeight / 2,
    originX: 'center',
    originY: 'center',
    width: virtualWidth * 0.6,
    fontFamily: DEFAULT_FONT,
    fontSize,
    fill: '#ffffff',
    textAlign: 'center',
    editable: true,
  });
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.requestRenderAll();
}
