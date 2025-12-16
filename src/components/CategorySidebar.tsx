import { motion } from 'framer-motion';
import { Category, CATEGORIES, GalleryImage } from '@/types/gallery';
import { getCategoryColor } from '@/services/imageClassifier';
import { cn } from '@/lib/utils';

interface CategorySidebarProps {
  selectedCategory: Category | 'all';
  onSelectCategory: (category: Category | 'all') => void;
  images: GalleryImage[];
}

export function CategorySidebar({
  selectedCategory,
  onSelectCategory,
  images
}: CategorySidebarProps) {
  const getCategoryCount = (categoryId: Category | 'all'): number => {
    if (categoryId === 'all') return images.length;
    return images.filter(img => img.category === categoryId).length;
  };

  return (
    <div className="w-64 flex-shrink-0">
      <div className="glass rounded-xl p-4 sticky top-4">
        <h2 className="text-lg font-semibold mb-4 gradient-text">Categories</h2>
        
        <nav className="space-y-1">
          {/* All */}
          <CategoryButton
            label="All Images"
            icon="🖼️"
            count={getCategoryCount('all')}
            isSelected={selectedCategory === 'all'}
            onClick={() => onSelectCategory('all')}
          />
          
          {/* Categories */}
          {CATEGORIES.map((cat) => (
            <CategoryButton
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              count={getCategoryCount(cat.id)}
              isSelected={selectedCategory === cat.id}
              onClick={() => onSelectCategory(cat.id)}
              colorClass={getCategoryColor(cat.id)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

interface CategoryButtonProps {
  label: string;
  icon: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
  colorClass?: string;
}

function CategoryButton({
  label,
  icon,
  count,
  isSelected,
  onClick,
  colorClass
}: CategoryButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
        'text-left group relative overflow-hidden',
        isSelected
          ? 'bg-primary/20 text-foreground'
          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
      )}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Active indicator */}
      {isSelected && (
        <motion.div
          layoutId="category-indicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      
      {/* Icon with color dot */}
      <div className="relative">
        <span className="text-lg">{icon}</span>
        {colorClass && (
          <span className={cn(
            'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full',
            colorClass
          )} />
        )}
      </div>
      
      {/* Label */}
      <span className="flex-1 font-medium text-sm">{label}</span>
      
      {/* Count */}
      <span className={cn(
        'px-2 py-0.5 rounded-full text-xs font-medium',
        isSelected ? 'bg-primary/30' : 'bg-muted'
      )}>
        {count}
      </span>
    </motion.button>
  );
}
