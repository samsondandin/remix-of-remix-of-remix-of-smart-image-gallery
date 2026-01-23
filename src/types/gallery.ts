export interface Person {
  id: string;
  name: string;
  embedding: number[];
  avatarUrl: string;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  filename: string;
  category: string;
  confidence: number;
  rawLabels: string[];
  uploadedAt: Date;
  status: 'processing' | 'complete' | 'error';
  faceBox?: Box;
  matchedPersonName?: string;
}

// 🛡️ RE-ORDERED PRIORITIES
// Lower Number = The category grabs the photo FIRST.
export const CATEGORIES = [
  // 1. PEOPLE (Always First)
  {
    id: 'portrait',
    label: 'People',
    icon: '👤',
    color: 'bg-red-500',
    priority: 1,
    keywords: [
      'person', 'man', 'woman', 'girl', 'boy', 'human', 'selfie', 'smile', 'face',
      'groom', 'bride', 'couple', 'child', 'baby', 'tuxedo', 'gown', 'suit',
      'model', 'crowd', 'player', 'athlete', 'gentleman', 'lady', 'portrait',
      'kimono', 'abaya', 'sari', 'traditional', 'robe', 'costume', 'uniform',
      'police', 'doctor', 'nurse', 'worker', 'actor', 'singer', 'artist',
      'hair', 'beard', 'mustache', 'sunglasses', 'eyeglasses', 'spectacles',
      'wig', 'mask', 'makeup', 'body', 'hand', 'foot', 'miniskirt', 'bikini',
      'lab coat', 'academic gown', 'swimming trunks', 'maillot'
    ]
  },

  // 2. ANIMALS
  {
    id: 'animal',
    label: 'Animals',
    icon: '🐾',
    color: 'bg-orange-500',
    priority: 2,
    keywords: [
      'dog', 'cat', 'bird', 'horse', 'pet', 'wildlife', 'fish', 'puppy',
      'kitten', 'terrier', 'retriever', 'animal', 'mammal', 'beagle', 'husky',
      'lion', 'tiger', 'giraffe', 'elephant', 'zoo', 'bear', 'zebra', 'monkey',
      'ape', 'gorilla', 'panda', 'wolf', 'fox', 'rabbit', 'hamster', 'mouse',
      'rat', 'squirrel', 'deer', 'moose', 'cow', 'cattle', 'sheep', 'goat',
      'pig', 'chicken', 'duck', 'goose', 'swan', 'eagle', 'hawk', 'owl',
      'parrot', 'penguin', 'whale', 'dolphin', 'shark', 'reptile', 'snake',
      'lizard', 'frog', 'turtle', 'insect', 'butterfly', 'bee', 'spider',
      // Specific breeds/types common in ImageNet
      'chihuahua', 'spaniel', 'setter', 'pointer', 'collie', 'sheepdog', 'poodle',
      'schnauzer', 'bulldog', 'pug', 'mastiff', 'corgi', 'whippet', 'tabby',
      'siamese', 'persian', 'cougar', 'lynx', 'leopard', 'cheetah', 'jaguar',
      'ostrich', 'magpie', 'robin', 'bulfinch', 'jay', 'hen', 'rooster', 'crab',
      'lobster', 'starfish', 'jellyfish', 'ant', 'fly', 'mosquito', 'beetle'
    ]
  },

  // 3. FOOD
  {
    id: 'food',
    label: 'Food',
    icon: '🍽️',
    color: 'bg-purple-500',
    priority: 3,
    keywords: [
      'food', 'fruit', 'vegetable', 'dish', 'plate', 'meat', 'drink', 'coffee',
      'pizza', 'burger', 'cake', 'bakery', 'bread', 'latte', 'espresso', 'wine',
      'beer', 'cocktail', 'ice cream', 'chocolate', 'soup', 'salad', 'breakfast',
      'lunch', 'dinner', 'meal', 'snack', 'dessert', 'pie', 'cookie', 'donut',
      'pasta', 'noodle', 'rice', 'sushi', 'steak', 'chicken', 'pork', 'beef',
      'tomato', 'potato', 'onion', 'carrot', 'pepper', 'corn', 'bean', 'nut',
      'apple', 'banana', 'orange', 'grape', 'berry', 'lemon', 'lime', 'juice',
      'tea', 'water', 'bottle', 'cup', 'glass', 'mug', 'fork', 'spoon', 'knife',
      // Specific dishes/items
      'cheeseburger', 'hotdog', 'sandwich', 'bagel', 'pretzel', 'burrito', 'taco',
      'spaghetti', 'carbonara', 'lasagna', 'broccoli', 'cauliflower', 'zucchini',
      'cucumber', 'pumpkin', 'squash', 'mushroom', 'strawberry', 'pineapple',
      'pomegranate', 'fig', 'custard', 'trifle', 'guacamole', 'salsa'
    ]
  },

  // 4. VEHICLES
  {
    id: 'vehicle',
    label: 'Vehicles',
    icon: '🚗',
    color: 'bg-blue-500',
    priority: 4,
    keywords: [
      'car', 'truck', 'bus', 'bicycle', 'train', 'airplane', 'boat', 'wheel',
      'motorcycle', 'vehicle', 'sedan', 'suv', 'convertible', 'scooter', 'yacht',
      'ship', 'drive', 'driver', 'cockpit', 'van', 'jeep', 'taxi', 'limo',
      'ambulance', 'police car', 'fire truck', 'tractor', 'helicopter', 'jet',
      'rocket', 'bike', 'skates', 'skateboard', 'tire', 'bumper', 'traffic',
      // Specifics
      'minivan', 'trolley', 'tram', 'subway', 'liner', 'cruise', 'canoe', 'kayak',
      'raft', 'barrow', 'cart', 'moped', 'snowmobile', 'plow', 'trailer', 'cab',
      'gondola', 'airliner', 'biplane', 'warplane', 'catamaran', 'trimaran'
    ]
  },

  // 5. ARCHITECTURE
  {
    id: 'architecture',
    label: 'Buildings',
    icon: '🏛️',
    color: 'bg-amber-600',
    priority: 5,
    keywords: [
      'building', 'house', 'bridge', 'tower', 'city', 'street', 'room', 'window',
      'door', 'mosque', 'church', 'temple', 'palace', 'castle', 'skyscraper',
      'vault', 'roof', 'wall', 'floor', 'stairs', 'furniture', 'chair', 'table',
      'bed', 'sofa', 'lamp', 'kitchen', 'bathroom', 'bedroom', 'office', 'school',
      'hospital', 'shop', 'store', 'market', 'hotel', 'monument', 'ruin',
      'structure', 'construction', 'apartment', 'flat', 'mall', 'staircase',
      'arch', 'column', 'pillar', 'gate', 'fence', 'barn', 'shed', 'factory',
      'library', 'museum', 'theater', 'cinema', 'restaurant', 'cafe', 'bar',
      'gym', 'stadium', 'arena', 'pavilion', 'greenhouse', 'lighthouse', 'pier',
      'dock', 'dam', 'pyramid', 'shrine', 'altar', 'monastery'
    ]
  },

  // 6. DOCUMENTS
  {
    id: 'document',
    label: 'Documents',
    icon: '📄',
    color: 'bg-slate-500',
    priority: 6,
    keywords: [
      'text', 'paper', 'screenshot', 'invoice', 'receipt', 'book', 'letter',
      'sign', 'poster', 'menu', 'page', 'writing', 'document', 'pdf', 'note',
      'chart', 'graph', 'diagram', 'map', 'blueprint', 'newspaper', 'magazine',
      'card', 'id', 'passport', 'license', 'ticket', 'label', 'logo', 'brand',
      'banner', 'billboard', 'screen', 'monitor', 'display', 'website', 'web',
      'envelope', 'binder', 'folder', 'notebook', 'comic', 'novel'
    ]
  },

  // 7. FASHION
  {
    id: 'fashion',
    label: 'Fashion',
    icon: '👗',
    color: 'bg-pink-500',
    priority: 7,
    keywords: [
      'dress', 'shirt', 'shoe', 'bag', 'glasses', 'watch', 'clothing', 'uniform',
      'jacket', 'hat', 'sneaker', 'boot', 'heels', 'purse', 'sunglasses', 'necklace',
      'jewelry', 'ring', 'earring', 'bracelet', 'pants', 'jeans', 'trousers',
      'skirt', 'coat', 'sweater', 'hoodie', 't-shirt', 'vest', 'suit', 'tie',
      'scarf', 'gloves', 'socks', 'underwear', 'bikini', 'swimsuit', 'makeup',
      'lipstick', 'perfume', 'fashion', 'style', 'model', 'gown', 'cloak',
      'poncho', 'cardigan', 'blazer', 'blouse', 'top', 'shorts', 'cap', 'helmet',
      'belt', 'wallet', 'backpack', 'tote', 'clutch'
    ]
  },

  // 8. SPORTS
  {
    id: 'sports',
    label: 'Sports',
    icon: '⚽',
    color: 'bg-emerald-600',
    priority: 8,
    keywords: [
      'ball', 'stadium', 'gym', 'racket', 'team', 'match', 'sport', 'tennis',
      'soccer', 'basketball', 'football', 'baseball', 'jersey', 'court', 'field',
      'volleyball', 'golf', 'hockey', 'cricket', 'rugby', 'swimming', 'running',
      'boxing', 'martial arts', 'skiing', 'snowboard', 'surf', 'skate', 'cycle',
      'fitness', 'workout', 'exercise', 'yoga', 'medal', 'trophy', 'racquet',
      'bat', 'club', 'puck', 'net', 'goal', 'hoop', 'ring', 'pitch', 'pool',
      'track', 'race', 'marathon', 'sprint', 'jump', 'throw', 'catch', 'kick'
    ]
  },

  // 9. TECH
  {
    id: 'tech',
    label: 'Tech',
    icon: '💻',
    color: 'bg-cyan-600',
    priority: 9,
    keywords: [
      'computer', 'phone', 'screen', 'keyboard', 'laptop', 'monitor', 'electronic',
      'technology', 'mouse', 'tablet', 'camera', 'tv', 'television', 'radio',
      'speaker', 'headphone', 'robot', 'drone', 'game', 'console', 'keyboard',
      'battery', 'charger', 'cable', 'wifi', 'internet', 'code', 'data',
      'server', 'hardware', 'software', 'desktop', 'notebook', 'smartphone',
      'cellphone', 'mobile', 'gadget', 'device', 'printer', 'scanner', 'router',
      'modem', 'microchip', 'circuit', 'processor', 'lens', 'tripod', 'flash'
    ]
  },

  // 10. NATURE (Demoted to last specific category)
  {
    id: 'nature',
    label: 'Nature',
    icon: '🌿',
    color: 'bg-green-500',
    priority: 10,
    keywords: [
      'tree', 'flower', 'grass', 'forest', 'mountain', 'river', 'sky', 'plant',
      'garden', 'sun', 'cloud', 'beach', 'lake', 'sea', 'ocean', 'sand', 'landscape',
      'rock', 'stone', 'hill', 'valley', 'desert', 'snow', 'ice', 'rain', 'storm',
      'sunset', 'sunrise', 'moon', 'star', 'leaf', 'bush', 'park', 'nature',
      'waterfall', 'cave', 'volcano', 'cliff', 'coast', 'shore', 'island', 'reef',
      'coral', 'glacier', 'canyon', 'dune', 'field', 'meadow', 'pasture', 'pond',
      'stream', 'creek', 'spring', 'geyser', 'daisy', 'rose', 'tulip', 'lily',
      'orchid', 'sunflower', 'pine', 'oak', 'maple', 'palm', 'cactus', 'fern',
      'moss', 'vine', 'weed', 'bloom', 'blossom', 'petal', 'stem', 'root'
    ]
  },

  // Fallback
  { id: 'other', label: 'Other', icon: '📦', color: 'bg-gray-400', priority: 11, keywords: [] }
];

export type Category = typeof CATEGORIES[number]['id'];