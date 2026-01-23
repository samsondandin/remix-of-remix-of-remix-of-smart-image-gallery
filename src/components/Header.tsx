import React from 'react';
import { Search, User } from 'lucide-react';

export function Header({ onUpload }: { onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <header className="fixed top-0 w-full z-40 bg-background/60 backdrop-blur-xl border-b border-foreground/5">
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-black text-xl tracking-tighter uppercase">SmartGallery.</span>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-full text-sm opacity-50">
            <Search size={14} />
            <input type="text" placeholder="Search your library..." className="bg-transparent border-none outline-none w-48" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}