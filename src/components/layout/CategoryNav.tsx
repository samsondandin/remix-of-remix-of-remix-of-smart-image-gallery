import { CATEGORIES, Category, GalleryImage, Person } from '@/types/gallery';

interface CategoryNavProps {
  onSelect: (category: Category | 'all') => void;
  images: GalleryImage[];
  knownPeople?: Person[]; 
}

export function CategoryNav({ onSelect, images, knownPeople = [] }: CategoryNavProps) {
  const getCount = (id: string) => images.filter(img => img.category === id).length;

  return (
    <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
      {/* 1. ALL PHOTOS BUTTON */}
      <button
        onClick={() => onSelect('all')}
        className="px-6 py-3 rounded-2xl bg-muted hover:bg-muted/80 transition-all font-medium flex items-center gap-2"
      >
        🖼️ All Photos <span className="opacity-40">{images.length}</span>
      </button>

      {/* 2. DYNAMIC PEOPLE BUTTONS (Sampson, Mom, etc.) */}
      {knownPeople.map((person) => (
        <button
          key={person.id}
          onClick={() => onSelect(person.name)}
          className="px-6 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all font-bold text-indigo-500 flex items-center gap-2 group"
        >
          <img 
            src={person.avatarUrl} 
            className="w-5 h-5 rounded-full object-cover" 
            alt={person.name} 
          />
          <span>{person.name}</span>
          <span className="opacity-40 group-hover:opacity-100 transition-opacity">
            {getCount(person.name)}
          </span>
        </button>
      ))}
      
      {/* 3. STANDARD CATEGORIES (Animals, Vehicles, etc.) */}
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="px-6 py-3 rounded-2xl bg-card border border-foreground/5 hover:border-primary/30 transition-all font-medium flex items-center gap-2 group"
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
          <span className="opacity-40 group-hover:opacity-100 transition-opacity">
            {getCount(cat.id)}
          </span>
        </button>
      ))}
    </div>
  );
}