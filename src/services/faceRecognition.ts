import * as faceapi from '@vladmandic/face-api';
import { Box } from '@/types/gallery';

const MODEL_URL = 'https://vladmandic.github.io/face-api/model/';
let isModelLoaded = false;
let modelLoadPromise: Promise<void> | null = null;

export interface FaceResult {
  descriptor: Float32Array;
  box: Box;
}

export async function loadFaceModels() {
  if (isModelLoaded) return;
  if (modelLoadPromise) return modelLoadPromise;

  modelLoadPromise = (async () => {
    try {
      console.log("🧠 Starting AI...");
      const tf = (faceapi as any).tf;
      try { await tf.setBackend('webgl'); await tf.ready(); }
      catch (e) { await tf.setBackend('cpu'); await tf.ready(); }

      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);

      isModelLoaded = true;
      console.log("✅ AI Ready (High Accuracy Mode)");
    } catch (error: any) {
      console.error("❌ AI Init Failed:", error);
      throw new Error("AI failed to load.");
    }
  })();

  return modelLoadPromise;
}

// 1. REGISTRATION (Standard Scan)
export async function getFaceEmbedding(imageUrl: string): Promise<Float32Array> {
  if (!isModelLoaded) await loadFaceModels();
  const img = await faceapi.fetchImage(imageUrl);

  // 🟢 UPGRADE: Use SSD MobileNet for registration too
  // minConfidence 0.5 for registration to ensure quality
  const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
  const detections = await faceapi.detectAllFaces(img, options)
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (detections.length === 0) throw new Error("No face found. Use a clear selfie.");

  // Return largest face
  return detections.sort((a, b) => b.detection.box.area - a.detection.box.area)[0].descriptor;
}

// 2. GROUP SCAN (High-Res Scan for Groups)
export async function getAllFaces(imageUrl: string): Promise<FaceResult[]> {
  if (!isModelLoaded) await loadFaceModels();
  const img = await faceapi.fetchImage(imageUrl);

  // 🟢 CRITICAL: SSD MobileNet finds tough faces (side profile, beard, etc)
  const detections = await faceapi.detectAllFaces(img, new faceapi.SsdMobilenetv1Options({
    minConfidence: 0.2 // Low confidence to catch everything
  }))
    .withFaceLandmarks()
    .withFaceDescriptors();

  return detections.map(d => ({
    descriptor: d.descriptor,
    box: {
      x: d.detection.box.x,
      y: d.detection.box.y,
      width: d.detection.box.width,
      height: d.detection.box.height
    }
  }));
}

export function compareFaces(descriptor1: Float32Array | number[], descriptor2: Float32Array | number[]): number {
  if (!descriptor1 || !descriptor2) return 0;
  return Math.max(0, 1 - faceapi.euclideanDistance(descriptor1, descriptor2));
}