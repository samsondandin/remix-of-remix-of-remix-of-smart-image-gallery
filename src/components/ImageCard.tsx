import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Eye, Star, Info, Users } from 'lucide-react';
import { useUISettings } from '@/context/UISettingsContext';
import { GalleryImage, CATEGORIES } from '@/types/gallery';
import { getCategoryColor, getCategoryBorderColor } from '@/services/imageClassifier';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ImageCardProps {
  image: GalleryImage;
  onDelete: (id: string) => void;
  index: number;
  onOpen?: (index: number) => void;
}

export function ImageCard({ image, onDelete, index }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const category = CATEGORIES.find(c => c.id === image.category);
  const { showSuggestions } = useUISettings();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: index * 0.05 }}
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => { console.debug('ImageCard clicked:', image.id); if (onOpen) onOpen(index); else setShowDetails(true); }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { console.debug('ImageCard keyopen:', image.id); setShowDetails(true); }
        }}
      >
        <div className={cn(
          'relative rounded-xl overflow-hidden border transition-all duration-300 bg-card',
          isHovered ? 'shadow-md transform -translate-y-1' : '',
          'cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2'
        )}>
          {/* Image */}
          <div className="aspect-square bg-muted">
            <img
              src={image.url}
              alt={image.filename}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Category badge */}
          <div className={cn(
            'absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium',
            'flex items-center gap-1.5',
            getCategoryBorderColor(image.category),
            'bg-black/5 text-foreground'
          )}>
            <span>{category?.icon}</span>
            <span>{category?.label}</span>
            {image.faceCount && image.faceCount > 0 && (
              <span className="flex items-center gap-0.5 ml-1 pl-1.5 border-l border-white/30">
                <Users className="w-3 h-3" />
                {image.faceCount}
              </span>
            )}
          </div>

          {/* Confidence / match indicator (hideable) */}
          {showSuggestions && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
              <Star className="w-3 h-3" />
              {Math.round(image.confidence * 100)}%
            </div>
          )}

          {/* Hover overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col justify-end p-4"
          >
            {/* Filename */}
            <p className="text-white text-sm font-medium truncate mb-3">
              {image.filename}
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 bg-white/6 hover:bg-white/10 text-foreground border-0"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); if (onOpen) onOpen(index); else setShowDetails(true); }}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/6 hover:bg-destructive/80 text-foreground border-0"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onDelete(image.id); }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl glass-strong">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{category?.icon}</span>
              {image.filename}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Preview */}
            <div className="rounded-lg overflow-hidden bg-muted">
              <img
                src={image.url}
                alt={image.filename}
                className="w-full h-auto"
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              {/* Category */}
              <div className="glass rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Info className="w-4 h-4" />
                    Suggested labels
                  </div>
                <div className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
                  getCategoryColor(image.category),
                  'text-white'
                )}>
                  <span>{category?.icon}</span>
                  {category?.label}
                </div>
                {image.faceCount && image.faceCount > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {image.faceCount} {image.faceCount === 1 ? 'person' : 'people'} detected
                  </div>
                )}
              </div>

              {/* Confidence */}
              <div className="glass rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Match</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${image.confidence * 100}%` }}
                      className="h-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                  <span className="font-semibold text-primary">
                    {Math.round(image.confidence * 100)}%
                  </span>
                </div>
              </div>

              {/* Raw labels */}
              {showSuggestions && (
                <div className="glass rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Suggested labels</p>
                  <div className="space-y-2">
                    {image.rawLabels.slice(0, 5).map((label, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-foreground capitalize">
                          {label.label.split(',')[0]}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(label.score * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta */}
              {image.width && image.height && (
                <div className="glass rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Dimensions</p>
                  <p className="font-medium">{image.width} × {image.height}px</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
