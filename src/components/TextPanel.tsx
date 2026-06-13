import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { Shadow, type Canvas, type Textbox } from 'fabric';
import { loadGoogleFont } from '../lib/fonts';
import FontSelect from './FontSelect';

interface TextPanelProps {
  canvas: Canvas;
  text: Textbox;
  onChange: () => void;
}

type Align = 'left' | 'center' | 'right';

type BlendMode = 'source-over' | 'multiply' | 'screen' | 'overlay';

const BLEND_OPTIONS: { value: BlendMode; label: string }[] = [
  { value: 'source-over', label: 'Normal' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
];

export default function TextPanel({ canvas, text, onChange }: TextPanelProps) {
  const apply = (props: Record<string, unknown>) => {
    text.set(props);
    canvas.requestRenderAll();
    onChange();
  };

  const onFontFamilyChange = async (name: string) => {
    await loadGoogleFont(name);
    apply({ fontFamily: name });
  };

  const onSizeChange = (v: number) => apply({ fontSize: v });

  const onBoldToggle = () => {
    const isBold = text.fontWeight === 'bold' || text.fontWeight === 700;
    apply({ fontWeight: isBold ? 'normal' : 'bold' });
  };

  const onItalicToggle = () => {
    const isItalic = text.fontStyle === 'italic';
    apply({ fontStyle: isItalic ? 'normal' : 'italic' });
  };

  const onAlignChange = (align: Align) => apply({ textAlign: align });

  const onColorChange = (color: string) => apply({ fill: color });

  const onOpacityChange = (v: number) => apply({ opacity: v / 100 });

  const onShadowToggle = () => {
    if (text.shadow) {
      apply({ shadow: null });
    } else {
      apply({
        shadow: new Shadow({
          color: 'rgba(0,0,0,0.5)',
          blur: 8,
          offsetX: 0,
          offsetY: 2,
        }),
      });
    }
  };

  const onBlendChange = (mode: BlendMode) => apply({ globalCompositeOperation: mode });

  const onDelete = () => {
    canvas.remove(text);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  const isBold = text.fontWeight === 'bold' || text.fontWeight === 700;
  const isItalic = text.fontStyle === 'italic';
  const align = ((text.textAlign as Align) || 'left') as Align;
  const color = (typeof text.fill === 'string' ? text.fill : '#ffffff') as string;
  const fontSize = text.fontSize ?? 32;
  const fontFamily = (text.fontFamily as string) ?? 'Inter';
  const opacityPct = Math.round((text.opacity ?? 1) * 100);
  const hasShadow = text.shadow != null;
  const blend = ((text.globalCompositeOperation as BlendMode) || 'source-over') as BlendMode;

  const toggleClass = (active: boolean) =>
    `flex-1 p-2 rounded-lg border transition flex items-center justify-center ${
      active
        ? 'bg-primary border-primary text-white'
        : 'bg-white/70 border-slate-200 text-slate-700 hover:bg-white'
    }`;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">
          Font
        </label>
        <FontSelect value={fontFamily} onChange={onFontFamilyChange} />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">
          Size: <span className="text-slate-800">{Math.round(fontSize)}</span>
        </label>
        <input
          type="range"
          min={12}
          max={240}
          value={fontSize}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onBoldToggle} className={toggleClass(isBold)} title="Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button onClick={onItalicToggle} className={toggleClass(isItalic)} title="Italic">
          <Italic className="w-4 h-4" />
        </button>
        <label
          className="flex-1 p-2 rounded-lg border border-slate-200 bg-white/70 hover:bg-white transition cursor-pointer flex items-center justify-center"
          title="Color"
        >
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-6 h-6 border-0 bg-transparent cursor-pointer p-0"
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onAlignChange('left')}
          className={toggleClass(align === 'left')}
          title="Align left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onAlignChange('center')}
          className={toggleClass(align === 'center')}
          title="Align center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => onAlignChange('right')}
          className={toggleClass(align === 'right')}
          title="Align right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      <div className="border-t border-slate-200 pt-3 flex flex-col gap-3">
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">
            Opacity: <span className="text-slate-800">{opacityPct}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={opacityPct}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onShadowToggle}
            className={`${toggleClass(hasShadow)} gap-2`}
            title="Toggle drop shadow"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs">Shadow</span>
          </button>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">
            Blend
          </label>
          <select
            value={blend}
            onChange={(e) => onBlendChange(e.target.value as BlendMode)}
            className="w-full bg-white/70 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {BLEND_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={onDelete}
        className="mt-2 p-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center gap-2"
        title="Delete layer"
      >
        <Trash2 className="w-4 h-4" />
        <span className="text-sm">Delete layer</span>
      </button>
    </div>
  );
}
