import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';

interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  isProcessing: boolean;
  processingCount: number;
  isClassifierReady: boolean;
  modelProgress: number;
  modelStatus: string;
}

export function UploadZone({
  onUpload,
  isProcessing,
  processingCount,
  isClassifierReady,
  modelProgress,
  modelStatus
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      onUpload(files);
    }
  }, [onUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
    e.target.value = '';
  }, [onUpload]);

  return (
    <div className="relative">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
      />
      
      <label
        htmlFor="file-upload"
        className={`
          relative block cursor-pointer rounded-xl border-2 border-dashed
          transition-all duration-300 overflow-hidden
          ${isDragging 
            ? 'border-primary bg-primary/10' 
            : 'border-border hover:border-primary/50 hover:bg-card/50'
          }
          ${!isClassifierReady ? 'pointer-events-none opacity-70' : ''}
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Background glow effect */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"
            />
          )}
        </AnimatePresence>

        <div className="relative p-8 flex flex-col items-center gap-4">
          {/* Icon */}
          <motion.div
            className={`
              p-4 rounded-full 
              ${isDragging ? 'bg-primary/20' : 'bg-muted'}
            `}
            animate={isDragging ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            {isProcessing ? (
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            ) : (
              <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            )}
          </motion.div>

          {/* Text */}
          <div className="text-center">
            {!isClassifierReady ? (
              <>
                <p className="text-foreground font-medium mb-1">{modelStatus}</p>
                <div className="w-48 h-2 bg-muted rounded-full overflow-hidden mx-auto">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${modelProgress}%` }}
                  />
                </div>
              </>
            ) : isProcessing ? (
              <>
                <p className="text-foreground font-medium">Processing {processingCount} image{processingCount > 1 ? 's' : ''}...</p>
                <p className="text-muted-foreground text-sm">AI is classifying your images</p>
              </>
            ) : (
              <>
                <p className="text-foreground font-medium">
                  {isDragging ? 'Drop images here' : 'Drag & drop images here'}
                </p>
                <p className="text-muted-foreground text-sm">
                  or click to browse • Supports JPG, PNG, WebP
                </p>
              </>
            )}
          </div>

          {/* Features */}
          {isClassifierReady && !isProcessing && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                Multiple files
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI-powered
              </span>
            </div>
          )}
        </div>
      </label>
    </div>
  );
}
