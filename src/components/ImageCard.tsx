import React, { useState, useRef, useEffect } from 'react';
import { GalleryImage, CATEGORIES, Person } from '@/types/gallery';
import { Trash, Check, CheckCircle2, Circle } from 'lucide-react';

interface Props {
  image: GalleryImage;
  isSelectionMode: boolean;
  isSelected: boolean;
  onClick: () => void;
  onToggleSelect: () => void;
  onDelete: () => void;
  onMove: (newCategory: string) => void;
  knownPeople?: Person[];
}

export function ImageCard({ 
  image, isSelectionMode, isSelected, onClick, onToggleSelect, 
  onDelete, onMove, knownPeople = [] 
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setShowMenu(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSelectionMode) return; // Disable right-click in selection mode
    setMenuPos({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      onToggleSelect();
    } else {
      onClick();
    }
  };

  return (
    <>
        <div 
            className={`group relative aspect-square bg-muted rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${isSelected ? 'ring-4 ring-primary ring-inset scale-95' : ''}`}
            onContextMenu={handleContextMenu}
            onClick={handleClick}
        >
            <img 
                src={image.url} 
                className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? '' : 'group-hover:scale-110'}`}
                loading="lazy"
            />
            
            {/* SELECTION INDICATOR */}
            <div 
               className={`absolute top-2 right-2 z-10 transition-all duration-200 ${isSelectionMode || isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
               onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
            >
              {isSelected ? (
                <CheckCircle2 className="text-primary fill-background w-6 h-6 shadow-sm" />
              ) : (
                <Circle className="text-white/80 w-6 h-6 drop-shadow-md hover:text-white" strokeWidth={2} />
              )}
            </div>
            
            {/* HOVER BADGE (Hidden in selection mode) */}
            {!isSelectionMode && !isSelected && (
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-1 rounded-full">
                        {image.category}
                    </span>
                </div>
            )}
        </div>

        {/* RIGHT-CLICK MENU (Standard Mode Only) */}
        {showMenu && (
            <div 
                ref={menuRef}
                className="fixed z-50 w-48 bg-card border border-border shadow-xl rounded-lg overflow-hidden py-1 text-sm animate-in fade-in zoom-in-95"
                style={{ top: menuPos.y, left: menuPos.x }}
            >
                <div className="px-3 py-2 text-xs font-bold opacity-50 uppercase tracking-wider bg-muted/50">
                    Move to...
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                    {knownPeople.map(p => (
                        <button
                            key={p.id}
                            onClick={() => { onMove(p.name); setShowMenu(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-2"
                        >
                            <img src={p.avatarUrl} className="w-4 h-4 rounded-full object-cover" />
                            {p.name}
                            {image.category === p.name && <Check size={12} className="ml-auto text-primary"/>}
                        </button>
                    ))}

                    <div className="h-px bg-border my-1" />

                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { onMove(cat.id); setShowMenu(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-2"
                        >
                            <span>{cat.icon}</span> {cat.label}
                            {image.category === cat.id && <Check size={12} className="ml-auto text-primary"/>}
                        </button>
                    ))}
                </div>

                <div className="h-px bg-border my-1" />
                
                <button 
                    onClick={() => { onDelete(); setShowMenu(false); }}
                    className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-500/10 flex items-center gap-2 font-medium"
                >
                    <Trash size={14} /> Delete
                </button>
            </div>
        )}
    </>
  );
}