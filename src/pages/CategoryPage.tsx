import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGallery } from '@/hooks/useGallery';
import { Header } from '@/components/layout/Header';
import { UploadZone } from '@/components/features/UploadZone';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { ImageGrid } from '@/components/gallery/ImageGrid';
import { ImageModal } from '@/components/gallery/ImageModal';
import { Category, CATEGORIES, GalleryImage } from '@/types/gallery';
import { Loader2, FolderOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { SortMenu } from '@/components/features/SortMenu';
import { sortImages, type SortKey } from '@/lib/utils';
import { useState } from 'react';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const {
    images,
    knownPeople,
    uploadImages,
    deleteImage,
    moveImage,
    isAnalyzing,
    scanningStatus
  } = useGallery();

  // Local State
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Find category info
  const category = CATEGORIES.find(c => c.id === categoryId);
  const isValidCategory = category || categoryId === 'all';

  // Filter images for this category
  const categoryImages = categoryId === 'all'
    ? images
    : images.filter(img => img.category === categoryId);

  // Sync selected category with URL (Optional, mostly for context if needed)
  useEffect(() => {
    // If we had global selection state, we'd set it here.
  }, [categoryId]);

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
      </div>

      <Header
        onUpload={(e) => {
          if (e.target.files) uploadImages(Array.from(e.target.files));
        }}
      />

      <main className="container mx-auto px-6 py-24 relative">
        {/* Category Navigation */}
        <CategoryNav
          images={images}
          knownPeople={knownPeople}
          onSelect={(cat) => navigate(cat === 'all' ? '/gallery' : `/category/${cat}`)}
        />

        <div className="mt-8 space-y-6">
          {/* Upload zone */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <UploadZone
              onUpload={uploadImages}
              isProcessing={isAnalyzing}
              processingCount={isAnalyzing ? 1 : 0} // visual approximation
              isClassifierReady={true} // assume ready
              modelProgress={100}
              modelStatus={scanningStatus || "Ready"}
            />
          </motion.div>

          {/* Category Header */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
              {categoryIcon}
            </div>
            <div>
              <h1 className="text-3xl font-display font-extrabold tracking-tight">
                {categoryLabel}
              </h1>
              <p className="text-muted-foreground">
                {categoryImages.length} {categoryImages.length === 1 ? 'image' : 'images'} in this folder
              </p>
            </div>
          </div>

          {/* Image grid */}
          <div className="flex items-center justify-between mb-4">
            <div />
            <SortMenu value={sortKey} dir={sortDir} onChange={v => setSortKey(v)} onToggleDir={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')} />
          </div>

          <ImageGrid
            images={sortImages(categoryImages, sortKey, sortDir)}
            onImageClick={setSelectedImage}
            isSelectionMode={false}
          />
        </div>
      </main>

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        onDelete={deleteImage}
        onMove={moveImage}
      />
    </div>
  );
};

export default CategoryPage;

// touch to trigger HMR

// trigger HMR
