import React, { useState } from 'react';
import { LabComponentProps } from '../../types';
import { runValidator } from '../../validators';

export const BolaApiLab: React.FC<LabComponentProps> = ({ config, activeStep, onStepAdvance, onMissionComplete, addLog }) => {
  const [endpoint, setEndpoint] = useState('/orders/55');
  const [output, setOutput] = useState<string | null>(null);

  const handleBolaRequest = (e: React.FormEvent) => {
    e.preventDefault();
    addLog('HTTP', `GET ${endpoint}`);

    // Central Validation
    const result = runValidator(config.validator?.type, endpoint);

    if (result.success) {
       setOutput(JSON.stringify({ id: 56, items: ['Rolex', 'MacBook'], total: 4500.00, owner: 'vip_user', cc: '4111-xxxx-xxxx-1234' }, null, 2));
       addLog('SUCCESS', '200 OK - Accessing VIP Data');
       onMissionComplete();
    } else if (endpoint.endsWith('/55')) {
       setOutput(JSON.stringify({ id: 55, items: ['T-Shirt'], total: 25.00, owner: 'me' }, null, 2));
       addLog('SUCCESS', '200 OK');
       if (activeStep === 0) onStepAdvance();
    } else {
       setOutput(JSON.stringify({ error: 'Order not found' }, null, 2));
       addLog('ERROR', '404 Not Found');
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-2">API Debugger</h3>
      <form onSubmit={handleBolaRequest} className="space-y-4">
        <div className="flex gap-0">
          <span className="bg-gray-200 border border-r-0 border-gray-300 text-gray-600 text-xs font-bold px-3 py-2 rounded-l flex items-center">
            GET
          </span>
          <input
            type="text"
            className="flex-1 border-gray-300 rounded-r text-sm focus:border-blue-500 focus:ring-blue-500"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded font-bold text-sm">Send Request</button>
      </form>
      {output && (
        <div className="mt-4">
          <pre className="bg-slate-800 text-green-400 p-3 rounded text-xs font-mono overflow-auto h-40">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};