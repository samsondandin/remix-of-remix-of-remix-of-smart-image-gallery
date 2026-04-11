import React, { useState } from 'react';
import { X, Upload, UserPlus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (name: string, file: File) => Promise<void>;
}

export function AddPersonModal({ isOpen, onClose, onRegister }: Props) {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !file) return;
    
    setLoading(true);
    await onRegister(name, file);
    setLoading(false);
    onClose();
    setName('');
    setFile(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card w-full max-w-md p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="text-primary" /> Add Person
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sampson"
              className="w-full bg-background border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Reference Photo</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
              {file ? (
                <img src={URL.createObjectURL(file)} className="h-full object-contain rounded-lg" />
              ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                  <Upload size={24} className="mb-2" />
                  <span className="text-xs">Click to upload face</span>
                </div>
              )}
              <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
            </label>
          </div>

          <button 
            disabled={!name || !file || loading}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? 'Learning Face...' : 'Save Person'}
          </button>
        </form>
      </div>
    </div>
  );
}