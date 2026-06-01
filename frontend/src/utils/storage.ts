import { get, set } from 'idb-keyval';
import { GalleryImage, Person } from '@/types/gallery';

const IMAGES_KEY = 'gallery_images';
const PEOPLE_KEY = 'gallery_people';

export async function getImages(): Promise<GalleryImage[]> {
  const images = await get<GalleryImage[]>(IMAGES_KEY) || [];
  return images.map(img => ({
    ...img,
    uploadedAt: new Date(img.uploadedAt),
    category: img.category || 'other'
  })).sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
}

export async function saveImage(image: GalleryImage): Promise<void> {
  const images = await getImages();
  await set(IMAGES_KEY, [image, ...images]);
}

export async function updateImageCategory(id: string, newCategory: string): Promise<void> {
  const images = await getImages();
  const updated = images.map(img => 
    img.id === id ? { ...img, category: newCategory } : img
  );
  await set(IMAGES_KEY, updated);
}

export async function deleteStoredImage(id: string): Promise<void> {
  const images = await getImages();
  const filtered = images.filter(img => img.id !== id);
  await set(IMAGES_KEY, filtered);
}

export async function getPeople(): Promise<Person[]> {
  return await get<Person[]>(PEOPLE_KEY) || [];
}

export async function savePerson(person: Person): Promise<void> {
  const people = await getPeople();
  const updated = [...people.filter(p => p.name !== person.name), person];
  await set(PEOPLE_KEY, updated);
}