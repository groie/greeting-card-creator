import { useEffect, useRef, useState, type RefObject } from 'react';
import { Canvas, FabricImage, Textbox, type FabricObject } from 'fabric';

export interface UseFabricCanvasOptions {
  width: number;
  height: number;
  backgroundImageSrc: string;
  containerRef: RefObject<HTMLElement>;
}

export interface UseFabricCanvasResult {
  canvasElRef: RefObject<HTMLCanvasElement>;
  canvas: Canvas | null;
  selectedText: Textbox | null;
  revision: number;
  bumpRevision: () => void;
}

export function useFabricCanvas({
  width,
  height,
  backgroundImageSrc,
  containerRef,
}: UseFabricCanvasOptions): UseFabricCanvasResult {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [selectedText, setSelectedText] = useState<Textbox | null>(null);
  const [revision, setRevision] = useState(0);
  const bumpRevision = () => setRevision((r) => r + 1);

  useEffect(() => {
    if (!canvasElRef.current) return;
    const c = new Canvas(canvasElRef.current, {
      width,
      height,
      preserveObjectStacking: true,
      backgroundColor: '#ffffff',
    });

    let cancelled = false;
    (async () => {
      const img = await FabricImage.fromURL(backgroundImageSrc, { crossOrigin: 'anonymous' });
      if (cancelled) return;
      const imgW = img.width ?? 1;
      const imgH = img.height ?? 1;
      const scale = Math.max(width / imgW, height / imgH);
      img.set({
        scaleX: scale,
        scaleY: scale,
        left: width / 2,
        top: height / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });
      c.add(img);
      c.sendObjectToBack(img);
      c.requestRenderAll();
    })();

    const updateSelection = () => {
      const obj = c.getActiveObject() as FabricObject | undefined;
      if (obj && obj.type === 'textbox') {
        setSelectedText(obj as Textbox);
      } else {
        setSelectedText(null);
      }
    };
    c.on('selection:created', updateSelection);
    c.on('selection:updated', updateSelection);
    c.on('selection:cleared', () => setSelectedText(null));

    setCanvas(c);

    return () => {
      cancelled = true;
      c.dispose();
      setCanvas(null);
      setSelectedText(null);
    };
  }, [width, height, backgroundImageSrc]);

  useEffect(() => {
    if (!canvas) return;
    const el = containerRef.current;
    if (!el) return;
    const updateSize = (availW: number, availH: number) => {
      if (availW <= 0 || availH <= 0) return;
      const scale = Math.min(availW / width, availH / height);
      const cssW = Math.floor(width * scale);
      const cssH = Math.floor(height * scale);
      canvas.setDimensions({ width: cssW, height: cssH }, { cssOnly: true });
    };
    const rect = el.getBoundingClientRect();
    const styles = window.getComputedStyle(el);
    const padX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    const padY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    updateSize(rect.width - padX, rect.height - padY);
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width: w, height: h } = entry.contentRect;
      updateSize(w, h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [canvas, width, height, containerRef]);

  return { canvasElRef, canvas, selectedText, revision, bumpRevision };
}
