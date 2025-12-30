import { motion } from 'framer-motion';
import { Image, Zap, Info, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import ThemeToggle from './ThemeToggle';
import ThemeSelector from './ThemeSelector';
import { useUISettings } from '@/context/UISettingsContext';
import { Tag } from 'lucide-react';

interface HeaderProps {
  imageCount: number;
  isClassifierReady: boolean;
}

export function Header({ imageCount, isClassifierReady }: HeaderProps) {
  const { showSuggestions, setShowSuggestions } = useUISettings();
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
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Image className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">SmartGallery</span>
            </div>
            <div>
              <h1 className="text-2xl font-display font-extrabold tracking-tight gradient-text">SmartGallery</h1>
              <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">Auto-suggested tags</p>
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
              <Image className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{imageCount}</span> images
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
                {isClassifierReady ? 'Tagging ready' : 'Loading tags...'}
              </span>
              <Zap className={`w-4 h-4 ${isClassifierReady ? 'text-category-animal' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-sm text-muted-foreground flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted">
                    <Info className="w-4 h-4" />
                    <span className="text-xs">How it works</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>How SmartGallery works</DialogTitle>
                    <DialogDescription>
                      SmartGallery automatically suggests tags and detects faces to help you organize photos. You can toggle suggestions on or off using the "Hide suggestions" button.
                      Upload images via drag & drop or use the upload button. Use the lightbox to view and navigate your photos.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <button
                className="text-sm text-muted-foreground flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted"
                onClick={() => setShowSuggestions(!showSuggestions)}
                aria-pressed={!showSuggestions}
                title={showSuggestions ? 'Hide suggestions' : 'Show suggestions'}
              >
                <Tag className="w-4 h-4" />
                <span className="sr-only">Toggle suggestions</span>
                <span className="text-xs">{showSuggestions ? 'Hide suggestions' : 'Show suggestions'}</span>
              </button>
              <ThemeSelector />
              <ThemeToggle />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
