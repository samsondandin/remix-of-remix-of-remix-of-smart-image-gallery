import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Zap, Brain, Sparkles, CloudDownload } from 'lucide-react';

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

                {/* Right: Quick Guide */}
                <div className="flex-1 w-full max-w-lg lg:max-w-xl relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                    <div className="bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                        {/* Glass Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Sparkles className="text-yellow-500" size={24} />
                            How it works
                        </h3>

                        <div className="space-y-6 relative z-10">
                            <div className="flex gap-4 items-start group">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-110 transition-transform">
                                    <CloudDownload size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">1. Upload or Drag</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Drag & Drop your folder or select photos. We support direct Google Drive imports too.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start group">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 group-hover:scale-110 transition-transform">
                                    <Brain size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">2. AI Sorting</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Our local neural engine instantly organizes photos into People, Nature, Food, and more.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start group">
                                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 shrink-0 group-hover:scale-110 transition-transform">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">3. Magic Search</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Find "smiling" or "beach" instantly. Teach it faces, and it remembers them forever.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decor Elements */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                </div>
            </div>

            <footer className="absolute bottom-6 w-full text-center">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold">
                    Developed by Samson • © 2026 Smart Gallery
                </p>
            </footer>
        </div>
    );
};

export default Landing;
