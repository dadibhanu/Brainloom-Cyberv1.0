import React, { useState } from 'react';
import { LabComponentProps } from '../../types';
import { runValidator } from '../../validators';

export const XssSearchLab: React.FC<LabComponentProps> = ({ config, activeStep, onStepAdvance, onMissionComplete, addLog }) => {
  const [query, setQuery] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  
  const handleXssSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLastQuery(query);
    addLog('HTTP', `GET /search?q=${query}`);
    
    // Check for success condition using central validator
    const result = runValidator(config.validator?.type, query);

    if (result.success) {
         if (activeStep === 0) onStepAdvance();
         addLog('SUCCESS', 'XSS Payload Executed');
         setTimeout(() => {
             // Simulate the browser alert
             const allow = window.confirm("XSS Vulnerability Triggered!\n\nThe page says:\n1\n\n(Click OK to complete mission)");
             if(allow) onMissionComplete();
         }, 300);
    }
  };

  // Construct the "Reflected" HTML source code
  const getReflectedSource = () => {
      const start = `<div class="results-header">\n  <h2>Search Results for: `;
      const injection = lastQuery || '...';
      const end = `</h2>\n</div>\n<div class="results-list">\n  <p>No results found.</p>\n</div>`;
      
      return { start, injection, end };
  };

  const { start, injection, end } = getReflectedSource();

  return (
    <div className="flex flex-col h-full gap-4">
       {/* Browser View */}
       <div className="bg-white rounded-lg border border-gray-300 shadow-sm flex flex-col overflow-hidden">
            <div className="bg-gray-100 border-b px-3 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 bg-white border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-600 truncate font-mono">
                    support.int/search?q={lastQuery}
                </div>
            </div>
            
            <div className="p-6 flex-1 min-h-[150px] bg-white">
                <div className="max-w-md mx-auto">
                    <h1 className="text-xl font-bold text-blue-600 mb-4">Support Center</h1>
                    <form onSubmit={handleXssSearch} className="flex gap-2 mb-6">
                        <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Search articles..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700">Search</button>
                    </form>
                    
                    {lastQuery && (
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded text-sm text-gray-700">
                             {/* We dangerously set inner HTML to show the formatting, but sanitize scripts to prevent self-xss in the app itself unless intended */}
                             {/* For safety in this React App, we render strictly text unless mimicking. 
                                 Here we just render text to show reflection. 
                                 The Inspector below shows the code. */}
                             <h2 className="font-bold text-lg mb-2">Search Results for: {lastQuery}</h2>
                             <p className="text-gray-500 italic">No articles found matching your query.</p>
                        </div>
                    )}
                </div>
            </div>
       </div>

       {/* Source Inspector */}
       <div className="flex-1 bg-[#282a36] rounded-lg border border-gray-700 flex flex-col overflow-hidden shadow-inner">
           <div className="bg-[#44475a] px-3 py-1.5 flex justify-between items-center text-xs text-gray-300 border-b border-gray-600">
               <span className="font-bold">DOM Inspector</span>
               <span className="font-mono">view-source</span>
           </div>
           <div className="p-4 font-mono text-xs overflow-auto">
               <div className="text-[#6272a4] mb-2">&lt;!-- The query parameter is reflected directly into the HTML without sanitization --&gt;</div>
               <div className="text-[#f8f8f2] whitespace-pre-wrap">
                   <span className="text-[#ff79c6]">{start}</span>
                   <span className="bg-[#bd93f9]/30 text-[#8be9fd] border-b border-[#bd93f9] transition-all duration-300">
                       {injection}
                   </span>
                   <span className="text-[#ff79c6]">{end}</span>
               </div>
           </div>
       </div>
    </div>
  );
};