import React from 'react';
import { GalleryImage } from '@/types/gallery';
import { SmartImage } from './SmartImage';

interface Props {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
  isSelectionMode?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
}

export const ImageGrid: React.FC<Props> = ({
  images,
  onImageClick,
  isSelectionMode = false,
  selectedIds = [],
  onToggleSelect
}) => {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-4 space-y-2 md:space-y-4">
      {images.map((image, idx) => {
        const isSelected = selectedIds.includes(image.id);

        return (
          <div
            key={image.id}
            className="break-inside-avoid animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards relative group"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="relative">
              <SmartImage
                image={image}
                onClick={() => {
                  if (isSelectionMode && onToggleSelect) {
                    onToggleSelect(image.id);
                  } else {
                    onImageClick(image);
                  }
                }}
                className={`w-full rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 
                   ${isSelectionMode ? 'cursor-pointer' : 'cursor-zoom-in'}
                   ${isSelected ? 'ring-4 ring-primary ring-offset-2 opacity-80' : ''}
                 `}
              />

              {/* CHECKBOX OVERLAY */}
              {(isSelectionMode || isSelected) && (
                <div
                  className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all z-10
                      ${isSelected
                      ? 'bg-primary border-primary text-white scale-110 shadow-lg'
                      : 'bg-black/30 border-white/80 hover:bg-black/50'
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect && onToggleSelect(image.id);
                  }}
                >
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};