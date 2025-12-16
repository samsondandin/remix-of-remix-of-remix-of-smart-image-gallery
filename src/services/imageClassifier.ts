import { pipeline } from '@huggingface/transformers';
import { Category, ClassificationResult, CATEGORIES } from '@/types/gallery';
import { detectFaces, loadFaceDetector } from './faceDetector';

let classifier: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

export async function loadClassifier(
  onProgress?: (progress: number, status: string) => void
): Promise<any> {
  if (classifier) return classifier;
  
  if (loadPromise) return loadPromise;
  
  isLoading = true;
  onProgress?.(0, 'Loading AI models...');
  
  // Load both models in parallel
  const classifierPromise = pipeline(
    'image-classification',
    'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k',
    {
      progress_callback: (progress: any) => {
        if (progress.status === 'progress' && progress.progress) {
          onProgress?.(Math.round(progress.progress * 0.5), 'Downloading classifier...');
        }
      }
    }
  );
  
  const faceDetectorPromise = loadFaceDetector((progress, status) => {
    onProgress?.(50 + Math.round(progress * 0.5), status);
  });
  
  loadPromise = Promise.all([classifierPromise, faceDetectorPromise]).then(([c]) => c);
  
  try {
    classifier = await loadPromise;
    isLoading = false;
    onProgress?.(100, 'Models ready!');
    return classifier;
  } catch (error) {
    loadPromise = null;
    isLoading = false;
    throw error;
  }
}

export function isClassifierLoading(): boolean {
  return isLoading;
}

export function isClassifierReady(): boolean {
  return classifier !== null;
}

export async function classifyImage(
  imageUrl: string
): Promise<{ category: Category; confidence: number; rawLabels: ClassificationResult[]; faceCount: number }> {
  const model = await loadClassifier();
  
  // Run classification and face detection in parallel
  const [classificationResults, faceResults] = await Promise.all([
    model(imageUrl, { topk: 5 }) as Promise<ClassificationResult[]>,
    detectFaces(imageUrl)
  ]);
  
  // If faces/people detected, prioritize portrait category
  if (faceResults.hasFaces) {
    return {
      category: 'portrait',
      confidence: Math.max(faceResults.detections[0]?.score || 0.8, classificationResults[0]?.score || 0),
      rawLabels: classificationResults,
      faceCount: faceResults.faceCount
    };
  }
  
  // Otherwise use standard classification
  const category = mapLabelsToCategory(classificationResults);
  const confidence = classificationResults[0]?.score || 0;
  
  return {
    category,
    confidence,
    rawLabels: classificationResults,
    faceCount: 0
  };
}

function mapLabelsToCategory(labels: ClassificationResult[]): Category {
  const allLabelsText = labels.map(l => l.label.toLowerCase()).join(' ');
  
  for (const cat of CATEGORIES) {
    if (cat.id === 'other') continue;
    
    for (const keyword of cat.keywords) {
      if (allLabelsText.includes(keyword.toLowerCase())) {
        return cat.id;
      }
    }
  }
  
  return 'other';
}

export function getCategoryColor(category: Category): string {
  const colors: Record<Category, string> = {
    portrait: 'bg-category-portrait',
    animal: 'bg-category-animal',
    vehicle: 'bg-category-vehicle',
    landscape: 'bg-category-landscape',
    document: 'bg-category-document',
    food: 'bg-category-food',
    architecture: 'bg-category-architecture',
    other: 'bg-category-other'
  };
  return colors[category];
}

export function getCategoryBorderColor(category: Category): string {
  const colors: Record<Category, string> = {
    portrait: 'border-category-portrait',
    animal: 'border-category-animal',
    vehicle: 'border-category-vehicle',
    landscape: 'border-category-landscape',
    document: 'border-category-document',
    food: 'border-category-food',
    architecture: 'border-category-architecture',
    other: 'border-category-other'
  };
  return colors[category];
}
