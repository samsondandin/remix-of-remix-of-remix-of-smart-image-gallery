import { openDB, DBSchema } from 'idb';
import { GalleryImage, Person } from '@/types/gallery';

interface SmartGalleryDB extends DBSchema {
  images: {
    key: string;
    value: GalleryImage;
    indexes: { 'by-category': string };
  };
  people: {
    key: string;
    value: Person;
  };
}

const dbPromise = openDB<SmartGalleryDB>('smart-gallery-db', 1, {
  upgrade(db) {
    const imgStore = db.createObjectStore('images', { keyPath: 'id' });
    imgStore.createIndex('by-category', 'category');
    db.createObjectStore('people', { keyPath: 'id' });
  },
});

// Keep track of created URLs to revoke them if needed (optional cleanup)
const createdUrls: string[] = [];

export const db = {
  async getImages() {
    const images = await (await dbPromise).getAll('images');
    // 🟢 HYDRATION: Convert Blobs back to URLs
    return images.map(img => {
      if (img.blob) {
        // If we have a blob, create a new URL for it
        const newUrl = URL.createObjectURL(img.blob);
        createdUrls.push(newUrl);
        return { ...img, url: newUrl };
      }
      return img;
    });
  },
  async addImage(image: GalleryImage) { return (await dbPromise).put('images', image); },
  async deleteImage(id: string) { return (await dbPromise).delete('images', id); },
  async deleteImages(ids: string[]) {
    const db = await dbPromise;
    const tx = db.transaction('images', 'readwrite');
    await Promise.all(ids.map(id => tx.store.delete(id)));
    await tx.done;
  },
  async updateImageCategory(id: string, cat: string) {
    const db = await dbPromise;
    const img = await db.get('images', id);
    if (img) {
      img.category = cat;
      await db.put('images', img);
    }
  },
  async getPeople() {
    const people = await (await dbPromise).getAll('people');
    return people.map(p => {
      if (p.blob) {
        const newUrl = URL.createObjectURL(p.blob);
        createdUrls.push(newUrl);
        return { ...p, avatarUrl: newUrl };
      }
      return p;
    });
  },
  async addPerson(person: Person) { return (await dbPromise).put('people', person); },
  async deletePerson(id: string) { return (await dbPromise).delete('people', id); }
};