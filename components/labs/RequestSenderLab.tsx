import React, { useState } from 'react';
import { LabComponentProps, NetworkEnvironment } from '../../types';

export const RequestSenderLab: React.FC<LabComponentProps> = ({ config, activeStep, onStepAdvance, onMissionComplete, addLog }) => {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState<{ status: number; body: string; headers: string } | null>(null);

  const env = config.environment as NetworkEnvironment;
  const INTERNAL_SERVICES = env?.internalHosts || {};

  const handleSsrf = (e: React.FormEvent) => {
    e.preventDefault();
    setResponse(null);
    addLog('HTTP', `POST /check_status url=${url}`);

    setTimeout(() => {
        let matchedBody = '';
        let status = 404;

        // Strip protocol for matching
        const cleanUrl = url.replace('http://', '').replace('https://', '');
        
        // Exact match check or prefix check for metadata
        if (INTERNAL_SERVICES[cleanUrl]) {
            matchedBody = INTERNAL_SERVICES[cleanUrl];
            status = 200;
        } else if (url.includes('google.com')) {
            matchedBody = '<!doctype html><html... Google Search ...</html>';
            status = 200;
        } else {
            matchedBody = 'Error: Connection Refused or Host Unreachable';
            status = 500;
        }

        setResponse({
            status,
            body: matchedBody,
            headers: `HTTP/1.1 ${status} ${status === 200 ? 'OK' : 'Error'}\nContent-Type: text/plain\nContent-Length: ${matchedBody.length}`
        });

        if (status === 200) {
            addLog('SUCCESS', `Received ${matchedBody.length} bytes`);
            if (activeStep === 0 && url.includes('169.254.169.254')) onStepAdvance();
            if (matchedBody.includes('AccessKeyId')) onMissionComplete();
        } else {
            addLog('ERROR', 'Request Failed');
        }

    }, 600);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div>
        <h3 className="font-bold text-lg mb-1">Uptime Monitor</h3>
        <p className="text-xs text-gray-500 mb-4">Check if a website is online. The server will fetch the URL and return the status.</p>
        
        <form onSubmit={handleSsrf} className="flex gap-2">
            <input
            type="text"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="http://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-5 py-2 rounded font-bold text-sm shadow hover:bg-blue-700 transition-colors">
                Check Status
            </button>
        </form>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-0">
          {/* Response Viewer */}
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-auto border border-gray-800 shadow-inner">
              <div className="text-gray-500 mb-2 border-b border-gray-800 pb-1">Response Data</div>
              {response ? (
                  <pre className="whitespace-pre-wrap">{response.body}</pre>
              ) : (
                  <div className="text-gray-600 italic">Waiting for response...</div>
              )}
          </div>

          {/* Network Hints (Simulation of internal network map) */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col">
              <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-400 text-sm">hub</span>
                  Network Topology Hint
              </h4>
              <div className="flex-1 relative">
                  {/* Visual Diagram */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-50 pointer-events-none">
                       <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 w-full text-center">
                           <span className="block text-xs font-bold">Public Internet</span>
                           <span className="text-[10px] text-gray-400">google.com</span>
                       </div>
                       <div className="h-4 w-px bg-gray-300"></div>
                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 w-full text-center shadow-sm">
                           <span className="block text-xs font-bold text-blue-800">Web Server (You are here)</span>
                           <span className="text-[10px] text-blue-400">10.0.0.5</span>
                       </div>
                       <div className="h-4 w-px bg-gray-300"></div>
                       <div className="flex gap-4 w-full">
                           <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                               <span className="block text-[10px] font-bold text-red-800">Admin Panel</span>
                               <span className="text-[9px] text-red-400">127.0.0.1</span>
                           </div>
                           <div className="flex-1 bg-orange-50 border border-orange-200 rounded-lg p-2 text-center">
                               <span className="block text-[10px] font-bold text-orange-800">Cloud Metadata</span>
                               <span className="text-[9px] text-orange-400">169.254.169.254</span>
                           </div>
                       </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};