import { useCallback, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { Upload, ImagePlus, Check } from 'lucide-react';
import { ASPECT_RATIOS, type AspectRatioId, type CropResult } from '../types';
import { extractCroppedImage } from '../lib/crop';

interface CropStepProps {
  onCropApplied: (result: CropResult) => void;
}

export default function CropStep({ onCropApplied }: CropStepProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [aspectId, setAspectId] = useState<AspectRatioId>('4:5');
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspect = ASPECT_RATIOS.find((a) => a.id === aspectId)!.value;

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setProcessing(true);
    try {
      const cropped = await extractCroppedImage(imageSrc, croppedAreaPixels);
      onCropApplied({
        dataUrl: cropped.dataUrl,
        aspectId,
        width: cropped.width,
        height: cropped.height,
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glassmorphic-light rounded-3xl p-6 sm:p-8 w-full max-w-3xl space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
            Create Your Card
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Step 1: Upload an image and crop it to your desired aspect ratio.
          </p>
        </header>

        {!imageSrc ? (
          <div
            data-testid="upload-dropzone"
            role="button"
            aria-label="Upload image"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-12 flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-primary bg-primary/10'
                : 'border-slate-300 hover:border-primary/70 hover:bg-white/60'
            }`}
          >
            <div className="rounded-full bg-primary/15 p-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="text-slate-800 font-medium">
              Drop an image here, or click to choose a file
            </p>
            <p className="text-slate-500 text-xs">PNG, JPG, WebP — up to your browser's limit</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2 justify-center">
              {ASPECT_RATIOS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAspectId(a.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    aspectId === a.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-white/70 text-slate-700 hover:bg-white border border-slate-200'
                  }`}
                >
                  {a.id} <span className="opacity-70">· {a.label}</span>
                </button>
              ))}
            </div>

            <div className="relative w-full bg-slate-200 rounded-2xl overflow-hidden" style={{ height: 420 }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-12">Zoom</span>
              <input
                type="range"
                min={1}
                max={4}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="text-xs text-slate-500 w-12 text-right">{zoom.toFixed(2)}x</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <button
                onClick={() => {
                  setImageSrc(null);
                  setCroppedAreaPixels(null);
                }}
                className="px-5 py-3 rounded-2xl bg-white/70 text-slate-700 hover:bg-white border border-slate-200 transition flex items-center justify-center gap-2"
              >
                <ImagePlus className="w-4 h-4" />
                Choose Different Image
              </button>
              <button
                onClick={onApply}
                disabled={!croppedAreaPixels || processing}
                className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-medium shadow-lg shadow-primary/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {processing ? 'Processing…' : 'Apply Crop & Design'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
