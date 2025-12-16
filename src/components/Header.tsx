import { motion } from 'framer-motion';
import { Sparkles, Brain, Zap } from 'lucide-react';

interface HeaderProps {
  imageCount: number;
  isClassifierReady: boolean;
}

export function Header({ imageCount, isClassifierReady }: HeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-category-animal"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-display font-extrabold tracking-tight gradient-text">SmartGallery</h1>
              <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">AI-Powered Classification</p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            {/* Image count */}
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{imageCount}</span> images
              </span>
            </div>

            {/* AI Status */}
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${isClassifierReady ? 'bg-category-animal' : 'bg-category-portrait'}`}
                animate={isClassifierReady ? {} : { opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
              <span className="text-sm text-muted-foreground">
                {isClassifierReady ? 'AI Ready' : 'Loading AI...'}
              </span>
              <Zap className={`w-4 h-4 ${isClassifierReady ? 'text-category-animal' : 'text-muted-foreground'}`} />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
