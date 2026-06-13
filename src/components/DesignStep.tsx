import { useEffect, useRef, useState } from 'react';
import { MousePointerClick, Type, SlidersHorizontal, LayoutTemplate } from 'lucide-react';
import type { CropResult } from '../types';
import { getVirtualSize } from '../lib/canvas';
import { useFabricCanvas } from '../hooks/useFabricCanvas';
import { loadAllGoogleFonts } from '../lib/fonts';
import { addTextLayer } from '../lib/addText';
import ActionBar from './ActionBar';
import Sidebar from './Sidebar';
import CanvasEditor from './CanvasEditor';
import TextPanel from './TextPanel';
import ShareModal from './ShareModal';
import TemplatesModal from './TemplatesModal';

interface DesignStepProps {
  crop: CropResult;
  onStartOver: () => void;
}

export default function DesignStep({ crop, onStartOver }: DesignStepProps) {
  const { width, height } = getVirtualSize(crop.aspectId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);

  useEffect(() => {
    loadAllGoogleFonts();
  }, []);

  const { canvasElRef, canvas, selectedText, bumpRevision } = useFabricCanvas({
    width,
    height,
    backgroundImageSrc: crop.dataUrl,
    containerRef,
  });

  useEffect(() => {
    if (!selectedText) setSheetExpanded(false);
  }, [selectedText]);

  const onMobileAddText = () => {
    if (!canvas) return;
    setTemplatesOpen(false);
    addTextLayer(canvas, width, height);
  };

  const onOpenTemplates = () => {
    setSheetExpanded(false);
    setTemplatesOpen(true);
  };

  return (
    <div data-testid="design-step" className="h-screen flex flex-col overflow-hidden">
      <ActionBar
        onStartOver={onStartOver}
        canvas={canvas}
        virtualWidth={width}
        virtualHeight={height}
        onShare={canvas ? () => setShareOpen(true) : undefined}
      />
      <div className="flex-1 min-h-0 flex flex-col sm:flex-row">
        <Sidebar
          canvas={canvas}
          virtualWidth={width}
          virtualHeight={height}
          onOpenTemplates={onOpenTemplates}
        />
        <CanvasEditor canvasElRef={canvasElRef} containerRef={containerRef} />
        <aside className="hidden sm:flex w-80 p-3 sm:pl-0">
          <div className="glassmorphic-light rounded-2xl p-5 w-full flex flex-col overflow-y-auto">
            {selectedText && canvas ? (
              <TextPanel canvas={canvas} text={selectedText} onChange={bumpRevision} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 text-sm gap-2">
                <MousePointerClick className="w-8 h-8 opacity-60" />
                <p>
                  Select a text layer to edit its style, or click{' '}
                  <span className="text-slate-800 font-medium">Text</span> in the sidebar to add one.
                </p>
              </div>
            )}
          </div>
        </aside>

        {canvas && (
          <div className="sm:hidden flex-shrink-0 h-14 flex items-center gap-2 px-3 bg-white/80 backdrop-blur-md border-t border-slate-200">
            <button
              onClick={() => {
                setSheetExpanded(false);
                setTemplatesOpen((v) => !v);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-700 text-sm font-medium border border-slate-300 shadow-sm hover:bg-slate-50 transition"
            >
              <LayoutTemplate className="w-4 h-4" />
              Templates
            </button>
            <button
              onClick={onMobileAddText}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium shadow-sm hover:bg-primary-hover transition"
            >
              <Type className="w-4 h-4" />
              Add text
            </button>
            {selectedText && (
              <button
                onClick={() => {
                  setTemplatesOpen(false);
                  setSheetExpanded((v) => !v);
                }}
                className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-700 text-sm font-medium border border-slate-300 shadow-sm hover:bg-slate-50 transition"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Edit style
                <span className="text-slate-400 text-xs">{sheetExpanded ? '▼' : '▲'}</span>
              </button>
            )}
          </div>
        )}

        {selectedText && canvas && sheetExpanded && (
          <div data-testid="mobile-text-sheet" className="sm:hidden flex-shrink-0 h-[45vh] overflow-y-auto rounded-t-2xl shadow-lg border-t border-slate-200 bg-white/95 backdrop-blur-md px-5 pb-6">
            <button
              onClick={() => setSheetExpanded(false)}
              className="w-full flex justify-center py-3 sticky top-0 bg-white/95 backdrop-blur-md z-10"
              aria-label="Collapse"
            >
              <span className="w-12 h-1 rounded-full bg-slate-300" />
            </button>
            <TextPanel canvas={canvas} text={selectedText} onChange={bumpRevision} />
          </div>
        )}

        {templatesOpen && canvas && (
          <TemplatesModal
            variant="sheet"
            canvas={canvas}
            virtualWidth={width}
            virtualHeight={height}
            onClose={() => setTemplatesOpen(false)}
            onApplied={() => setTemplatesOpen(false)}
          />
        )}
      </div>

      {templatesOpen && canvas && (
        <div className="hidden sm:block">
          <TemplatesModal
            variant="modal"
            canvas={canvas}
            virtualWidth={width}
            virtualHeight={height}
            onClose={() => setTemplatesOpen(false)}
            onApplied={() => setTemplatesOpen(false)}
          />
        </div>
      )}

      {shareOpen && canvas && (
        <ShareModal
          canvas={canvas}
          virtualWidth={width}
          virtualHeight={height}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
}
