import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Eye, Sparkles, Info, Users } from 'lucide-react';
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
}

export function ImageCard({ image, onDelete, index }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const category = CATEGORIES.find(c => c.id === image.category);

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
      >
        <div className={cn(
          'relative rounded-xl overflow-hidden border-2 transition-all duration-300',
          getCategoryBorderColor(image.category),
          isHovered ? 'shadow-glow border-opacity-100' : 'border-opacity-30'
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
            'flex items-center gap-1.5 backdrop-blur-md',
            getCategoryColor(image.category),
            'text-white shadow-md'
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

          {/* Confidence */}
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {Math.round(image.confidence * 100)}%
          </div>

          {/* Hover overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4"
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
                className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur text-white border-0"
                onClick={() => setShowDetails(true)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/10 hover:bg-destructive/80 backdrop-blur text-white border-0"
                onClick={() => onDelete(image.id)}
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
                  Classification Results
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
                <p className="text-sm text-muted-foreground mb-2">Confidence Score</p>
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
              <div className="glass rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">AI Predictions</p>
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
