import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGallery } from '@/hooks/useGallery';
import { Header } from '@/components/Header';
import { UploadZone } from '@/components/UploadZone';
import { CategoryNav } from '@/components/CategoryNav';
import { ImageGrid } from '@/components/ImageGrid';
import { Category, CATEGORIES } from '@/types/gallery';
import { Loader2, FolderOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const {
    images,
    isLoading,
    isClassifierReady,
    modelLoadProgress,
    modelLoadStatus,
    uploadImages,
    deleteImage,
    processingCount,
    setSelectedCategory
  } = useGallery();

  // Find category info
  const category = CATEGORIES.find(c => c.id === categoryId);
  const isValidCategory = category || categoryId === 'all';
  
  // Filter images for this category
  const categoryImages = categoryId === 'all' 
    ? images 
    : images.filter(img => img.category === categoryId);

  // Sync selected category with URL
  useEffect(() => {
    if (isValidCategory) {
      setSelectedCategory(categoryId as Category | 'all');
    }
  }, [categoryId, isValidCategory, setSelectedCategory]);

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

  if (!isValidCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Category Not Found</h2>
          <p className="text-muted-foreground mb-6">The category "{categoryId}" doesn't exist.</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Button>
        </div>
      </div>
    );
  }

  const categoryLabel = categoryId === 'all' ? 'All Images' : category?.label || categoryId;
  const categoryIcon = categoryId === 'all' ? '🖼️' : category?.icon || '📁';

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
      </div>

      <Header imageCount={images.length} isClassifierReady={isClassifierReady} />

      <main className="container mx-auto px-6 py-8 relative">
        {/* Category Navigation */}
        <CategoryNav 
          currentCategory={categoryId as Category | 'all'} 
          images={images}
        />

        <div className="mt-8 space-y-6">
          {/* Upload zone */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
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

          {/* Category Header */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl"
            >
              {categoryIcon}
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-display font-extrabold tracking-tight"
              >
                {categoryLabel}
              </motion.h1>
              <p className="text-muted-foreground">
                {categoryImages.length} {categoryImages.length === 1 ? 'image' : 'images'} in this folder
              </p>
            </div>
          </div>

          {/* Empty State */}
          {categoryImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold mb-2">No images yet</h3>
              <p className="text-muted-foreground">
                Upload images and they'll be automatically sorted into this folder
              </p>
            </motion.div>
          )}

          {/* Image grid */}
          <ImageGrid images={categoryImages} onDelete={deleteImage} />
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
