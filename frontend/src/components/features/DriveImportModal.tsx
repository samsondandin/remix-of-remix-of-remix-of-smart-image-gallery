import React from 'react';
import { CloudDownload, X } from 'lucide-react';

interface DriveImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    driveLink: string;
    setDriveLink: (link: string) => void;
    driveApiKey: string;
    setDriveApiKey: (key: string) => void;
    showAdvanced: boolean;
    setShowAdvanced: (show: boolean) => void;
    isImporting: boolean;
    onImport: () => void;
}

export const DriveImportModal: React.FC<DriveImportModalProps> = ({
    isOpen, onClose, driveLink, setDriveLink, driveApiKey, setDriveApiKey,
    showAdvanced, setShowAdvanced, isImporting, onImport
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass bg-white/90 dark:bg-zinc-900/90 p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        <CloudDownload className="text-blue-500" size={24} />
                        Import from Drive
                    </h3>
                    {!isImporting && (
                        <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
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
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-medium ml-1"
                        >
                            {showAdvanced ? "Hide settings" : "Advanced settings (API Key)"}
                        </button>

                        {showAdvanced && (
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
                    onClick={onImport}
                    disabled={isImporting}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex justify-center gap-2 active:scale-[0.98]"
                >
                    {isImporting ? (
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
    );
};
