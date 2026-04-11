import React from 'react';
import { CATEGORIES, Category } from '@/types/gallery';

interface Props {
  activeCategory: Category | 'all';
  onSelect: (cat: Category | 'all') => void;
}

export const CategoryStories: React.FC<Props> = ({ activeCategory, onSelect }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-2 scrollbar-hide">
      {/* "All Photos" Story */}
      <button
        onClick={() => onSelect('all')}
        className={`flex flex-col items-center gap-2 min-w-[70px] transition-transform hover:scale-105 ${activeCategory === 'all' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
          }`}
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 ${activeCategory === 'all' ? 'border-primary bg-primary/20' : 'border-white/10 bg-white/5'
          }`}>
          🖼️
        </div>
        <span className="text-xs font-medium">All</span>
      </button>

      {/* Dynamic Categories */}
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex flex-col items-center gap-2 min-w-[70px] transition-all duration-300 ${activeCategory === cat.id ? 'scale-110 opacity-100' : 'opacity-70 hover:opacity-100 hover:scale-105'
            }`}
        >
          {/* The "Story Ring" with Gradient Border */}
          <div className={`p-[3px] rounded-full transition-all duration-500 ${activeCategory === cat.id
              ? 'bg-gradient-to-tr from-blue-500 via-primary to-purple-500 shadow-lg shadow-primary/30'
              : 'bg-transparent border-2 border-border group-hover:border-primary/50'
            }`}>
            <div className="w-[58px] h-[58px] rounded-full bg-card flex items-center justify-center text-2xl backdrop-blur-md border border-white/10">
              {cat.icon}
            </div>
          </div>
          <span className={`text-xs font-medium truncate w-full text-center transition-colors ${activeCategory === cat.id ? 'text-primary' : 'text-muted-foreground'
            }`}>
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
};