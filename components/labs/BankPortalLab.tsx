import React, { useState } from 'react';
import { LabComponentProps, NetworkEnvironment } from '../../types';
import { runValidator } from '../../validators';

export const BankPortalLab: React.FC<LabComponentProps> = ({ config, activeStep, onStepAdvance, onMissionComplete, addLog }) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [botLink, setBotLink] = useState('');
  const env = config.environment as NetworkEnvironment;

  const handleCsrfTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    addLog('HTTP', `GET /transfer?to=${to}&amount=${amount}`);
    if (to.toLowerCase() === 'attacker' && amount === '100') {
      onStepAdvance();
      addLog('SUCCESS', 'Transfer confirmed.');
    }
    setTo('');
    setAmount('');
  };

  const handleBotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLog('INFO', 'Support Bot is reviewing your link...');
    setTimeout(() => {
      const target = env?.botTarget || 'Attacker';
      const result = runValidator(config.validator?.type, botLink, { target });
      
      if (result.success) {
        addLog('HTTP', `[BOT USER] GET ${botLink}`);
        addLog('SUCCESS', result.message || 'Success');
        onMissionComplete();
      } else {
        addLog('INFO', result.message || 'Bot action failed');
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="font-bold text-lg flex justify-between items-center">
          My Bank
          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Balance: ${100}</span>
        </h3>
        <p className="text-xs text-gray-500 mb-2">Authenticated as: User</p>
        <form onSubmit={handleCsrfTransfer} className="flex gap-2 items-end">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500">To</label>
            <input
              type="text"
              className="w-20 border p-1 rounded text-sm"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="User"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500">$$$</label>
            <input
              type="text"
              className="w-16 border p-1 rounded text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm h-[30px]">Send</button>
        </form>
      </div>
      <div>
        <h3 className="font-bold text-sm text-gray-700 mb-2">Support Chat (Admin Bot)</h3>
        <form onSubmit={handleBotSubmit} className="flex gap-2">
          <input
            type="text"
            className="flex-1 border p-2 rounded text-xs"
            placeholder="http://bank.int/..."
            value={botLink}
            onChange={(e) => setBotLink(e.target.value)}
          />
          <button className="bg-gray-800 text-white px-3 text-xs rounded">Send</button>
        </form>
      </div>
    </div>
  );
};