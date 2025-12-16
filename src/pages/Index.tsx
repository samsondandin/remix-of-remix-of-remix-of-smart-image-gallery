import { motion } from 'framer-motion';
import { useGallery } from '@/hooks/useGallery';
import { Header } from '@/components/Header';
import { UploadZone } from '@/components/UploadZone';
import { CategorySidebar } from '@/components/CategorySidebar';
import { ImageGrid } from '@/components/ImageGrid';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const {
    images,
    isLoading,
    isClassifierReady,
    modelLoadProgress,
    modelLoadStatus,
    uploadImages,
    deleteImage,
    selectedCategory,
    setSelectedCategory,
    filteredImages,
    processingCount
  } = useGallery();

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
        <div className="flex gap-8">
          {/* Sidebar */}
          <CategorySidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            images={images}
          />

          {/* Main content */}
          <div className="flex-1 space-y-6">
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

            {/* Gallery header */}
            <div className="flex items-center justify-between">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold"
              >
                {selectedCategory === 'all' ? 'All Images' : (
                  <span className="capitalize">{selectedCategory}s</span>
                )}
                <span className="text-muted-foreground font-normal ml-2 text-lg">
                  ({filteredImages.length})
                </span>
              </motion.h2>
            </div>

            {/* Image grid */}
            <ImageGrid images={filteredImages} onDelete={deleteImage} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
