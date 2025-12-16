export type Category = 
  | 'portrait'
  | 'animal'
  | 'vehicle'
  | 'landscape'
  | 'document'
  | 'food'
  | 'architecture'
  | 'other';

export interface ClassificationResult {
  label: string;
  score: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  filename: string;
  category: Category;
  confidence: number;
  rawLabels: ClassificationResult[];
  uploadedAt: Date;
  width?: number;
  height?: number;
  faceCount?: number;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  icon: string;
  keywords: string[];
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'portrait',
    label: 'Portraits',
    icon: '👤',
    keywords: ['person', 'face', 'man', 'woman', 'boy', 'girl', 'people', 'human', 'portrait', 'selfie', 'head']
  },
  {
    id: 'animal',
    label: 'Animals',
    icon: '🐾',
    keywords: ['dog', 'cat', 'bird', 'animal', 'pet', 'wildlife', 'fish', 'horse', 'cow', 'sheep', 'elephant', 'tiger', 'lion', 'bear', 'monkey', 'rabbit', 'mouse', 'snake', 'turtle', 'frog']
  },
  {
    id: 'vehicle',
    label: 'Vehicles',
    icon: '🚗',
    keywords: ['car', 'truck', 'bus', 'motorcycle', 'bicycle', 'plane', 'boat', 'ship', 'train', 'vehicle', 'aircraft', 'helicopter', 'van', 'taxi']
  },
  {
    id: 'landscape',
    label: 'Landscapes',
    icon: '🏞️',
    keywords: ['mountain', 'beach', 'ocean', 'sea', 'lake', 'river', 'forest', 'desert', 'sky', 'sunset', 'sunrise', 'nature', 'landscape', 'cliff', 'valley', 'waterfall', 'field']
  },
  {
    id: 'document',
    label: 'Documents',
    icon: '📄',
    keywords: ['document', 'paper', 'text', 'book', 'letter', 'envelope', 'newspaper', 'magazine', 'notebook', 'menu', 'receipt', 'screen', 'monitor', 'laptop', 'computer']
  },
  {
    id: 'food',
    label: 'Food',
    icon: '🍽️',
    keywords: ['food', 'meal', 'dish', 'pizza', 'burger', 'cake', 'fruit', 'vegetable', 'drink', 'coffee', 'bread', 'salad', 'soup', 'dessert', 'ice cream', 'sandwich']
  },
  {
    id: 'architecture',
    label: 'Architecture',
    icon: '🏛️',
    keywords: ['building', 'house', 'church', 'castle', 'bridge', 'tower', 'skyscraper', 'monument', 'temple', 'palace', 'stadium', 'museum', 'hotel', 'office']
  },
  {
    id: 'other',
    label: 'Other',
    icon: '📦',
    keywords: []
  }
];
