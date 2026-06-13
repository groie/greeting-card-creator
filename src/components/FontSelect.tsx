import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { FONTS, type FontDef } from '../lib/fontList';

interface FontSelectProps {
  value: string;
  onChange: (name: string) => void;
}

const CATEGORY_LABEL: Record<FontDef['category'], string> = {
  sans: 'Sans Serif',
  serif: 'Serif',
  script: 'Script',
  display: 'Display',
};

export default function FontSelect({ value, onChange }: FontSelectProps) {
  const [open, setOpen] = useState(false);
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

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 bg-white/70 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary transition"
      >
        <span
          className="truncate text-base"
          style={{ fontFamily: `'${value}', sans-serif` }}
        >
          {value}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 left-0 right-0 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl py-1">
          {FONTS.map((f, i) => {
            const prev = i > 0 ? FONTS[i - 1] : null;
            const showHeader = !prev || prev.category !== f.category;
            const selected = f.name === value;
            return (
              <div key={f.name}>
                {showHeader && (
                  <>
                    {i > 0 && <div className="border-t border-slate-200 my-1" />}
                    <div className="px-3 pt-1.5 pb-0.5 text-[10px] uppercase tracking-wider text-slate-500">
                      {CATEGORY_LABEL[f.category]}
                    </div>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onChange(f.name);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left hover:bg-slate-50 transition ${
                    selected ? 'text-primary' : 'text-slate-800'
                  }`}
                >
                  <span
                    className="truncate text-lg"
                    style={{ fontFamily: `'${f.name}', sans-serif` }}
                  >
                    {f.name}
                  </span>
                  {selected && <Check className="w-4 h-4 flex-shrink-0" />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
