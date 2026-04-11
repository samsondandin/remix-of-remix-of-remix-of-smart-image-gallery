import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <section className="relative max-w-2xl mx-auto -mt-4 mb-8 z-20">
            <div className={`relative group transition-all duration-500 ${searchQuery ? 'scale-105' : ''}`}>
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className={`w-5 h-5 transition-colors ${searchQuery ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Magic Search... (e.g., 'dog', 'beach', 'smile')"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 dark:bg-black/50 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl focus:shadow-2xl focus:shadow-primary/20 transition-all outline-none text-lg placeholder:text-muted-foreground/50"
                />

                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </section>
    );
};
