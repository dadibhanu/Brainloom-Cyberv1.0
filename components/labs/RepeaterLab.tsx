import React, { useState, useEffect } from 'react';
import { LabComponentProps, RepeaterEnvironment } from '../../types';
import { runValidator } from '../../validators';

export const RepeaterLab: React.FC<LabComponentProps> = ({ config, activeStep, onStepAdvance, onMissionComplete, addLog }) => {
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [output, setOutput] = useState<string | null>(null);

  const env = config.environment as RepeaterEnvironment;

  useEffect(() => {
    setMethod(env?.initialMethod || 'GET');
    setHeaders(
      env?.initialHeaders
        ? Object.entries(env.initialHeaders).map(([k, v]) => `${k}: ${v}`).join('\n')
        : ''
    );
    setBody(env?.initialBody || '');
  }, [config]);

  const handleRepeaterSend = (e: React.FormEvent) => {
    e.preventDefault();
    addLog('HTTP', `${method} /${config.urlBar.split('/')[1] || ''}`);

    const headerObj: Record<string, string> = {};
    headers.split('\n').forEach((line) => {
      const [k, v] = line.split(':');
      if (k && v) headerObj[k.trim()] = v.trim();
    });

    // Use centralized validator
    if (config.validator?.type) {
      const result = runValidator(config.validator.type, { method, headers: headerObj, body }, {}, config.validator.params);
      
      if (result.success) {
        setOutput(result.message || 'HTTP 200 OK');
        addLog('SUCCESS', 'Exploit Successful');
        onMissionComplete();
      } else {
        setOutput(result.message || 'HTTP 401 Unauthorized\nOr invalid request.');
        addLog('ERROR', 'Request Failed');
      }
    } else {
      setOutput('HTTP 200 OK');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="font-bold text-lg mb-2 flex justify-between">
        Request Repeater
        <button
          onClick={handleRepeaterSend}
          className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold shadow hover:bg-orange-600"
        >
          SEND
        </button>
      </h3>
      <div className="flex-1 grid grid-rows-2 gap-4 h-full">
        <div className="bg-gray-100 border rounded p-2 flex flex-col gap-2 font-mono text-xs">
          <div className="flex gap-2">
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="p-1 rounded border">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
            <input className="flex-1 p-1 rounded border bg-white" value={config.urlBar} disabled />
          </div>
          <textarea
            className="w-full h-20 p-2 border rounded resize-none"
            placeholder="Headers (Key: Value)"
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
          />
          <textarea
            className="w-full flex-1 p-2 border rounded resize-none"
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded p-3 font-mono text-xs text-green-400 overflow-auto">
          {output || '// Response will appear here...'}
        </div>
      </div>
    </div>
  );
};