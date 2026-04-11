import React from 'react';
import { GalleryImage } from '@/types/gallery';

interface Props {
  image: GalleryImage;
  className?: string;
  onClick?: () => void;
}

export const SmartImage: React.FC<Props> = ({ image, className, onClick }) => {
  // Calculate percentage (e.g., 0.98 -> 98%)
  const percentage = Math.round(image.confidence * 100);

  // Determine color based on confidence score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500/80 text-white'; // High confidence
    if (score >= 70) return 'bg-yellow-500/80 text-black'; // Medium
    return 'bg-red-500/80 text-white'; // Low
  };

  return (
    <div 
      className={`relative group cursor-pointer overflow-hidden rounded-xl bg-gray-100 ${className}`} 
      onClick={onClick}
    >
      <img 
        src={image.url} 
        alt={image.filename} 
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" 
        loading="lazy"
        decoding="async"
        style={{ minHeight: '150px' }}
      />

      {/* HOVER OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
         
         <div className="flex items-center justify-between mb-1">
             {/* Category Name */}
             <span className="text-white font-bold text-lg capitalize shadow-black drop-shadow-md">
                {image.category}
             </span>

             {/* 🟢 PERCENTAGE BADGE */}
             <span className={`text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md shadow-sm border border-white/10 ${getScoreColor(percentage)}`}>
                {percentage}% Match
             </span>
         </div>

         {/* Date */}
         <span className="text-white/70 text-xs">
            {new Date(image.uploadedAt).toLocaleDateString()}
         </span>
      </div>

      {/* FACE BOX (Only visible if it's a person) */}
      {image.faceBox && (
        <div
          className="absolute border-2 border-green-400 bg-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[0_0_15px_rgba(74,222,128,0.5)]"
          style={{
            left: `${image.faceBox.x}px`,
            top: `${image.faceBox.y}px`,
            width: `${image.faceBox.width}px`,
            height: `${image.faceBox.height}px`,
            borderRadius: '8px'
          }}
        >
           {/* Floating Name Tag */}
           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/20 whitespace-nowrap z-10">
              {image.matchedPersonName || "Face"}
           </div>
        </div>
      )}
    </div>
  );
};