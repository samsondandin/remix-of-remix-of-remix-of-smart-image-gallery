import { pipeline } from '@huggingface/transformers';

let detector: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

export async function loadFaceDetector(
  onProgress?: (progress: number, status: string) => void
): Promise<any> {
  if (detector) return detector;
  
  if (loadPromise) return loadPromise;
  
  isLoading = true;
  onProgress?.(0, 'Loading face detection model...');
  
  loadPromise = pipeline(
    'object-detection',
    'Xenova/detr-resnet-50',
    {
      progress_callback: (progress: any) => {
        if (progress.status === 'progress' && progress.progress) {
          onProgress?.(Math.round(progress.progress), 'Downloading face detector...');
        } else if (progress.status === 'ready') {
          onProgress?.(100, 'Face detector ready!');
        }
      }
    }
  );
  
  try {
    detector = await loadPromise;
    isLoading = false;
    return detector;
  } catch (error) {
    loadPromise = null;
    isLoading = false;
    throw error;
  }
}

export function isFaceDetectorLoading(): boolean {
  return isLoading;
}

export function isFaceDetectorReady(): boolean {
  return detector !== null;
}

export interface DetectionResult {
  label: string;
  score: number;
  box: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

export async function detectFaces(imageUrl: string): Promise<{
  hasFaces: boolean;
  faceCount: number;
  detections: DetectionResult[];
}> {
  const model = await loadFaceDetector();
  
  const results = await model(imageUrl) as DetectionResult[];
  
  // Filter for person detections (DETR detects "person" which includes faces)
  const personDetections = results.filter(
    (r) => r.label.toLowerCase() === 'person' && r.score > 0.7
  );
  
  return {
    hasFaces: personDetections.length > 0,
    faceCount: personDetections.length,
    detections: personDetections
  };
}
