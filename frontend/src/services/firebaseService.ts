import { storage, db, auth } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc, Timestamp, setDoc } from 'firebase/firestore';
import { GalleryImage, Person } from '@/types/gallery';

export const firebaseService = {
    // --- STORAGE ---
    async uploadFile(file: File, path: string): Promise<string> {
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    },

    async deleteFile(path: string) {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
    },

    // --- FIRESTORE: IMAGES ---
    async addImage(image: GalleryImage) {
        if (!auth.currentUser) throw new Error("User not authenticated");

        // We don't save the Blob in Firestore, obviously.
        // We exclude 'blob' and ensure 'uploadedAt' is a Timestamp
        const { blob, uploadedAt, ...imageData } = image;

        await setDoc(doc(db, 'images', image.id), {
            ...imageData,
            userId: auth.currentUser.uid, // Security: Link to user
            uploadedAt: Timestamp.fromDate(uploadedAt),
            storagePath: `images/${auth.currentUser.uid}/${image.id}_${image.filename}`
        });
    },

    async getImages(): Promise<GalleryImage[]> {
        if (!auth.currentUser) return [];

        const q = query(
            collection(db, 'images'),
            where('userId', '==', auth.currentUser.uid)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                uploadedAt: (data.uploadedAt as Timestamp).toDate(),
                // Note: URL is already a download URL from Storage
            } as GalleryImage;
        });
    },

    async deleteImage(id: string, storagePath?: string) {
        await deleteDoc(doc(db, 'images', id));
        if (storagePath) {
            await this.deleteFile(storagePath);
        }
    },

    async updateImageCategory(id: string, category: string) {
        const imgRef = doc(db, 'images', id);
        await updateDoc(imgRef, { category });
    },

    // --- FIRESTORE: PEOPLE ---
    async addPerson(person: Person) {
        if (!auth.currentUser) throw new Error("No user");
        const userRef = doc(db, 'users', auth.currentUser.uid, 'people', person.id);

        // Remove Blob before saving to Firestore
        const { blob, avatarUrl, ...personData } = person;
        await setDoc(userRef, personData);
    },

    async deletePerson(personId: string) {
        if (!auth.currentUser) throw new Error("No user");
        const userRef = doc(db, 'users', auth.currentUser.uid, 'people', personId);
        await deleteDoc(userRef);
    },

    async getPeople(): Promise<Person[]> {
        if (!auth.currentUser) return [];

        const q = query(
            collection(db, 'people'),
            where('userId', '==', auth.currentUser.uid)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Person);
    }
};
