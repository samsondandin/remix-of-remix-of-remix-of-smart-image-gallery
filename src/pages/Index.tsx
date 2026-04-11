import React, { useState } from 'react';
import { auth, firebaseApiKey } from '@/lib/firebase';
import { useGallery } from '@/hooks/useGallery';
import { CategoryStories } from '@/components/features/CategoryStories';
import { ImageGrid } from '@/components/gallery/ImageGrid';
import { ImageModal } from '@/components/gallery/ImageModal';
import { PeopleBar } from '@/components/features/PeopleBar';
import { SearchBar } from '@/components/features/SearchBar';
import { DriveImportModal } from '@/components/features/DriveImportModal';
import { AddPersonModal } from '@/components/features/AddPersonModal';
import { GalleryImage } from '@/types/gallery';
import { toast } from 'sonner';
import { Plus, X, User, CloudDownload, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { extractFolderId, fetchDriveFiles, downloadDriveFile } from '@/services/googleDrive';
import JSZip from 'jszip';
import { CheckSquare, Trash2, Download, XCircle } from 'lucide-react';
import { LoginButton } from '@/components/LoginButton';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    images,
    knownPeople,
    registerPerson,
    uploadImages,
    deleteImage,
    deleteImages,
    moveImage,
    deletePerson,
    isAnalyzing,
    scanningStatus
  } = useGallery();

  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Selection State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isZipping, setIsZipping] = useState(false);

  // Drag State
  const [isDragging, setIsDragging] = useState(false);

  // Drive State
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [driveLink, setDriveLink] = useState("");
  const [driveApiKey, setDriveApiKey] = useState("");
  const [showDriveAdvanced, setShowDriveAdvanced] = useState(false); // New: Hide API Key
  const [isImportingDrive, setIsImportingDrive] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // 🟢 FILTER LOGIC (Crucial for clicking faces)
  // 🟢 FILTER LOGIC (Crucial for clicking faces + Magic Search)
  const filteredImages = images.filter(img => {
    // 1. Category Filter
    let categoryMatch = false;
    if (selectedCategory === 'all') {
      categoryMatch = true;
    } else if (selectedCategory === 'portrait') {
      // 🟢 FIX: "People" tab should show explicit portraits AND specific people
      const isKnownPerson = knownPeople.some(p => p.name === img.category);
      categoryMatch = img.category === 'portrait' || isKnownPerson;
    } else {
      // Standard match (e.g. "Vehicles" or specific person "Samson")
      categoryMatch = img.category === selectedCategory || (img.matchedPersonName && img.matchedPersonName.includes(selectedCategory));
    }

    // 2. Search Filter (The "Magic")
    const safeQuery = searchQuery.toLowerCase().trim();
    const searchMatch = safeQuery === ''
      ? true
      : img.rawLabels.some(l => l.includes(safeQuery)) ||
      img.filename.toLowerCase().includes(safeQuery) ||
      img.filename.toLowerCase().includes(safeQuery) ||
      (img.matchedPersonName && img.matchedPersonName.toLowerCase().includes(safeQuery)) ||
      (img.category.includes(safeQuery));

    return categoryMatch && searchMatch;
  });

  // Removed handleRegister - using component instead

  const handleDriveImport = async () => {
    try {
      const folderId = extractFolderId(driveLink);
      if (!folderId) {
        toast.error("Invalid Drive Folder Link");
        return;
      }

      // Use user-provided key or fallback to project key
      // Note: Project key needs "Google Drive API" enabled in Cloud Console.
      const PROJECT_API_KEY = "AIzaSyDAmDp2J3OQJKkfeyCtjOX_950OS9177qA";
      const effectiveApiKey = driveApiKey || firebaseApiKey || PROJECT_API_KEY;

      if (!effectiveApiKey) {
        toast.error("API Key is required to search folders");
        return;
      }

      setIsImportingDrive(true);
      toast.info("Fetching file list...");

      const files = await fetchDriveFiles(folderId, effectiveApiKey);
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
          const blob = await downloadDriveFile(f.id, effectiveApiKey);
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

  // Selection Logic
  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredImages.length) {
      setSelectedIds([]); // Deselect all
    } else {
      setSelectedIds(filteredImages.map(img => img.id));
    }
  };

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} images? This cannot be undone.`)) return;
    await deleteImages(selectedIds);
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  const handleBulkDownload = async () => {
    setIsZipping(true);
    toast.info("Preparing Zip file...");
    try {
      const zip = new JSZip();

      // Add files to zip
      // We might need to fetch data urls again or just use the ones we have?
      // DataURLs are heavy for memory if we have 100s. 
      // But for local app this is fine for now.

      let count = 0;
      for (const id of selectedIds) {
        const img = images.find(i => i.id === id);
        if (!img) continue;

        // Extract base64
        const base64Data = img.url.split(',')[1];
        zip.file(img.filename || `image-${count}.jpg`, base64Data, { base64: true });
        count++;
      }

      const content = await zip.generateAsync({ type: "blob" });

      // Trigger Download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `smart-gallery-${new Date().toISOString().slice(0, 10)}.zip`;
      link.click();

      toast.success("Download started!");
      setIsSelectionMode(false);
      setSelectedIds([]);

    } catch (e: any) {
      toast.error("Zip failed: " + e.message);
    } finally {
      setIsZipping(false);
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
            <button
              onClick={() => setIsHelpOpen(true)}
              className="text-muted-foreground font-medium hover:text-primary transition-colors flex items-center gap-2"
            >
              <span className="hidden md:inline">Ai-Powered Memories</span>
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full border border-border flex items-center gap-1">
                <span className="hidden sm:inline">How it works?</span>
                <span className="sm:hidden">Help</span>
              </span>
            </button>
          </div>

          <div className="flex flex-nowrap overflow-x-auto md:flex-wrap justify-start md:justify-end gap-2 md:gap-3 items-center w-full md:w-auto -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar pb-1 md:pb-0">
            {/* LOGIN BUTTON */}
            <div className="shrink-0">
              <LoginButton />
            </div>

            <button
              onClick={toggleTheme}
              className="shrink-0 p-2.5 rounded-full bg-secondary/50 hover:bg-secondary text-foreground transition-colors"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* SELECTION TOGGLE */}
            <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                setSelectedIds([]);
              }}
              className={`shrink-0 p-2.5 rounded-full transition-colors flex items-center gap-2 px-3 md:px-4
                 ${isSelectionMode
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-secondary/50 hover:bg-secondary text-foreground'
                }`}
              title="Select Multiple"
            >
              <CheckSquare size={18} />
              <span className="text-xs md:text-sm font-medium whitespace-nowrap">{isSelectionMode ? 'Done' : 'Select'}</span>
            </button>

            <button
              onClick={() => setIsAddingPerson(!isAddingPerson)}
              className="shrink-0 bg-secondary/50 hover:bg-secondary text-foreground p-2.5 md:px-5 md:py-2.5 rounded-2xl flex items-center gap-2 font-medium transition-all hover:scale-105 border border-transparent hover:border-border"
              title="Add Person"
            >
              <Plus size={18} />
              <span className="text-xs md:text-sm md:hidden whitespace-nowrap">Person</span>
              <span className="hidden md:inline whitespace-nowrap">New Person</span>
            </button>

            <button
              onClick={() => setIsDriveModalOpen(true)}
              className="shrink-0 bg-secondary/50 hover:bg-secondary text-foreground p-2.5 md:px-5 md:py-2.5 rounded-2xl flex items-center gap-2 font-medium transition-all hover:scale-105 border border-transparent hover:border-border"
              title="Import from Drive"
            >
              <CloudDownload size={18} />
              <span className="text-xs md:text-sm md:hidden whitespace-nowrap">Drive</span>
              <span className="hidden md:inline whitespace-nowrap">Import Drive</span>
            </button>

            <label className="shrink-0 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground p-2.5 md:px-8 md:py-2.5 rounded-2xl transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:scale-95" title="Upload Images">
              <span className="text-xs md:text-sm whitespace-nowrap">Upload</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && uploadImages(Array.from(e.target.files))}
              />
            </label>
          </div>
        </header>

        {/* MAGIC SEARCH BAR (Extract) */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* 🟢 PEOPLE BAR (Functional & Clear) */}
        {/* 🟢 PEOPLE BAR (Functional & Clear) */}
        {/* PEOPLE BAR */}
        <PeopleBar
          knownPeople={knownPeople}
          selectedCategory={selectedCategory as string}
          onSelectPerson={setSelectedCategory}
          onDeletePerson={deletePerson}
        />

        {/* ADD PERSON MODAL */}
        <AddPersonModal
          isOpen={isAddingPerson}
          onClose={() => setIsAddingPerson(false)}
          onRegister={registerPerson}
        />
        {/* DRIVE IMPORT MODAL (Extract) */}
        <DriveImportModal
          isOpen={isDriveModalOpen}
          onClose={() => setIsDriveModalOpen(false)}
          driveLink={driveLink}
          setDriveLink={setDriveLink}
          driveApiKey={driveApiKey}
          setDriveApiKey={setDriveApiKey}
          showAdvanced={showDriveAdvanced}
          setShowAdvanced={setShowDriveAdvanced}
          isImporting={isImportingDrive}
          onImport={handleDriveImport}
        />
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
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
              <div className="w-full max-w-md p-6 bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>

                <div className="text-center space-y-2 w-full">
                  <h3 className="text-lg font-bold">Analyzing Photos</h3>
                  <p className="text-muted-foreground font-mono text-sm">{scanningStatus || "Initializing AI..."}</p>

                  {/* Progress Bar Logic */}
                  {scanningStatus && scanningStatus.includes('/') && (
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mt-2 relative">
                      <div
                        className="bg-primary h-full transition-all duration-300 ease-out"
                        style={{
                          width: (() => {
                            const match = scanningStatus.match(/(\d+)\/(\d+)/);
                            if (match) {
                              const [_, current, total] = match;
                              return `${(parseInt(current) / parseInt(total)) * 100}%`;
                            }
                            return '0%';
                          })()
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
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
              isSelectionMode={isSelectionMode}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
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

        {/* BULK ACTION BAR */}
        {
          selectedIds.length > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-background/80 backdrop-blur-xl border border-border p-2 pr-6 rounded-full shadow-2xl animate-in slide-in-from-bottom-6">
              <div className="bg-foreground text-background px-4 py-2 rounded-full font-bold text-sm min-w-[3rem] text-center">
                {selectedIds.length}
              </div>

              <div className="h-6 w-px bg-border" /> {/* Divider */}

              <button
                onClick={handleSelectAll}
                className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
              >
                {selectedIds.length === filteredImages.length ? 'Deselect All' : 'Select All'}
              </button>

              <div className="h-6 w-px bg-border" /> {/* Divider */}

              <button
                onClick={handleBulkDownload}
                disabled={isZipping}
                className="flex flex-col items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-secondary rounded-lg"
              >
                {isZipping ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Download size={20} />}
                Download
              </button>

              <button
                onClick={handleBulkDelete}
                className="flex flex-col items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
              >
                <Trash2 size={20} />
                Delete
              </button>
            </div>
          )
        }

        {/* DRAG OVERLAY */}
        {
          isDragging && (
            <div className="fixed inset-0 z-[100] bg-primary/20 backdrop-blur-sm border-4 border-primary border-dashed m-4 rounded-3xl flex items-center justify-center animate-in fade-in zoom-in-95 pointer-events-none">
              <div className="bg-background/90 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
                <CloudDownload size={64} className="text-primary animate-bounce" />
                <h2 className="text-2xl font-bold">Drop Photos Here</h2>
                <p className="text-muted-foreground">Release to upload instantly</p>
              </div>
            </div>
          )
        }

      </div >
      {/* HELP MODAL */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="glass bg-white/95 dark:bg-zinc-900/95 p-8 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setIsHelpOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gradient">How to use Smart Gallery</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">1. Upload Photos</h3>
                  <p className="text-sm text-muted-foreground">Click "Upload" or drag & drop images anywhere. Limits are gone! Add as many as you like.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                  <CloudDownload size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">2. AI Sorting</h3>
                  <p className="text-sm text-muted-foreground">The AI automatically sorts your photos into categories like People, Nature, and Food. No manual tagging needed.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">3. Face Recognition</h3>
                  <p className="text-sm text-muted-foreground">It learns faces! Add a "New Person" with a reference photo, and it will find them in your gallery.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsHelpOpen(false)}
              className="w-full mt-8 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div >
  );
};

export default Index;