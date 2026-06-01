import { pipeline } from '@huggingface/transformers';

let detector: any = null;

export async function loadFaceDetector() {
  if (detector) return detector;
  detector = await pipeline('object-detection', 'Xenova/detr-resnet-50');
  return detector;
}

// CRITICAL: Ensure 'export' is here
export async function detectFaces(imageUrl: string) {
  const model = await loadFaceDetector();
  const results = await model(imageUrl);
  const persons = results.filter((r: any) => r.label === 'person' && r.score > 0.7);
  return {
    hasFaces: persons.length > 0,
    faceCount: persons.length
  };
}