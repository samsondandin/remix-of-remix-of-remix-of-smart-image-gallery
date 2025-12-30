import React, { useEffect } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

interface LightboxProps {
  images: { id: string; url: string; filename?: string }[];
  index: number;
  open: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({ images, index, open, onClose, onNext, onPrev }: LightboxProps) {
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    }

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, onNext, onPrev]);

  if (!open) return null;

  const img = images[index];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-6">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-md text-white hover:bg-white/10"
      >
        <X className="w-6 h-6" />
      </button>

      <button
        aria-label="Previous"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-md text-white hover:bg-white/10"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="max-w-[95%] max-h-[90%] flex items-center justify-center">
        <img src={img.url} alt={img.filename || ''} className="max-w-full max-h-full object-contain rounded" />
      </div>

      <button
        aria-label="Next"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-md text-white hover:bg-white/10"
      >
        <ArrowRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/80">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
