import { pipeline } from '@huggingface/transformers';
import { CATEGORIES } from '@/types/gallery';

// Singleton
let classifier: any = null;

export async function classifyImage(imageUrl: string): Promise<{ category: string; confidence: number; rawLabels: string[] }> {
  try {
    // 1. Load the ResNet Model (Reliable & Good General Knowledge)
    if (!classifier) {
      console.log("🧠 Loading Smart Classifier...");
      // Using ResNet-50 for broad object recognition
      classifier = await pipeline('image-classification', 'Xenova/resnet-50');
    }

    // 2. Run Analysis
    const results = await classifier(imageUrl);

    // Get Top 10 Predictions (Increased from 5 for better recall)
    const topResults = results.slice(0, 10);
    const rawLabels = topResults.map((r: any) => r.label.toLowerCase());
    const topScore = topResults[0].score;

    console.log("AI Sees (Top 10):", rawLabels);

    // 3. PRIORITY MATCHING ALGORITHM

    let bestCategory = 'other';
    let currentBestPriority = 99; // Start high (worst priority)

    // Check every label the AI saw
    for (const label of rawLabels) {
      // Check every category definition
      for (const cat of CATEGORIES) {
        if (cat.id === 'other') continue;

        // Smart Match: Check if label contains keyword OR keyword contains label
        // Example: label "golden retriever" matches keyword "dog" (No, wait, we need specific keywords)
        // Correction: We rely on the expanded keyword list now.
        // We check: does the label include the keyword? 
        // e.g. label "sports car" includes keyword "car" -> MATCH
        // e.g. label "tabby cat" matches keyword "tabby" -> MATCH
        const isMatch = cat.keywords.some(keyword => {
          const labelWords = label.split(/[\s,]+/); // Split label into words
          // Check exact word match or substring
          return label.includes(keyword) || keyword.includes(label) || labelWords.includes(keyword);
        });

        if (isMatch) {
          // If we found a match, is it "more important" than what we already found?
          if (cat.priority < currentBestPriority) {
            bestCategory = cat.id;
            currentBestPriority = cat.priority;
          }
        }
      }
    }

    // 4. Special Override for Text/Screenshots (ResNet is bad at reading)
    if (rawLabels.some((l: string) => l.includes('web site') || l.includes('screen') || l.includes('paper') || l.includes('text'))) {
      // Only override if we didn't find a Person/Animal (Priority 1 or 2)
      if (currentBestPriority > 2) {
        bestCategory = 'document'; // High confidence document
        currentBestPriority = 6;
      }
    }

    // 5. Nature Bias Correction
    // If we only found Nature (Priority 10) but the top label is reasonably distinct (e.g., 'park bench'),
    // we stick with Nature unless the top label strongly suggests an object we missed.
    // (This step is implicit by the priority system, but good to note)

    console.log(`✅ Selected: ${bestCategory} (Priority Level: ${currentBestPriority})`);

    return {
      category: bestCategory,
      confidence: topScore,
      rawLabels: rawLabels
    };

  } catch (error) {
    console.warn("⚠️ Classification warning:", error);
    return { category: 'other', confidence: 0, rawLabels: [] };
  }
}