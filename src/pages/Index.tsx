import { motion } from 'framer-motion';
import { useGallery } from '@/hooks/useGallery';
import { Header } from '@/components/Header';
import { UploadZone } from '@/components/UploadZone';
import { ImageGrid } from '@/components/ImageGrid';
import { Loader2, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/types/gallery';
import { Link } from 'react-router-dom';
import { getCategoryColor } from '@/services/imageClassifier';
import { cn } from '@/lib/utils';

const Index = () => {
  const {
    images,
    isLoading,
    isClassifierReady,
    modelLoadProgress,
    modelLoadStatus,
    uploadImages,
    deleteImage,
    processingCount
  } = useGallery();

  const getCategoryCount = (categoryId: string): number => {
    return images.filter(img => img.category === categoryId).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading gallery...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
      </div>

      <Header imageCount={images.length} isClassifierReady={isClassifierReady} />

      <main className="container mx-auto px-6 py-8 relative">
        {/* Upload zone */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <UploadZone
            onUpload={uploadImages}
            isProcessing={processingCount > 0}
            processingCount={processingCount}
            isClassifierReady={isClassifierReady}
            modelProgress={modelLoadProgress}
            modelStatus={modelLoadStatus}
          />
        </motion.div>

        {/* Category Folders Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-display font-extrabold tracking-tight">
              Your Image Folders
            </h2>
            <span className="text-muted-foreground font-sans text-lg">
              ({images.length} total)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* All Images Folder */}
            <FolderCard
              to="/category/all"
              label="All Images"
              icon="🖼️"
              count={images.length}
              description="View all uploaded images"
            />
            
            {/* Category Folders */}
            {CATEGORIES.map((cat) => (
              <FolderCard
                key={cat.id}
                to={`/category/${cat.id}`}
                label={cat.label}
                icon={cat.icon}
                count={getCategoryCount(cat.id)}
                colorClass={getCategoryColor(cat.id)}
                description={`${getCategoryCount(cat.id)} ${getCategoryCount(cat.id) === 1 ? 'image' : 'images'} auto-sorted`}
              />
            ))}
          </div>
        </div>

        {/* Recent Images Preview */}
        {images.length > 0 && (
          <div>
            <h3 className="text-xl font-display font-bold mb-4 tracking-tight">
              Recently Added
            </h3>
            <ImageGrid images={images.slice(0, 8)} onDelete={deleteImage} />
            {images.length > 8 && (
              <div className="text-center mt-6">
                <Link 
                  to="/category/all"
                  className="text-primary hover:underline font-medium"
                >
                  View all {images.length} images →
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

interface FolderCardProps {
  to: string;
  label: string;
  icon: string;
  count: number;
  colorClass?: string;
  description: string;
}

function FolderCard({ to, label, icon, count, colorClass, description }: FolderCardProps) {
  return (
    <Link to={to}>
      <motion.div
        className="glass rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Color accent */}
        {colorClass && (
          <div className={cn(
            'absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-30',
            colorClass
          )} />
        )}
        
        <div className="relative">
          {/* Icon */}
          <div className="text-4xl mb-3">{icon}</div>
          
          {/* Label */}
          <h3 className="font-display font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
            {label}
          </h3>
          
          {/* Count */}
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              'px-2.5 py-1 rounded-full text-sm font-bold',
              count > 0 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {count}
            </span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default Index;
