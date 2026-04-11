import React from 'react';
import { X, Trash2, Tag } from 'lucide-react';
import { GalleryImage, CATEGORIES } from '@/types/gallery';
import { SmartImage } from './SmartImage'; // Import new component

interface ImageModalProps {
  image: GalleryImage | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onMove: (id: string, newCategory: string) => void;
}

export function ImageModal({ image, isOpen, onClose, onDelete, onMove }: ImageModalProps) {
  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <X size={24} />
      </button>

      <div className="flex flex-col md:flex-row w-full max-w-6xl h-[80vh] bg-card rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        
        {/* Left: Image View */}
        <div className="flex-1 bg-black/50 flex items-center justify-center p-4 relative overflow-auto">
           {/* 🟢 SWAP <img> FOR <SmartImage> */}
           <SmartImage image={image} className="max-h-full max-w-full rounded-lg shadow-lg" />
        </div>

        {/* Right: Info Panel */}
        <div className="w-full md:w-80 bg-card border-l border-border p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h2 className="text-xl font-bold truncate" title={image.filename}>{image.filename}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {(image.confidence * 100).toFixed(1)}% Confidence
            </p>
          </div>

          {/* Manual Category Move */}
          <div className="space-y-3">
             <label className="text-sm font-medium flex items-center gap-2">
               <Tag size={16} /> Category
             </label>
             <div className="grid grid-cols-2 gap-2">
               {CATEGORIES.filter(c => c.id !== 'other').map(cat => (
                 <button
                   key={cat.id}
                   onClick={() => onMove(image.id, cat.id)}
                   className={`text-xs px-2 py-1.5 rounded-md border transition-colors ${
                     image.category === cat.id 
                       ? 'bg-primary text-primary-foreground border-primary' 
                       : 'bg-secondary/50 hover:bg-secondary border-transparent'
                   }`}
                 >
                   {cat.icon} {cat.label}
                 </button>
               ))}
             </div>
          </div>

          <div className="mt-auto pt-6 border-t border-border">
             <button
               onClick={() => { onDelete(image.id); onClose(); }}
               className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors font-medium"
             >
               <Trash2 size={18} /> Delete Photo
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}