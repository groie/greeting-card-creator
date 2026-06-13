import type { Template } from '../lib/templates';

interface TemplateThumbProps {
  template: Template;
  selected?: boolean;
  onClick: () => void;
}

export default function TemplateThumb({ template, selected, onClick }: TemplateThumbProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border text-left transition ${
        selected
          ? 'ring-4 ring-primary ring-offset-2 border-primary scale-[1.03] shadow-lg'
          : 'border-slate-200 shadow-sm hover:shadow-lg hover:scale-[1.02]'
      }`}
      style={{ aspectRatio: '1 / 1', background: template.thumbBg }}
      title={template.name}
    >
      <div className="absolute inset-0" style={{ containerType: 'size' }}>
        {template.layers.map((layer, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center leading-tight"
            style={{
              left: `${layer.leftFrac * 100}%`,
              top: `${layer.topFrac * 100}%`,
              width: `${layer.widthFrac * 100}%`,
              fontFamily: `"${layer.fontFamily}", sans-serif`,
              fontSize: `${layer.fontSizeFrac * 100}cqh`,
              fontWeight: layer.fontWeight === 'bold' ? 700 : 400,
              fontStyle: layer.italic ? 'italic' : 'normal',
              color: layer.fill ?? '#ffffff',
              textAlign: layer.textAlign ?? 'center',
              opacity: layer.opacity ?? 1,
              textShadow: layer.shadow === false ? 'none' : '0 2px 6px rgba(0,0,0,0.5)',
            }}
          >
            {layer.text}
          </div>
        ))}
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 px-2 py-1 text-[11px] font-medium text-white transition ${
          selected ? 'bg-primary' : 'bg-black/30 backdrop-blur-sm'
        }`}
      >
        {template.name}
      </div>
    </button>
  );
}
