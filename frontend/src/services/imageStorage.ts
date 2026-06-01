import { get, set } from 'idb-keyval';
import { GalleryImage, Person } from '@/types/gallery';

const IMAGES_KEY = 'gallery_images';
const PEOPLE_KEY = 'gallery_people'; // New key for saving faces

// --- IMAGE STORAGE ---
export async function getImages(): Promise<GalleryImage[]> {
  const images = await get<GalleryImage[]>(IMAGES_KEY) || [];
  // Fix dates from JSON
  return images.map(img => ({
    ...img,
    uploadedAt: new Date(img.uploadedAt),
    // Ensure legacy data has correct structure
    category: img.category || 'other'
  })).sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
}

export async function saveImage(image: GalleryImage): Promise<void> {
  const images = await getImages();
  await set(IMAGES_KEY, [image, ...images]);
}

export async function deleteStoredImage(id: string): Promise<void> {
  const images = await getImages();
  await set(IMAGES_KEY, images.filter(img => img.id !== id));
}

// --- PEOPLE STORAGE (The Memory Fix) ---
export async function getPeople(): Promise<Person[]> {
  return await get<Person[]>(PEOPLE_KEY) || [];
}

export async function savePerson(person: Person): Promise<void> {
  const people = await getPeople();
  // Prevent duplicates
  const updated = [...people.filter(p => p.name !== person.name), person];
  await set(PEOPLE_KEY, updated);
}