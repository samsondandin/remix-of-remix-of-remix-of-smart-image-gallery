import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category, CATEGORIES, GalleryImage } from '@/types/gallery';
import { getCategoryColor } from '@/services/imageClassifier';
import { cn } from '@/lib/utils';
import { FolderOpen, ChevronRight } from 'lucide-react';

interface CategoryNavProps {
  currentCategory: Category | 'all';
  images: GalleryImage[];
}

export function CategoryNav({ currentCategory, images }: CategoryNavProps) {
  const getCategoryCount = (categoryId: Category | 'all'): number => {
    if (categoryId === 'all') return images.length;
    return images.filter(img => img.category === categoryId).length;
  };

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <FolderOpen className="w-5 h-5 text-primary" />
        <h2 className="font-display font-bold text-lg tracking-tight">Image Folders</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* All Images */}
        <CategoryPill
          to="/category/all"
          label="All Images"
          icon="🖼️"
          count={getCategoryCount('all')}
          isActive={currentCategory === 'all'}
        />
        
        {/* Category Pills */}
        {CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat.id}
            to={`/category/${cat.id}`}
            label={cat.label}
            icon={cat.icon}
            count={getCategoryCount(cat.id)}
            isActive={currentCategory === cat.id}
            colorClass={getCategoryColor(cat.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface CategoryPillProps {
  to: string;
  label: string;
  icon: string;
  count: number;
  isActive: boolean;
  colorClass?: string;
}

function CategoryPill({ to, label, icon, count, isActive, colorClass }: CategoryPillProps) {
  return (
    <Link to={to}>
      <motion.div
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200',
          'border-2 cursor-pointer group',
          isActive
            ? 'bg-primary/20 border-primary text-foreground shadow-lg shadow-primary/20'
            : 'bg-background/50 border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
        )}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Icon */}
        <span className="text-lg">{icon}</span>
        
        {/* Label */}
        <span className="font-medium text-sm">{label}</span>
        
        {/* Count Badge */}
        <span className={cn(
          'px-2 py-0.5 rounded-full text-xs font-bold',
          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}>
          {count}
        </span>
        
        {/* Arrow indicator for active */}
        {isActive && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ChevronRight className="w-4 h-4 text-primary" />
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
}
