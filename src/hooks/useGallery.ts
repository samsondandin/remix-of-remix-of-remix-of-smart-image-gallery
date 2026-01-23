import { useState, useCallback, useEffect } from 'react';
import { classifyImage } from '@/services/imageClassifier';
import { getFaceEmbedding, getAllFaces, compareFaces, loadFaceModels } from '@/services/faceRecognition';
import { GalleryImage, Person } from '@/types/gallery';
import { db } from '@/utils/db'; 
import { toast } from 'sonner';

// ⚙️ TUNING (The Fixes)
const MATCH_MINIMUM = 0.38; // Lowered slightly to catch tough angles
// 🟢 CRITICAL FIX: If score > 0.40, we FORCE the match.
// Previous value (0.45) was too strict for your specific photo.
const MATCH_CERTAIN = 0.40; 

export function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [knownPeople, setKnownPeople] = useState<Person[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanningStatus, setScanningStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [imgs, ppl] = await Promise.all([db.getImages(), db.getPeople()]);
        setImages(imgs.sort((a,b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()));
        setKnownPeople(ppl);
      } catch (e) {
        console.error("DB Load Error:", e);
      }
    };
    loadData();
    loadFaceModels().catch(e => console.error("AI Init Failed:", e));
  }, []);

  const deleteImage = async (id: string) => {
    await db.deleteImage(id);
    setImages(prev => prev.filter(img => img.id !== id));
    toast.info("Image deleted");
  };

  const moveImage = async (id: string, cat: string) => {
    await db.updateImageCategory(id, cat);
    setImages(prev => prev.map(img => img.id === id ? { ...img, category: cat } : img));
    toast.success(`Moved to ${cat}`);
  };

  const registerPerson = async (name: string, file: File) => {
    setIsAnalyzing(true);
    setScanningStatus("Learning Face...");
    try {
      const url = await fileToDataUrl(file);
      const embedding = await getFaceEmbedding(url);
      
      const newPerson: Person = {
        id: name.toLowerCase().replace(/\s/g, '-'),
        name,
        embedding: Array.from(embedding),
        avatarUrl: url
      };

      await db.addPerson(newPerson);
      setKnownPeople(prev => [...prev, newPerson]);
      toast.success(`${name} registered!`);
    } catch (e: any) {
      toast.error("Register failed: " + e.message);
    } finally {
      setIsAnalyzing(false);
      setScanningStatus(null);
    }
  };

  // --- UPLOAD ENGINE ---
  const uploadImages = useCallback(async (files: File[]) => {
    setIsAnalyzing(true);
    setScanningStatus(`Processing ${files.length} Photos...`);
    
    try {
        const newImages: GalleryImage[] = [];
        
        for (const file of files) {
          if (!file.type.startsWith('image/')) continue;
          
          const ext = file.name.split('.').pop()?.toLowerCase();
          if (['cr2', 'nef', 'arw', 'dng'].includes(ext || '')) {
             toast.error(`Convert RAW file (${file.name}) to JPG first.`);
             continue; 
          }

          try {
              const url = await fileToDataUrl(file);
              
              // Validate
              await new Promise((resolve, reject) => {
                  const img = new Image();
                  img.onload = resolve;
                  img.onerror = () => reject(new Error("Corrupt File"));
                  img.src = url;
              });

              // 1. OBJECT DETECTION
              const objectResult = await classifyImage(url);
              let finalCategory = objectResult.category; 
              let detectedFaceBox = undefined;
              let matchedName = undefined;

              // 2. FACE DETECTION
              if (knownPeople.length > 0) {
                try {
                    const faces = await getAllFaces(url);
                    let globalBestScore = 0;
                    let globalBestPerson = null;
                    let globalBestBox = undefined;

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

                        if (bestMatchForFace) {
                            // SKIP IF TOO LOW
                            if (bestScoreForFace < MATCH_MINIMUM) continue; 

                            // 🟢 FORCE MATCH RULE (Score > 0.40)
                            // This guarantees your "tough" photo gets caught.
                            if (bestScoreForFace > MATCH_CERTAIN) {
                                if (bestScoreForFace > globalBestScore) {
                                    globalBestScore = bestScoreForFace;
                                    globalBestPerson = bestMatchForFace;
                                    globalBestBox = face.box;
                                }
                            }
                            // CONTEXT RULE (Score 0.38 - 0.40)
                            else if (['portrait', 'fashion', 'sports', 'other'].includes(finalCategory)) {
                                if (bestScoreForFace > globalBestScore) {
                                    globalBestScore = bestScoreForFace;
                                    globalBestPerson = bestMatchForFace;
                                    globalBestBox = face.box;
                                }
                            }
                        }
                    }

                    if (globalBestPerson) {
                        // FORCE OVERWRITE
                        finalCategory = globalBestPerson; 
                        detectedFaceBox = globalBestBox;
                        matchedName = globalBestPerson;
                    }

                } catch(e) { /* No faces */ }
              }

              const newImage: GalleryImage = {
                id: Math.random().toString(36).substring(7),
                url,
                filename: file.name,
                category: finalCategory,
                confidence: objectResult.confidence,
                rawLabels: objectResult.rawLabels,
                uploadedAt: new Date(),
                status: 'complete',
                faceBox: detectedFaceBox,
                matchedPersonName: matchedName
              };
              
              await db.addImage(newImage);
              newImages.push(newImage);

          } catch (error) {
              console.error(`Skipped ${file.name}`);
          }
        }
        
        setImages(prev => [...newImages, ...prev]);
        if (newImages.length > 0) toast.success(`Imported ${newImages.length} photos`);
        
    } finally {
        setIsAnalyzing(false);
        setScanningStatus(null);
    }
  }, [knownPeople]);

  return { images, knownPeople, registerPerson, uploadImages, deleteImage, moveImage, isAnalyzing, scanningStatus };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise(r => {
    const reader = new FileReader();
    reader.onload = e => r(e.target?.result as string);
    reader.readAsDataURL(file);
  });
}