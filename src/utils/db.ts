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

export const db = {
  async getImages() { return (await dbPromise).getAll('images'); },
  async addImage(image: GalleryImage) { return (await dbPromise).put('images', image); },
  async deleteImage(id: string) { return (await dbPromise).delete('images', id); },
  async updateImageCategory(id: string, cat: string) {
    const db = await dbPromise;
    const img = await db.get('images', id);
    if (img) {
      img.category = cat;
      await db.put('images', img);
    }
  },
  async getPeople() { return (await dbPromise).getAll('people'); },
  async addPerson(person: Person) { return (await dbPromise).put('people', person); },
  async deletePerson(id: string) { return (await dbPromise).delete('people', id); }
};