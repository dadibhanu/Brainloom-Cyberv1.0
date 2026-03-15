import React, { useState, useEffect } from 'react';
import { LabComponentProps, FileSystemEnvironment } from '../../types';

// Default Fallback
const DEFAULT_FS = {
  'var': { 'www': { 'html': { 'public': { 'welcome.txt': 'Welcome' } } } },
  'etc': { 'passwd': 'root:x:0:0:root' }
};

export const FileViewerLab: React.FC<LabComponentProps> = ({ config, activeStep, onStepAdvance, onMissionComplete, addLog }) => {
  const env = config.environment as FileSystemEnvironment;
  const VFS = env?.fsStructure || DEFAULT_FS;
  const initialCwd = env?.cwd || '/var/www/html/public';

  const [inputPath, setInputPath] = useState('welcome.txt');
  const [content, setContent] = useState<string | null>(null);
  const [currentDir, setCurrentDir] = useState(initialCwd);

  // Simulate server-side path resolution
  const resolvePath = (base: string, input: string) => {
    // 1. Handle absolute path
    let effectivePath = input.startsWith('/') ? input : `${base}/${input}`;
    
    // 2. Normalize path (handle .. and .)
    const parts = effectivePath.split('/');
    const stack: string[] = [];

    for (const part of parts) {
        if (part === '' || part === '.') continue;
        if (part === '..') {
            if (stack.length > 0) stack.pop();
        } else {
            stack.push(part);
        }
    }

    // 3. Traverse the VFS object
    let current: any = VFS;
    let found = true;
    
    // Root check
    if (stack.length === 0) return null; // Can't read root dir as file

    for (let i = 0; i < stack.length; i++) {
        const segment = stack[i];
        if (current && typeof current === 'object' && segment in current) {
            current = current[segment];
        } else {
            found = false;
            break;
        }
    }

    return found && typeof current === 'string' ? current : null;
  };

  const handleView = (e: React.FormEvent) => {
    e.preventDefault();
    addLog('HTTP', `GET /view?file=${inputPath}`);
    
    // Simulate server logic
    const fileContent = resolvePath(currentDir, inputPath);

    if (fileContent) {
        setContent(fileContent);
        addLog('SUCCESS', `Read ${fileContent.length} bytes`);
        
        if (inputPath.includes('passwd')) {
            onMissionComplete();
        }
        if (activeStep === 0 && inputPath.includes('..')) {
            onStepAdvance();
        }
    } else {
        setContent(null);
        addLog('ERROR', '404 File Not Found or Permission Denied');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
          <h3 className="font-bold text-lg">Document Viewer</h3>
          <p className="text-xs text-gray-500">Enter a filename to view its content.</p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm">
        <form onSubmit={handleView} className="flex gap-2 items-center">
            <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">
                    CWD/
                </span>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded pl-12 pr-4 py-2 font-mono text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={inputPath}
                    onChange={(e) => setInputPath(e.target.value)}
                />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-bold text-sm shadow-sm transition-all">
                Load
            </button>
        </form>
      </div>

      <div className="flex-1 bg-gray-50 rounded-lg border border-gray-300 flex flex-col overflow-hidden relative">
          <div className="bg-gray-200 px-4 py-1.5 border-b border-gray-300 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-600 uppercase">Content Preview</span>
              {content && <span className="text-[10px] text-gray-500 bg-gray-300 px-1.5 rounded">{content.length} bytes</span>}
          </div>
          <div className="flex-1 p-4 overflow-auto">
              {content ? (
                  <pre className="font-mono text-xs text-gray-800 whitespace-pre-wrap">{content}</pre>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                      <span className="material-symbols-outlined text-4xl mb-2">description</span>
                      <span className="text-xs">No file loaded</span>
                  </div>
              )}
          </div>
          
          {/* Visualizing the vulnerability path */}
          {inputPath.includes('..') && (
            <div className="absolute bottom-0 left-0 right-0 bg-yellow-100 border-t border-yellow-200 p-2 text-[10px] text-yellow-800 font-mono">
                <span className="font-bold">Server Path Resolution:</span> {currentDir}/{inputPath}
            </div>
          )}
      </div>
    </div>
  );
};