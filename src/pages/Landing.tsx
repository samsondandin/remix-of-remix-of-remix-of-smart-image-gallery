import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Zap, Brain, Sparkles } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground relative flex flex-col items-center justify-center p-6 lg:p-12 overflow-hidden">

            {/* Subtle Film Grain Texture */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                {/* Left: Editorial Copy */}
                <div className="flex-1 space-y-8 text-center lg:text-left fade-in slide-in-from-bottom-5 duration-1000">
                    <div className="inline-block">
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground border-b border-primary/20 pb-1">
                            Local • Private • Intelligent
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
                        The privacy-first home for your <span className="text-primary italic">life's work.</span>
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                        Your memories are personal. We believe your gallery should be too.
                        Experience a photo library that thinks like you, stays on your device, and never sells your data.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                        <button
                            onClick={() => navigate('/gallery')}
                            className="group bg-foreground text-background px-8 py-4 rounded-full font-semibold text-lg transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-3"
                        >
                            Launch Gallery <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                        <div className="px-6 py-4 rounded-full border border-border/50 text-sm font-medium flex items-center justify-center gap-2 text-muted-foreground">
                            <Lock size={14} /> Locally Processed
                        </div>
                    </div>
                </div>

                {/* Right: Abstract "Bento" Visualization */}
                <div className="flex-1 w-full max-w-lg lg:max-w-xl relative">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 dark:bg-black/5 backdrop-blur-sm border border-black/5 dark:border-white/5 rounded-[2rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
                        {/* Block 1: Smart Sort */}
                        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50 flex flex-col justify-between h-48 col-span-1">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
                                <Brain size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold">Auto-Sort</h3>
                                <p className="text-xs text-muted-foreground mt-1">AI tags every photo.</p>
                            </div>
                        </div>

                        {/* Block 2: Performance */}
                        <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 rounded-2xl border border-primary/10 flex flex-col justify-center items-center text-center h-48 col-span-1">
                            <Zap size={32} className="text-primary mb-3" />
                            <span className="text-3xl font-mono font-bold tracking-tighter">0.02s</span>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">Lookup Time</span>
                        </div>

                        {/* Block 3: Privacy (Wide) */}
                        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50 col-span-2 flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <Lock size={22} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Offline First</h3>
                                <p className="text-xs text-muted-foreground">No internet? No problem. It works everywhere.</p>
                            </div>
                        </div>
                    </div>

                    {/* Decor Elements */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl opacity-20" />
                </div>
            </div>

            <footer className="absolute bottom-6 w-full text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold">
                    Smart Gallery • Est. 2026
                </p>
            </footer>
        </div>
    );
};

export default Landing;
