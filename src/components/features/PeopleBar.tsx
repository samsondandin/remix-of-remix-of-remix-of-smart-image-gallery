import React from 'react';
import { User } from 'lucide-react';
import { Person } from '@/types/gallery';

interface PeopleBarProps {
    knownPeople: Person[];
    selectedCategory: string;
    onSelectPerson: (name: string) => void;
    onDeletePerson: (id: string) => void;
}

export const PeopleBar: React.FC<PeopleBarProps> = ({
    knownPeople,
    selectedCategory,
    onSelectPerson,
    onDeletePerson
}) => {
    if (knownPeople.length === 0) return null;

    return (
        <section className="border-b border-border/50 pb-6">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                        <User size={18} className="text-pink-600 dark:text-pink-400" />
                    </div>
                    <span className="text-sm font-bold text-foreground tracking-tight">
                        People & Faces
                    </span>
                </div>
                <span className="text-xs text-muted-foreground">{knownPeople.length} found</span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
                {knownPeople.map((person) => (
                    <div className="relative group/card" key={person.id}>
                        <button
                            onClick={() => onSelectPerson(person.name)}
                            className="flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Avatar */}
                            <div className={`relative w-20 h-20 rounded-full overflow-hidden transition-all duration-300 ${selectedCategory === person.name
                                ? 'ring-4 ring-pink-500 shadow-lg shadow-pink-500/20'
                                : 'ring-2 ring-transparent group-hover/card:ring-pink-300'
                                }`}>
                                <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover transition-transform group-hover/card:scale-110" />

                                {/* Active Indicator */}
                                {selectedCategory === person.name && (
                                    <div className="absolute inset-0 bg-pink-500/10 mix-blend-overlay" />
                                )}
                            </div>

                            {/* Name */}
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${selectedCategory === person.name
                                ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300'
                                : 'text-muted-foreground group-hover/card:text-foreground'
                                }`}>
                                {person.name}
                            </span>
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Forget ${person.name}?`)) {
                                    onDeletePerson(person.id);
                                }
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/card:opacity-100 transition-opacity shadow-sm hover:bg-red-600 z-10"
                            title="Forget Person"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};
