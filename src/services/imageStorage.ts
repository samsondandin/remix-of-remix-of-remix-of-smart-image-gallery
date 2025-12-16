import { get, set, del, keys } from 'idb-keyval';
import { GalleryImage } from '@/types/gallery';

const IMAGES_KEY = 'gallery_images';
const IMAGE_DATA_PREFIX = 'img_data_';

export async function saveImage(image: GalleryImage, imageData: string): Promise<void> {
  // Save image data separately
  await set(`${IMAGE_DATA_PREFIX}${image.id}`, imageData);
  
  // Save metadata
  const images = await getImages();
  images.push(image);
  await set(IMAGES_KEY, images);
}

export async function getImages(): Promise<GalleryImage[]> {
  const images = await get<GalleryImage[]>(IMAGES_KEY);
  return images || [];
}

export async function getImageData(imageId: string): Promise<string | undefined> {
  return get<string>(`${IMAGE_DATA_PREFIX}${imageId}`);
}

export async function deleteImage(imageId: string): Promise<void> {
  // Delete image data
  await del(`${IMAGE_DATA_PREFIX}${imageId}`);
  
  // Update metadata
  const images = await getImages();
  const filtered = images.filter(img => img.id !== imageId);
  await set(IMAGES_KEY, filtered);
}

export async function clearAllImages(): Promise<void> {
  const allKeys = await keys();
  for (const key of allKeys) {
    if (typeof key === 'string' && (key === IMAGES_KEY || key.startsWith(IMAGE_DATA_PREFIX))) {
      await del(key);
    }
  }
}

export function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = dataUrl;
  });
}
