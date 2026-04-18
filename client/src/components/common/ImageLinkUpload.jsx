import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api.jsx';

export default function ImageLinkUpload({ onLinkGenerated, label = "Upload Image" }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append('image', selected);
      
      const { data } = await api.post('/uploads', fd, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      
      const link = data.url;
      setGeneratedLink(link);
      onLinkGenerated(link); 
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-xs font-black uppercase tracking-widest text-emerald-600 block">{label}</label>
      
      <div className="relative group">
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          accept="image/*"
        />
        
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center transition-all group-hover:border-emerald-500 overflow-hidden relative min-h-[200px]">
          <AnimatePresence>
            {preview ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="absolute inset-0"
              >
                <img src={preview} className="w-full h-full object-cover opacity-40" />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="relative z-20 text-center">
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-black uppercase text-emerald-600">Converting to Link...</p>
              </div>
            ) : generatedLink ? (
              <div className="flex flex-col items-center gap-2">
                <div className="bg-emerald-500 text-white p-2 rounded-full mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs font-bold text-gray-500 truncate max-w-[200px]">{generatedLink}</p>
                <p className="text-[10px] font-black uppercase text-emerald-600">Link Generated & Saved</p>
              </div>
            ) : (
              <>
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Drag & Drop or Click to Upload</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
