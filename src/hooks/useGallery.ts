import { useState, useEffect, useCallback } from 'react';
import { GalleryImage, Category } from '@/types/gallery';
import { classifyImage, loadClassifier } from '@/services/imageClassifier';
import {
  saveImage,
  getImages,
  getImageData,
  deleteImage as deleteStoredImage,
  generateImageId,
  fileToDataUrl,
  getImageDimensions
} from '@/services/imageStorage';
import { useToast } from '@/hooks/use-toast';

interface UseGalleryReturn {
  images: GalleryImage[];
  isLoading: boolean;
  isClassifierReady: boolean;
  modelLoadProgress: number;
  modelLoadStatus: string;
  uploadImages: (files: File[]) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  selectedCategory: Category | 'all';
  setSelectedCategory: (category: Category | 'all') => void;
  filteredImages: GalleryImage[];
  processingCount: number;
}

export function useGallery(): UseGalleryReturn {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClassifierReady, setIsClassifierReady] = useState(false);
  const [modelLoadProgress, setModelLoadProgress] = useState(0);
  const [modelLoadStatus, setModelLoadStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [processingCount, setProcessingCount] = useState(0);
  const { toast } = useToast();

  // Load images and initialize classifier
  useEffect(() => {
    async function init() {
      try {
        // Load saved images
        const savedImages = await getImages();
        
        // Restore image URLs from storage
        const imagesWithUrls = await Promise.all(
          savedImages.map(async (img) => {
            const data = await getImageData(img.id);
            return { ...img, url: data || img.url };
          })
        );
        
        setImages(imagesWithUrls);
        setIsLoading(false);
        
        // Pre-load classifier
        await loadClassifier((progress, status) => {
          setModelLoadProgress(progress);
          setModelLoadStatus(status);
        });
        setIsClassifierReady(true);
      } catch (error) {
        console.error('Failed to initialize gallery:', error);
        setIsLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to initialize gallery',
          variant: 'destructive'
        });
      }
    }
    
    init();
  }, [toast]);

  const uploadImages = useCallback(async (files: File[]) => {
    setProcessingCount(files.length);
    
    for (const file of files) {
      try {
        // Convert to data URL
        const dataUrl = await fileToDataUrl(file);
        const dimensions = await getImageDimensions(dataUrl);
        
        // Classify image with face detection
        const { category, confidence, rawLabels, faceCount } = await classifyImage(dataUrl);
        
        const newImage: GalleryImage = {
          id: generateImageId(),
          url: dataUrl,
          filename: file.name,
          category,
          confidence,
          rawLabels,
          uploadedAt: new Date(),
          width: dimensions.width,
          height: dimensions.height,
          faceCount
        };
        
        // Save to storage
        await saveImage(newImage, dataUrl);
        
        // Update state
        setImages(prev => [newImage, ...prev]);
        setProcessingCount(prev => prev - 1);
        
        const faceInfo = faceCount && faceCount > 0 
          ? ` (${faceCount} ${faceCount === 1 ? 'person' : 'people'} detected)`
          : '';
        
        toast({
          title: 'Image added',
          description: `"${file.name}" tagged as ${category}${faceInfo} (${Math.round(confidence * 100)}% match)`
        });
      } catch (error) {
        console.error('Failed to process image:', error);
        setProcessingCount(prev => prev - 1);
        toast({
          title: 'Error',
          description: `Failed to process "${file.name}"`,
          variant: 'destructive'
        });
      }
    }
  }, [toast]);

  const deleteImage = useCallback(async (id: string) => {
    try {
      await deleteStoredImage(id);
      setImages(prev => prev.filter(img => img.id !== id));
      toast({
        title: 'Image deleted',
        description: 'Image has been removed from the gallery'
      });
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  return {
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
  };
}
