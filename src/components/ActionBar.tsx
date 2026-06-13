import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Download, Share2, Loader2 } from 'lucide-react';
import type { Canvas } from 'fabric';
import {
  exportCanvasToPng,
  downloadBlob,
  getExportPresets,
  type ExportPresetId,
} from '../lib/export';

interface ActionBarProps {
  onStartOver: () => void;
  canvas: Canvas | null;
  virtualWidth: number;
  virtualHeight: number;
  onShare?: () => void;
}

export default function ActionBar({
  onStartOver,
  canvas,
  virtualWidth,
  virtualHeight,
  onShare,
}: ActionBarProps) {
  const [open, setOpen] = useState(false);
  const [busyId, setBusyId] = useState<ExportPresetId | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const presets = getExportPresets(virtualWidth, virtualHeight);

  const doExport = async (id: ExportPresetId) => {
    if (!canvas || busyId) return;
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    setBusyId(id);
    try {
      const blob = await exportCanvasToPng(canvas, preset.multiplier);
      downloadBlob(blob, `greeting-card-${preset.width}x${preset.height}.png`);
      setOpen(false);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <header className="relative z-30 glassmorphic-light rounded-2xl m-3 px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
          Card Canvas
        </h1>
        <span className="hidden sm:inline text-xs text-slate-500 ml-2">Step 2 · Design</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onStartOver}
          aria-label="Start Over"
          className="px-3 sm:px-4 py-2 rounded-xl bg-white/70 hover:bg-white border border-slate-200 text-slate-700 text-sm flex items-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Start Over</span>
        </button>

        <div ref={rootRef} className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            disabled={!canvas}
            aria-label="Export"
            className="px-3 sm:px-4 py-2 rounded-xl bg-white/70 hover:bg-white border border-slate-200 text-slate-700 text-sm flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-2xl py-1 z-30">
              {presets.map((p) => {
                const busy = busyId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => doExport(p.id)}
                    disabled={busyId !== null}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm text-slate-900 font-medium">{p.label}</div>
                      <div className="text-xs text-slate-500">
                        {p.width} × {p.height} px · PNG
                      </div>
                    </div>
                    {busy && <Loader2 className="w-4 h-4 animate-spin text-slate-500" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={onShare}
          disabled={!onShare}
          aria-label="Share"
          className="px-3 sm:px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium shadow-lg shadow-primary/30 flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </header>
  );
}
