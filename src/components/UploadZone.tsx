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
          relative block cursor-pointer rounded-xl border transition-all duration-300 overflow-hidden bg-card
          ${isDragging ? 'ring-2 ring-primary/20 border-primary/60' : 'border-border/60 hover:shadow-md'}
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
          <div className="p-4 rounded-full bg-muted/60">
            {isProcessing ? (
              <Sparkles className="w-7 h-7 text-primary animate-pulse" />
            ) : (
              <Upload className={`w-7 h-7 text-muted-foreground`} />
            )}
          </div>

          {/* Text */}
          <div className="text-center">
            {!isClassifierReady ? (
              <>
                <p className="text-foreground font-medium mb-1">{modelStatus}</p>
                <div className="w-48 h-2 bg-muted rounded-full overflow-hidden mx-auto">
                  <motion.div
                    className="h-full bg-primary"
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
                  {isDragging ? 'Drop images here' : 'Click or drag images to upload'}
                </p>
                <p className="text-muted-foreground text-sm">
                  Supports JPG, PNG, WebP • Multiple files
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
