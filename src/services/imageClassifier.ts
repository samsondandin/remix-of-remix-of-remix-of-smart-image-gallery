import { pipeline } from '@huggingface/transformers';
import { CATEGORIES } from '@/types/gallery';

// Singleton
let classifier: any = null;

export async function classifyImage(imageUrl: string): Promise<{ category: string; confidence: number; rawLabels: string[] }> {
  try {
    // 1. Load Model (Only ResNet for speed, 98MB)
    if (!classifier) {
      console.log(" Loading Smart Classifier (ResNet)...");
      classifier = await pipeline('image-classification', 'Xenova/resnet-50');
    }

    // 2. Run Analysis
    const results = await classifier(imageUrl);

    // Get Top 10 Predictions
    const topResults = results.slice(0, 10);

    // Combine labels
    const rawLabels = topResults.map((r: any) => r.label.toLowerCase());

    // Best confidence score
    const topScore = topResults[0].score;

    // 3. PRIORITY MATCHING ALGORITHM
    let bestCategory = 'other';
    let currentBestPriority = 99; // Start high (worst priority)

    // Check every label the AI saw
    for (const label of rawLabels) {
      for (const cat of CATEGORIES) {
        if (cat.id === 'other') continue;

        const isMatch = cat.keywords.some(keyword => {
          const labelWords = label.split(/[\s,]+/);
          return label.includes(keyword) || keyword.includes(label) || labelWords.includes(keyword);
        });

        if (isMatch) {
          if (cat.priority < currentBestPriority) {
            bestCategory = cat.id;
            currentBestPriority = cat.priority;
          }
        }
      }
    }

    return {
      category: bestCategory,
      confidence: topScore,
      rawLabels: rawLabels
    };

  } catch (error) {
    console.warn("Classification warning:", error);
    return { category: 'other', confidence: 0, rawLabels: [] };
  }
}