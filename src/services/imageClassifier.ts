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
    
    // Get Top 5 Predictions (not just 1) to understand context
    const topResults = results.slice(0, 5); 
    const rawLabels = topResults.map((r: any) => r.label.toLowerCase());
    const topScore = topResults[0].score;
    
    console.log("AI Sees (Top 5):", rawLabels);

    // 3. PRIORITY MATCHING ALGORITHM
    // We look for matches in ALL top 5 labels.
    // If we find "Groom" (Person, Priority 1) and "Mosque" (Building, Priority 9),
    // we pick "Person" because 1 < 9.
    
    let bestCategory = 'other';
    let currentBestPriority = 99; // Start high (worst priority)

    // Check every label the AI saw
    for (const label of rawLabels) {
      // Check every category definition
      for (const cat of CATEGORIES) {
        if (cat.id === 'other') continue;

        // Does this label match a keyword? (e.g., label 'groom' matches keyword 'groom')
        const isMatch = cat.keywords.some(keyword => label.includes(keyword));

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
         bestCategory = 'document';
       }
    }

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