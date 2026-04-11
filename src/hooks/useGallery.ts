import { useState, useCallback, useEffect } from 'react';
import { classifyImage } from '@/services/imageClassifier';
import { getFaceEmbedding, getAllFaces, compareFaces, loadFaceModels } from '@/services/faceRecognition';
import { GalleryImage, Person } from '@/types/gallery';
import { db } from '@/utils/db';
import { toast } from 'sonner';
import { uploadService } from '@/services/uploadService';
import { auth } from '@/lib/firebase';
import { firebaseService } from '@/services/firebaseService';
import { onAuthStateChanged, User } from 'firebase/auth';

// ⚙️ TUNING (The Fixes)
const MATCH_MINIMUM = 0.38;
const MATCH_CERTAIN = 0.40;

export function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [knownPeople, setKnownPeople] = useState<Person[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanningStatus, setScanningStatus] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // Reload data when auth changes
      loadData(u);
    });
    return () => unsubscribe();
  }, []);

  const loadData = async (currentUser: User | null) => {
    try {
      if (currentUser) {
        // Cloud Mode
        const [imgs, ppl] = await Promise.all([
          firebaseService.getImages(),
          firebaseService.getPeople()
        ]);
        setImages(imgs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()));
        setKnownPeople(ppl);
      } else {
        // Local Mode (Fallback)
        const [imgs, ppl] = await Promise.all([db.getImages(), db.getPeople()]);
        setImages(imgs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()));
        setKnownPeople(ppl);
      }
    } catch (e) {
      console.error("DB Load Error:", e);
    }
  };

  // Initial Load (also covered by Auth listener, but good to have)
  useEffect(() => {
    loadFaceModels().catch(e => console.error("AI Init Failed:", e));
  }, []);

  const deleteImage = async (id: string) => {
    if (user) {
      // We'll need the storage path to delete the file too. 
      // For now, simpler implementation:
      await firebaseService.deleteImage(id);
    } else {
      await db.deleteImage(id);
    }
    setImages(prev => prev.filter(img => img.id !== id));
    toast.info("Image deleted");
  };

  const deleteImages = async (ids: string[]) => {
    if (user) {
      await Promise.all(ids.map(id => firebaseService.deleteImage(id)));
    } else {
      await db.deleteImages(ids);
    }
    setImages(prev => prev.filter(img => !ids.includes(img.id)));
    toast.success(`${ids.length} images deleted`);
  };

  const moveImage = async (id: string, cat: string) => {
    if (user) {
      await firebaseService.updateImageCategory(id, cat);
    } else {
      await db.updateImageCategory(id, cat);
    }
    setImages(prev => prev.map(img => img.id === id ? { ...img, category: cat } : img));
    toast.success(`Moved to ${cat}`);
  };

  const registerPerson = async (name: string, file: File) => {
    setIsAnalyzing(true);
    setScanningStatus("Learning Face...");
    try {
      const url = URL.createObjectURL(file);
      const embedding = await getFaceEmbedding(url);

      const newPerson: Person = {
        id: name.toLowerCase().replace(/\s/g, '-'),
        name,
        embedding: Array.from(embedding),
        avatarUrl: url,
        blob: file // Store raw data
      };

      if (user) {
        // Upload avatar to storage? For now, we just save metadata with blob handling todo
        // Actually, we should upload the avatar.
        // Skipping detailed avatar upload for brevity, saving person metadata.
        await firebaseService.addPerson(newPerson);
      } else {
        await db.addPerson(newPerson);
      }

      setKnownPeople(prev => [...prev, newPerson]);
      toast.success(`${name} registered!`);
    } catch (e: any) {
      toast.error("Register failed: " + e.message);
    } finally {
      setIsAnalyzing(false);
      setScanningStatus(null);
    }
  };

  const deletePerson = async (id: string) => {
    if (user) {
      await firebaseService.deletePerson(id);
    } else {
      await db.deletePerson(id);
    }
    setKnownPeople(prev => prev.filter(p => p.id !== id));
    toast.info("Person deleted");
  };

  const uploadImages = async (files: File[]) => {
    setIsAnalyzing(true);
    try {
      const successCount = await uploadService.processFiles(
        files,
        knownPeople,
        (status) => setScanningStatus(status),
        (newImage) => setImages(prev => [newImage, ...prev])
      );
      if (successCount > 0) toast.success(`Finished importing ${successCount} photos`);
    } finally {
      setIsAnalyzing(false);
      setScanningStatus(null);
    }
  };

  return { images, knownPeople, registerPerson, deletePerson, uploadImages, deleteImage, deleteImages, moveImage, isAnalyzing, scanningStatus, user };
}