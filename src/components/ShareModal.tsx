import { useEffect, useState } from 'react';
import { X, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import type { Canvas } from 'fabric';
import { exportCanvasToPng } from '../lib/export';
import { copyPngToClipboard, isClipboardImageSupported, openWhatsApp } from '../lib/share';

interface ShareModalProps {
  canvas: Canvas;
  virtualWidth: number;
  virtualHeight: number;
  onClose: () => void;
}

type CopyStatus = 'idle' | 'busy' | 'success' | 'error';

export default function ShareModal({
  canvas,
  virtualWidth,
  virtualHeight,
  onClose,
}: ShareModalProps) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const clipboardSupported = isClipboardImageSupported();

  useEffect(() => {
    let cancelled = false;
    exportCanvasToPng(canvas, 1).then((b) => {
      if (!cancelled) setBlob(b);
    });
    return () => {
      cancelled = true;
    };
  }, [canvas]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onCopy = async () => {
    if (!blob) return;
    setCopyStatus('busy');
    try {
      await copyPngToClipboard(blob);
      setCopyStatus('success');
      window.setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('error');
      window.setTimeout(() => setCopyStatus('idle'), 3000);
    }
  };

  const onWhatsApp = async () => {
    if (blob && clipboardSupported) {
      try {
        await copyPngToClipboard(blob);
      } catch {
        /* still open WhatsApp */
      }
    }
    openWhatsApp();
  };

  const copyLabel =
    copyStatus === 'success'
      ? 'Copied!'
      : copyStatus === 'error'
      ? 'Copy failed'
      : copyStatus === 'busy'
      ? 'Copying…'
      : 'Copy to clipboard';

  const CopyIcon =
    copyStatus === 'success'
      ? Check
      : copyStatus === 'error'
      ? AlertCircle
      : copyStatus === 'busy'
      ? Loader2
      : Copy;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        data-testid="share-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl p-6"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-slate-900">Share your card</h2>
        <p className="text-sm text-slate-500 mb-5">
          {virtualWidth} × {virtualHeight} px PNG
        </p>

        {!blob ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm py-10 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating image…
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={onCopy}
              disabled={!clipboardSupported || copyStatus === 'busy'}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 text-sm flex items-center gap-3 transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <CopyIcon
                className={`w-5 h-5 flex-shrink-0 ${
                  copyStatus === 'success'
                    ? 'text-emerald-500'
                    : copyStatus === 'error'
                    ? 'text-red-500'
                    : copyStatus === 'busy'
                    ? 'animate-spin'
                    : ''
                }`}
              />
              <div className="flex-1">
                <div className="font-medium">{copyLabel}</div>
                <div className="text-xs text-slate-500">
                  {clipboardSupported
                    ? 'Paste anywhere as an image'
                    : 'Not supported in this browser'}
                </div>
              </div>
            </button>

            <button
              onClick={onWhatsApp}
              className="p-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white text-sm flex items-center gap-3 transition text-left shadow-lg shadow-[#25D366]/30"
            >
              <WhatsAppIcon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium">Share to WhatsApp</div>
                <div className="text-xs text-white/80">
                  {clipboardSupported
                    ? 'Image copied — paste into the chat'
                    : 'Opens the WhatsApp app'}
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
