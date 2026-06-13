import type { RefObject } from 'react';

interface CanvasEditorProps {
  canvasElRef: RefObject<HTMLCanvasElement>;
  containerRef: RefObject<HTMLDivElement>;
}

export default function CanvasEditor({ canvasElRef, containerRef }: CanvasEditorProps) {
  return (
    <div
      ref={containerRef}
      data-testid="canvas-wrapper"
      className="flex-1 min-w-0 min-h-0 flex items-center justify-center p-3 sm:p-6"
    >
      <canvas ref={canvasElRef} />
    </div>
  );
}
