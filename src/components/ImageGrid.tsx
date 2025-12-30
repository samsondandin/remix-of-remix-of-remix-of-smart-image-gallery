import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GalleryImage } from '@/types/gallery';
import { ImageCard } from './ImageCard';
import { ImageOff } from 'lucide-react';

interface ImageGridProps {
  images: GalleryImage[];
  onDelete: (id: string) => void;
}

export function ImageGrid({ images, onDelete }: ImageGridProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const Lightbox = React.lazy(() => import('./Lightbox'));

  const handleClose = () => { console.debug('Lightbox close'); setSelectedIndex(null); };
  const handleNext = () => setSelectedIndex((i) => (i === null ? null : (i + 1) % images.length));
  const handlePrev = () => setSelectedIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="p-6 rounded-full bg-muted mb-4">
          <ImageOff className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No images yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Upload some images to get started. We'll automatically tag and organize them for you.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            onDelete={onDelete}
            index={index}
            onOpen={(i) => { console.debug('Open requested for', i, images[i]?.id); setSelectedIndex(i); }}
          />
        ))}
      </AnimatePresence>
      {selectedIndex !== null && (
        <React.Suspense fallback={null}>
          <Lightbox
            images={images}
            index={selectedIndex}
            open={true}
            onClose={handleClose}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </React.Suspense>
      )}
    </div>
  );
}

