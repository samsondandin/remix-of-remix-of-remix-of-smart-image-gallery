import React, { useEffect } from 'react';
import { X, Trash, Tag } from 'lucide-react';
import { GalleryImage } from '@/types/gallery';

interface Props {
  image: GalleryImage | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function Lightbox({ image, onClose, onDelete }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
      
      <button onClick={onClose} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
        <X size={24} />
      </button>

      <div className="relative max-w-[95vw] max-h-[85vh] flex flex-col items-center">
        <img 
          src={image.url} 
          className="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain" 
        />
        
        <div className="mt-6 flex items-center gap-6 text-white/90 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Tag size={16} />
            <span className="font-bold capitalize">{image.category}</span>
          </div>
          <span className="text-white/30">|</span>
          <span className="text-sm opacity-70">{new Date(image.uploadedAt).toLocaleDateString()}</span>
          <span className="text-white/30">|</span>
          <button 
             onClick={() => { onDelete(image.id); onClose(); }}
             className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            <Trash size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}