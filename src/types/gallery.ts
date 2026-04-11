
export interface Person {
  id: string;
  name: string;
  embedding: number[];
  avatarUrl: string;
  blob?: Blob; // Store avatar as blob
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
  blob?: Blob; // Store original file blob instead of huge base64 string
  filename: string;
  category: string;
  confidence: number;
  rawLabels: string[];
  uploadedAt: Date;
  status: 'processing' | 'complete' | 'error';
  faceBox?: Box;
  matchedPersonName?: string;
}

// Lower Number = The category grabs the photo FIRST.
export const CATEGORIES = [
  // 1. PEOPLE (Priority 1: User Request - "Main Priority")
  {
    id: 'portrait',
    label: 'People',
    icon: '🧑',
    color: 'bg-red-500',
    priority: 1,
    keywords: [
      'person', 'man', 'woman', 'girl', 'boy', 'human', 'selfie', 'smile', 'face',
      'groom', 'bride', 'couple', 'child', 'baby', 'tuxedo', 'gown', 'suit',
      'model', 'crowd', 'player', 'athlete', 'gentleman', 'lady', 'portrait',
      'kimono', 'abaya', 'sari', 'traditional', 'robe', 'costume', 'uniform',
      'police', 'doctor', 'nurse', 'worker', 'actor', 'singer', 'artist',
      'hair', 'beard', 'mustache', 'sunglasses', 'eyeglasses', 'spectacles',
      'wig', 'mask', 'makeup', 'miniskirt', 'bikini',
      'lab coat', 'academic gown', 'swimming trunks', 'maillot', 'jersey',
      'skier', 'swimmer', 'dancer', 'teacher', 'student', 'graduate', 'soldier', 'officer', 'guard',
      'musician', 'guitarist', 'drummer', 'pianist',
      'shirt', 'pants', 'dress', 'jacket', 'coat', 'shoe', 'hat', 'vest',
      'sweater', 'hoodie', 't-shirt', 'jeans', 'skirt', 'shorts', 'scarf', 'gloves',
      'boots', 'sneakers', 'heels', 'sandals', 'cap', 'tie', 'bowtie', 'cloak',
      'cape', 'pyjama', 'sock', 'stocking', 'legging', 'bra', 'underwear',
      'hand', 'finger', 'thumb', 'fist'
    ]
  },

  // 2. VEHICLES (Priority 2)
  {
    id: 'vehicle',
    label: 'Vehicles',
    icon: '🚗',
    color: 'bg-blue-500',
    priority: 2,
    keywords: [
      'car', 'truck', 'bus', 'bicycle', 'train', 'airplane', 'boat', 'wheel',
      'motorcycle', 'vehicle', 'sedan', 'suv', 'convertible', 'scooter', 'yacht',
      'ship', 'drive', 'driver', 'cockpit', 'van', 'jeep', 'taxi', 'limo',
      'ambulance', 'police car', 'fire truck', 'tractor', 'helicopter', 'jet',
      'rocket', 'bike', 'skates', 'skateboard', 'tire', 'bumper', 'traffic',
      'minivan', 'trolley', 'tram', 'subway', 'liner', 'cruise', 'canoe', 'kayak',
      'raft', 'barrow', 'cart', 'moped', 'snowmobile', 'plow', 'trailer', 'cab',
      'gondola', 'airliner', 'biplane', 'warplane', 'catamaran', 'trimaran',
      'automobile', 'transport', 'ferry',
      'engine', 'motor', 'machine', 'tank', 'submarine', 'spaceship', 'blimp',
      'balloon', 'glider', 'parachute', 'drone', 'robot', 'crane', 'bulldozer',
      'excavator', 'forklift', 'mixer', 'loader', 'roller', 'grader', 'harvester'
    ]
  },

  // 3. ANIMALS (Priority 2)
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
      'chihuahua', 'spaniel', 'setter', 'pointer', 'collie', 'sheepdog', 'poodle',
      'schnauzer', 'bulldog', 'pug', 'mastiff', 'corgi', 'whippet', 'tabby',
      'siamese', 'persian', 'cougar', 'lynx', 'leopard', 'cheetah', 'jaguar',
      'ostrich', 'magpie', 'robin', 'bulfinch', 'jay', 'hen', 'rooster', 'crab',
      'lobster', 'starfish', 'jellyfish', 'ant', 'fly', 'mosquito', 'beetle',
      'snail', 'slug', 'worm', 'clam', 'oyster', 'mussel', 'octopus', 'squid',
      'shrimp', 'prawn', 'crustacean', 'amphibian', 'salamander', 'newt', 'toad',
      'crocodile', 'alligator', 'dinosaur', 'dragon', 'unicorn', 'monster'
    ]
  },

  // 4. DOCUMENTS (Priority 3)
  {
    id: 'document',
    label: 'Documents',
    icon: '📄',
    color: 'bg-slate-500',
    priority: 3,
    keywords: [
      'text', 'paper', 'screenshot', 'invoice', 'receipt', 'book', 'letter',
      'sign', 'poster', 'menu', 'page', 'writing', 'document', 'pdf', 'note',
      'chart', 'graph', 'diagram', 'map', 'blueprint', 'newspaper', 'magazine',
      'passport', 'license', 'ticket', 'label', 'logo',
      'billboard', 'envelope', 'binder', 'folder',
      'comic', 'novel', 'certificate', 'diploma', 'money', 'cash', 'currency', 'coin'
    ]
  },

  // 5. FOOD (Priority 4)
  {
    id: 'food',
    label: 'Food',
    icon: '🍽️',
    color: 'bg-purple-500',
    priority: 4,
    keywords: [
      'food', 'fruit', 'vegetable', 'dish', 'plate', 'meat', 'drink', 'coffee',
      'pizza', 'burger', 'cake', 'bakery', 'bread', 'latte', 'espresso', 'wine',
      'beer', 'cocktail', 'ice cream', 'chocolate', 'soup', 'salad', 'breakfast',
      'lunch', 'dinner', 'meal', 'snack', 'dessert', 'pie', 'cookie', 'donut',
      'pasta', 'noodle', 'rice', 'sushi', 'steak', 'chicken', 'pork', 'beef',
      'tomato', 'potato', 'onion', 'carrot', 'pepper', 'corn', 'bean', 'nut',
      'apple', 'banana', 'orange', 'grape', 'berry', 'lemon', 'lime', 'juice',
      'tea', 'water', 'bottle', 'cup', 'glass', 'mug', 'fork', 'spoon', 'knife',
      'cheeseburger', 'hotdog', 'sandwich', 'bagel', 'pretzel', 'burrito', 'taco',
      'spaghetti', 'carbonara', 'lasagna', 'broccoli', 'cauliflower', 'zucchini',
      'cucumber', 'pumpkin', 'squash', 'mushroom', 'strawberry', 'pineapple',
      'pomegranate', 'fig', 'custard', 'trifle', 'guacamole', 'salsa',
      'egg', 'omelet', 'pancake', 'waffle', 'toast', 'cereal', 'oatmeal', 'yogurt',
      'cheese', 'butter', 'cream', 'sugar', 'salt', 'spice', 'herb', 'garlic',
      'ginger', 'cinnamon', 'vanilla', 'honey', 'jam', 'jelly', 'peanut', 'almond',
      'walnut', 'pecan', 'cashew', 'pistachio', 'hazelnut', 'coconut', 'olive',
      'oil', 'vinegar', 'sauce', 'ketchup', 'mustard', 'mayonnaise', 'bbq', 'seafood', 'biscuit', 'croissant', 'candy'
    ]
  },

  // 6. ARCHITECTURE / PLACES (Priority 5)
  {
    id: 'architecture',
    label: 'Places',
    icon: '🏙️',
    color: 'bg-yellow-500',
    priority: 5,
    keywords: [
      'building', 'house', 'city', 'street', 'bridge', 'tower', 'skyline',
      'village', 'town', 'road', 'highway', 'path', 'trail', 'farm', 'barn', 
      'room', 'interior', 'office', 'apartment', 'castle', 'temple', 'church', 
      'mosque', 'skyscraper', 'architecture', 'monument', 'museum', 'factory',
      'stadium', 'arena', 'market', 'mall', 'shop', 'store', 'restaurant', 'cafe',
      'hospital', 'school', 'university', 'library', 'station', 'airport',
      'pier', 'dock', 'port', 'harbor', 'yard', 'patio', 'balcony', 'roof'
    ]
  },

  // 7. ELECTRONICS (Priority 5)
  {
    id: 'electronics',
    label: 'Electronics',
    icon: '💻',
    color: 'bg-teal-500',
    priority: 5,
    keywords: [
      'screen', 'monitor', 'display', 'computer', 'laptop', 'phone', 'smartphone', 
      'tablet', 'keyboard', 'mouse', 'tv', 'television', 'camera', 'printer', 
      'gadget', 'device', 'headphones', 'earphones', 'speaker', 'microphone',
      'watch', 'smartwatch', 'cable', 'wire', 'router', 'modem', 'console',
      'joystick', 'controller', 'electronic', 'pc', 'macbook', 'ipad'
    ]
  },

  // 8. FURNITURE & HOME (Priority 6)
  {
    id: 'furniture',
    label: 'Furniture',
    icon: '🛋️',
    color: 'bg-amber-600',
    priority: 6,
    keywords: [
      'chair', 'table', 'desk', 'bed', 'sofa', 'couch', 'cabinet', 'shelf', 
      'wardrobe', 'closet', 'dresser', 'furniture', 'lamp', 'rug', 'carpet',
      'curtain', 'blind', 'pillow', 'cushion', 'blanket', 'mirror', 'clock',
      'vase', 'pot', 'pan', 'bowl', 'sink', 'toilet', 'bathtub', 'shower'
    ]
  },

  // 9. NATURE (Priority 7)
  {
    id: 'nature',
    label: 'Nature',
    icon: '🌿',
    color: 'bg-green-500',
    priority: 7,
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