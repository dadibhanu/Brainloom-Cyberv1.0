import React, { useState } from 'react';
import { LabComponentProps } from '../../types';
import { runValidator } from '../../validators';

export const FileUploadLab: React.FC<LabComponentProps> = ({ config, activeStep, onStepAdvance, onMissionComplete, addLog }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(['avatar.jpg', 'profile_pic.png']);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0].name);
    }
  };

  const handleManualUpload = (e: React.FormEvent) => {
      e.preventDefault();
      const input = document.getElementById('file-upload') as HTMLInputElement;
      if (input && input.files && input.files[0]) {
          processFile(input.files[0].name);
      }
  };

  const processFile = (filename: string) => {
    setError(null);
    addLog('HTTP', `POST /upload filename="${filename}"`);

    setTimeout(() => {
        // Use central validator if available
        if (config.validator?.type) {
            const result = runValidator(config.validator.type, filename);
            
            if (result.success) {
                setUploadedFiles(prev => [...prev, filename]);
                addLog('SUCCESS', '201 Created: File saved.');
                // Only complete mission if it was the intended bypass success message
                if (result.message && result.message.includes('Bypass')) {
                    onMissionComplete();
                    addLog('INFO', result.message);
                }
                // RAG Poisoning scenario reuse
                if (config.validator.type === 'RAG_POISONING') {
                   onMissionComplete();
                   addLog('INFO', 'Knowledge Base Poisoned.');
                }
            } else {
                setError(result.message || 'Upload failed');
                addLog('ERROR', result.message || '403 Forbidden');
            }
        } else {
             // Fallback for visual only if no validator
             setUploadedFiles(prev => [...prev, filename]);
             addLog('SUCCESS', '201 Created');
        }
    }, 800);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Upload Zone */}
      <div>
          <h3 className="font-bold text-lg mb-2">Avatar Uploader</h3>
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <span className="material-symbols-outlined text-5xl text-gray-400 mb-3">cloud_upload</span>
            <p className="text-sm text-gray-600 font-medium mb-1">Drag and drop your file here</p>
            <p className="text-xs text-gray-400 mb-4">Supports JPG, PNG (Max 2MB)</p>
            
            <form onSubmit={handleManualUpload} className="inline-block">
                <label className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-50 shadow-sm transition-colors">
                    Browse Files
                    <input id="file-upload" type="file" className="hidden" onChange={handleManualUpload} />
                </label>
            </form>
          </div>
          {error && (
              <div className="mt-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
              </div>
          )}
      </div>

      {/* Server Storage View */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-600 uppercase flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">folder_open</span>
                  /var/www/uploads
              </span>
              <span className="text-[10px] text-gray-400">{uploadedFiles.length} items</span>
          </div>
          <div className="p-2 overflow-auto grid grid-cols-2 md:grid-cols-3 gap-2">
              {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="group p-3 border border-gray-100 rounded-lg hover:bg-blue-50 hover:border-blue-100 transition-colors cursor-pointer flex flex-col items-center gap-2 text-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white text-gray-400">
                          <span className="material-symbols-outlined">
                              {file.endsWith('.php') || file.includes('.php') ? 'code' : 'image'}
                          </span>
                      </div>
                      <span className="text-xs text-gray-600 truncate w-full group-hover:text-blue-600 font-medium">{file}</span>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};