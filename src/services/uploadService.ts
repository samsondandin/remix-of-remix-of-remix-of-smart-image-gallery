import { classifyImage } from '@/services/imageClassifier';
import { getAllFaces, compareFaces } from '@/services/faceRecognition';
import { GalleryImage, Person } from '@/types/gallery';
import { db } from '@/utils/db'; // Keep for fallback or offline?
import { firebaseService } from '@/services/firebaseService';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { compressImage } from '@/utils/imageCompression';

// Tuning Constants
const MATCH_MINIMUM = 0.38;

type ProgressCallback = (status: string) => void;
type ImageProcessedCallback = (image: GalleryImage) => void;

export const uploadService = {
    async processFiles(
        files: File[],
        knownPeople: Person[],
        onProgress: ProgressCallback,
        onImageProcessed: ImageProcessedCallback
    ): Promise<number> {

        let successCount = 0;
        const total = files.length;
        const BATCH_SIZE = 1; // Firebase concurrent uploads might need throttling

        const user = auth.currentUser;

        for (let i = 0; i < total; i += BATCH_SIZE) {
            const batch = files.slice(i, i + BATCH_SIZE);

            await Promise.all(batch.map(async (rawFile, batchIndex) => {
                // Yield to main thread to keep UI responsive
                await new Promise(resolve => setTimeout(resolve, 50));

                const globalIndex = i + batchIndex;
                onProgress(`Processing ${globalIndex + 1}/${total}: ${rawFile.name.substring(0, 15)}...`);

                if (!rawFile.type.startsWith('image/')) return;

                const ext = rawFile.name.split('.').pop()?.toLowerCase();
                if (['cr2', 'nef', 'arw', 'dng'].includes(ext || '')) {
                    toast.error(`Convert RAW file (${rawFile.name}) to JPG first.`);
                    return;
                }

                try {
                    // COMPRESSION
                    onProgress(`Compressing ${rawFile.name}...`);
                    const file = await compressImage(rawFile, 1920, 1920, 0.8);

                    // 1. ANALYSIS (Local)
                    // We still analyze locally to avoid downloading it back again immediately
                    const objectUrl = URL.createObjectURL(file);

                    const objectResult = await classifyImage(objectUrl);
                    let finalCategory = objectResult.category;
                    let detectedFaceBox = undefined;
                    let matchedName = undefined;

                    // Face Detection
                    if (knownPeople.length > 0) {
                        try {
                            const faces = await getAllFaces(objectUrl);
                            // ... (Face matching logic remains the same) ...
                            const matchedNamesSet = new Set<string>();
                            let bestBox = undefined;
                            let highestScore = 0;

                            for (const face of faces) {
                                let bestMatchForFace = null;
                                let bestScoreForFace = 0;

                                for (const person of knownPeople) {
                                    const score = compareFaces(person.embedding, face.descriptor);
                                    if (score > bestScoreForFace) {
                                        bestScoreForFace = score;
                                        bestMatchForFace = person.name;
                                    }
                                }

                                if (bestMatchForFace && bestScoreForFace >= MATCH_MINIMUM) {
                                    matchedNamesSet.add(bestMatchForFace);
                                    if (bestScoreForFace > highestScore) {
                                        highestScore = bestScoreForFace;
                                        bestBox = face.box;
                                    }
                                }
                            }

                            if (matchedNamesSet.size > 0) {
                                matchedName = Array.from(matchedNamesSet).join('|');
                                finalCategory = matchedName;
                                detectedFaceBox = bestBox;
                            }
                        } catch (e) { /* No faces */ }
                    }

                    let newImage: GalleryImage;

                    if (user) {
                        // CLOUD MODE
                        // Generate ID
                        const id = Math.random().toString(36).substring(7);
                        const storagePath = `images/${user.uid}/${id}_${file.name}`;

                        onProgress(`Uploading ${file.name}...`);
                        const downloadUrl = await firebaseService.uploadFile(file, storagePath);

                        newImage = {
                            id: id,
                            url: downloadUrl, // Cloud URL
                            // blob: file, // Don't save blob for Firestore
                            filename: file.name,
                            category: finalCategory,
                            confidence: objectResult.confidence,
                            rawLabels: objectResult.rawLabels,
                            uploadedAt: new Date(),
                            status: 'complete',
                            faceBox: detectedFaceBox,
                            matchedPersonName: matchedName
                        };
                        // 3. SAVE METADATA (Cloud)
                        await firebaseService.addImage(newImage);

                    } else {
                        // GUEST MODE (Local)
                        newImage = {
                            id: Math.random().toString(36).substring(7),
                            url: objectUrl,
                            blob: file, // Store raw data locally
                            filename: file.name,
                            category: finalCategory,
                            confidence: objectResult.confidence,
                            rawLabels: objectResult.rawLabels,
                            uploadedAt: new Date(),
                            status: 'complete',
                            faceBox: detectedFaceBox,
                            matchedPersonName: matchedName
                        };
                        // 3. SAVE METADATA (Local)
                        await db.addImage(newImage);
                    }

                    // Callback to update UI
                    onImageProcessed(newImage);
                    successCount++;

                } catch (error) {
                    console.error(`Skipped ${rawFile.name}`, error);
                    toast.error(`Failed to upload ${rawFile.name}`);
                }
            }));
        }

        return successCount;
    }
};
