import { Type, LayoutTemplate } from 'lucide-react';
import type { Canvas } from 'fabric';
import { addTextLayer } from '../lib/addText';

interface SidebarProps {
  canvas: Canvas | null;
  virtualWidth: number;
  virtualHeight: number;
  onOpenTemplates: () => void;
}

export default function Sidebar({
  canvas,
  virtualWidth,
  virtualHeight,
  onOpenTemplates,
}: SidebarProps) {
  const onAddText = () => {
    if (!canvas) return;
    addTextLayer(canvas, virtualWidth, virtualHeight);
  };

  return (
    <aside className="hidden sm:flex flex-col gap-3 w-20 py-4 px-2 glassmorphic-light rounded-2xl m-3 mr-0">
      <button
        onClick={onOpenTemplates}
        disabled={!canvas}
        className="flex flex-col items-center gap-1 p-3 rounded-xl text-slate-700 hover:bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition group"
        title="Templates"
      >
        <LayoutTemplate className="w-6 h-6 group-hover:text-primary transition-colors" />
        <span className="text-[10px] uppercase tracking-wider">Templates</span>
      </button>
      <button
        onClick={onAddText}
        disabled={!canvas}
        className="flex flex-col items-center gap-1 p-3 rounded-xl text-slate-700 hover:bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed transition group"
        title="Add Text"
      >
        <Type className="w-6 h-6 group-hover:text-primary transition-colors" />
        <span className="text-[10px] uppercase tracking-wider">Text</span>
      </button>
    </aside>
  );
}
