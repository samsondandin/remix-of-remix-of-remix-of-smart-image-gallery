import React, { useState } from 'react';
import { useGallery } from '@/hooks/useGallery';
import { CategoryStories } from '@/components/CategoryStories';
import { ImageGrid } from '@/components/ImageGrid';
import { ImageModal } from '@/components/ImageModal';
import { GalleryImage } from '@/types/gallery';
import { toast } from 'sonner';
import { Plus, X, User, CloudDownload, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { extractFolderId, fetchDriveFiles, downloadDriveFile } from '@/services/googleDrive';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    images,
    knownPeople,
    registerPerson,
    uploadImages,
    deleteImage,
    moveImage,
    isAnalyzing,
    scanningStatus
  } = useGallery();

  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Drag State
  const [isDragging, setIsDragging] = useState(false);

  // Drive State
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [driveLink, setDriveLink] = useState("");
  const [driveApiKey, setDriveApiKey] = useState("");
  const [showDriveAdvanced, setShowDriveAdvanced] = useState(false); // New: Hide API Key
  const [isImportingDrive, setIsImportingDrive] = useState(false);

  // 🟢 FILTER LOGIC (Crucial for clicking faces)
  // 🟢 FILTER LOGIC (Crucial for clicking faces + Magic Search)
  const filteredImages = images.filter(img => {
    // 1. Category Filter
    const categoryMatch = selectedCategory === 'all' ? true : img.category === selectedCategory;

    // 2. Search Filter (The "Magic")
    const safeQuery = searchQuery.toLowerCase().trim();
    const searchMatch = safeQuery === ''
      ? true
      : img.rawLabels.some(l => l.includes(safeQuery)) ||
      img.filename.toLowerCase().includes(safeQuery) ||
      (img.matchedPersonName?.toLowerCase().includes(safeQuery)) ||
      (img.category.includes(safeQuery));

    return categoryMatch && searchMatch;
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = document.getElementById('face-upload') as HTMLInputElement;
    if (!newPersonName || !fileInput.files?.[0]) {
      toast.error("Please provide a name and a photo");
      return;
    }
    await registerPerson(newPersonName, fileInput.files[0]);
    setIsAddingPerson(false);
    setNewPersonName("");
  };

  const handleDriveImport = async () => {
    try {
      const folderId = extractFolderId(driveLink);
      if (!folderId) {
        toast.error("Invalid Drive Folder Link");
        return;
      }
      if (!driveApiKey && !showDriveAdvanced) {
        // If they didn't toggle advanced, maybe they expect it to work without key?
        // For now, key IS required for folder listing.
        // We'll warn them or just check key.
      }
      if (!driveApiKey) {
        toast.error("API Key is required to search folders");
        return;
      }

      setIsImportingDrive(true);
      toast.info("Fetching file list...");

      const files = await fetchDriveFiles(folderId, driveApiKey);
      if (files.length === 0) {
        toast.warning("No images found in this folder");
        setIsImportingDrive(false);
        return;
      }

      toast.info(`Found ${files.length} images. Downloading...`);

      const downloadedFiles: File[] = [];

      // Parallel + Limited concurrency could be better, but sequential for safety first
      for (const f of files) {
        try {
          const blob = await downloadDriveFile(f.id, driveApiKey);
          const file = new File([blob], f.name, { type: f.mimeType });
          downloadedFiles.push(file);
        } catch (err) {
          console.error(`Failed to download ${f.name}`, err);
        }
      }

      if (downloadedFiles.length > 0) {
        toast.success(`Downloaded ${downloadedFiles.length} images. Processing...`);
        setIsDriveModalOpen(false);
        // Reset fields
        setDriveLink("");

        // Hand off to existing upload logic
        await uploadImages(downloadedFiles);
      }

    } catch (err: any) {
      toast.error("Drive Import Failed: " + err.message);
    } finally {
      setIsImportingDrive(false);
    }
  };

  // Drag Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadImages(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground relative overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 p-4 md:p-8 space-y-8">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 glass p-6 rounded-3xl">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gradient">Smart Gallery</h1>
            <p className="text-muted-foreground font-medium">Ai-Powered Memories</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-secondary/50 hover:bg-secondary text-foreground transition-colors"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button
              onClick={() => setIsAddingPerson(!isAddingPerson)}
              className="bg-secondary/50 hover:bg-secondary text-foreground px-5 py-2.5 rounded-2xl flex items-center gap-2 font-medium transition-all hover:scale-105 border border-transparent hover:border-border"
            >
              <Plus size={18} />
              <span>New Person</span>
            </button>

            <button
              onClick={() => setIsDriveModalOpen(true)}
              className="bg-secondary/50 hover:bg-secondary text-foreground px-5 py-2.5 rounded-2xl flex items-center gap-2 font-medium transition-all hover:scale-105 border border-transparent hover:border-border"
            >
              <CloudDownload size={18} />
              <span>Import Drive</span>
            </button>

            <label className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2.5 rounded-2xl transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:scale-95">
              <span>Upload</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files && uploadImages(Array.from(e.target.files))}
              />
            </label>
          </div>
        </header>

        {/* MAGIC SEARCH BAR */}
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

        {/* 🟢 PEOPLE BAR (Functional & Clear) */}
        {/* 🟢 PEOPLE BAR (Functional & Clear) */}
        {
          knownPeople.length > 0 && (
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
                  <button
                    key={person.id}
                    onClick={() => setSelectedCategory(person.name)} // 🟢 CLICK TO FILTER
                    className="flex flex-col items-center gap-3 group transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Avatar */}
                    <div className={`relative w-20 h-20 rounded-full overflow-hidden transition-all duration-300 ${selectedCategory === person.name
                      ? 'ring-4 ring-pink-500 shadow-lg shadow-pink-500/20'
                      : 'ring-2 ring-transparent group-hover:ring-pink-300'
                      }`}>
                      <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />

                      {/* Active Indicator */}
                      {selectedCategory === person.name && (
                        <div className="absolute inset-0 bg-pink-500/10 mix-blend-overlay" />
                      )}
                    </div>

                    {/* Name */}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${selectedCategory === person.name
                      ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300'
                      : 'text-muted-foreground group-hover:text-foreground'
                      }`}>
                      {person.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )
        }

        {/* REGISTER MODAL */}
        {
          isAddingPerson && (
            <div className="bg-card border border-border p-6 rounded-xl flex flex-col md:flex-row gap-4 items-end shadow-lg animate-in slide-in-from-top-2">
              <div className="flex-1 w-full space-y-1">
                <label className="text-xs font-semibold">Name</label>
                <input
                  type="text"
                  value={newPersonName}
                  onChange={e => setNewPersonName(e.target.value)}
                  placeholder="Name"
                  className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex-1 w-full space-y-1">
                <label className="text-xs font-semibold">Reference Photo</label>
                <input
                  id="face-upload"
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRegister}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsAddingPerson(false)}
                  className="p-2 hover:bg-secondary rounded-md"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )
        }

        {/* DRIVE IMPORT MODAL */}
        {
          isDriveModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="glass bg-white/90 dark:bg-zinc-900/90 p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    <CloudDownload className="text-blue-500" size={24} />
                    Import from Drive
                  </h3>
                  {!isImportingDrive && (
                    <button onClick={() => setIsDriveModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                      <X size={20} />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Folder Link / ID</label>
                    <input
                      value={driveLink}
                      onChange={(e) => setDriveLink(e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full bg-secondary/50 border-0 ring-1 ring-border/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all shadow-inner"
                    />
                    <p className="text-[11px] text-muted-foreground ml-1">
                      Paste the link to your folder.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowDriveAdvanced(!showDriveAdvanced)}
                      className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-medium ml-1"
                    >
                      {showDriveAdvanced ? "Hide settings" : "Advanced settings (API Key)"}
                    </button>

                    {showDriveAdvanced && (
                      <div className="mt-3 space-y-1.5 animate-in slide-in-from-top-1 fade-in">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Google Drive API Key</label>
                        <input
                          value={driveApiKey}
                          onChange={(e) => setDriveApiKey(e.target.value)}
                          type="password"
                          placeholder="AIzaSy..."
                          className="w-full bg-secondary/50 border-0 ring-1 ring-border/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all shadow-inner"
                        />
                        <p className="text-[10px] text-orange-500/80 ml-1">
                          Required for folder access due to Google security policies.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleDriveImport}
                  disabled={isImportingDrive}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex justify-center gap-2 active:scale-[0.98]"
                >
                  {isImportingDrive ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      Importing...
                    </>
                  ) : (
                    "Start Import"
                  )}
                </button>
              </div>
            </div>
          )
        }

        {/* CATEGORY TABS */}
        <section className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm py-2 border-b border-border">
          <CategoryStories
            activeCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </section>

        {/* SCANNER OVERLAY */}
        {
          isAnalyzing && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-medium animate-pulse">{scanningStatus}</p>
            </div>
          )
        }

        {/* GRID */}
        <main className="min-h-[50vh]">
          {filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-80 space-y-4 animate-in fade-in slide-in-from-bottom-8">
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl grayscale opacity-50">
                  {selectedCategory === 'all' ? '📸' :
                    selectedCategory === 'portrait' ? '👤' :
                      selectedCategory === 'animal' ? '🐾' : '📂'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {selectedCategory === 'all' ? "Gallery Empty" : `No "${selectedCategory}" Photos`}
              </h3>
              <p className="text-muted-foreground max-w-xs text-center">
                {selectedCategory === 'all'
                  ? "Upload photos or import from Drive to get started."
                  : "Try uploading more photos, or check 'Other' if the AI missed it."}
              </p>
            </div>
          ) : (
            <ImageGrid
              images={filteredImages}
              onImageClick={setSelectedImage}
            />
          )}
        </main>

        {/* IMAGE MODAL */}
        <ImageModal
          image={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={deleteImage}
          onMove={moveImage}
        />
        {/* DRAG OVERLAY */}
        {isDragging && (
          <div className="fixed inset-0 z-[100] bg-primary/20 backdrop-blur-sm border-4 border-primary border-dashed m-4 rounded-3xl flex items-center justify-center animate-in fade-in zoom-in-95 pointer-events-none">
            <div className="bg-background/90 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
              <CloudDownload size={64} className="text-primary animate-bounce" />
              <h2 className="text-2xl font-bold">Drop Photos Here</h2>
              <p className="text-muted-foreground">Release to upload instantly</p>
            </div>
          </div>
        )}

      </div >
    </div >
  );
};

export default Index;