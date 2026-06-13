import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Canvas } from 'fabric';
import { TEMPLATES, type Template } from '../lib/templates';
import { applyTemplate, countTextLayers } from '../lib/applyTemplate';
import { loadAllGoogleFonts } from '../lib/fonts';
import TemplateThumb from './TemplateThumb';

interface TemplatesModalProps {
  canvas: Canvas;
  virtualWidth: number;
  virtualHeight: number;
  onClose: () => void;
  onApplied: () => void;
  variant?: 'modal' | 'sheet';
}

export default function TemplatesModal({
  canvas,
  virtualWidth,
  virtualHeight,
  onClose,
  onApplied,
  variant = 'modal',
}: TemplatesModalProps) {
  const [pending, setPending] = useState<Template | null>(null);

  useEffect(() => {
    loadAllGoogleFonts();
  }, []);

  useEffect(() => {
    if (variant !== 'modal') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, variant]);

  const onPick = async (t: Template) => {
    if (countTextLayers(canvas) > 0) {
      setPending(t);
      return;
    }
    await applyTemplate(canvas, t, virtualWidth, virtualHeight);
    onApplied();
  };

  const onConfirmReplace = async () => {
    if (!pending) return;
    await applyTemplate(canvas, pending, virtualWidth, virtualHeight);
    setPending(null);
    onApplied();
  };

  const existingCount = countTextLayers(canvas);

  const grid = (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {TEMPLATES.map((t) => (
        <TemplateThumb
          key={t.id}
          template={t}
          selected={pending?.id === t.id}
          onClick={() => onPick(t)}
        />
      ))}
    </div>
  );

  const confirmBar = pending && (
    <div className="border-t border-slate-200 pt-3 mt-3 flex items-center gap-3 flex-wrap">
      <div className="flex-1 min-w-0 text-sm text-slate-700">
        Replace your {existingCount} text {existingCount === 1 ? 'layer' : 'layers'} with{' '}
        <span className="font-medium">{pending.name}</span>?
      </div>
      <button
        onClick={() => setPending(null)}
        className="px-3 py-1.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition"
      >
        Cancel
      </button>
      <button
        onClick={onConfirmReplace}
        className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition"
      >
        Replace
      </button>
    </div>
  );

  if (variant === 'sheet') {
    return (
      <div className="sm:hidden flex-shrink-0 h-[55vh] overflow-y-auto rounded-t-2xl shadow-lg border-t border-slate-200 bg-white/95 backdrop-blur-md px-5 pb-6">
        <button
          onClick={onClose}
          className="w-full flex justify-center py-3 sticky top-0 bg-white/95 backdrop-blur-md z-10"
          aria-label="Collapse"
        >
          <span className="w-12 h-1 rounded-full bg-slate-300" />
        </button>
        <h2 className="text-base font-semibold text-slate-900 mb-3">Templates</h2>
        {grid}
        {confirmBar}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-2xl p-5"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Pick a template</h2>
        {grid}
        {confirmBar}
      </div>
    </div>
  );
}
