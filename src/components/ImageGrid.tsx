import React from 'react';
import { GalleryImage } from '@/types/gallery';
import { SmartImage } from './SmartImage';

interface Props {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
}

export const ImageGrid: React.FC<Props> = ({ images, onImageClick }) => {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {images.map((image, idx) => (
        <div 
          key={image.id} 
          className="break-inside-avoid animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
          style={{ animationDelay: `${idx * 50}ms` }} // Cascade effect
        >
          <SmartImage 
            image={image} 
            onClick={() => onImageClick(image)} 
            className="w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-zoom-in"
          />
        </div>
      ))}
    </div>
  );
};