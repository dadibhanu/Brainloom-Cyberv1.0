import React, { useState } from 'react';
import { LabComponentProps } from '../../types';
import { runValidator } from '../../validators';

export const IdorProfileLab: React.FC<LabComponentProps> = ({ config, activeStep, onStepAdvance, onMissionComplete, addLog }) => {
  const [profileId, setProfileId] = useState('1001');

  const handleIdorView = (e: React.FormEvent) => {
    e.preventDefault();
    addLog('HTTP', `GET /profile?id=${profileId}`);
    
    // Check against central validator
    const result = runValidator(config.validator?.type, profileId);

    if (result.success) {
      addLog('SUCCESS', 'Loaded user profile: ADMIN');
      onMissionComplete();
    } else if (profileId === '1001') {
      addLog('SUCCESS', 'Loaded user profile: You');
      if (activeStep === 0) onStepAdvance();
    } else {
      addLog('ERROR', '404 Profile Not Found');
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Social Profile</h3>
      <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-gray-500 text-3xl">person</span>
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-lg">
            {profileId === '1001' ? 'You (Dev)' : profileId === '1000' ? 'Admin (CEO)' : 'Unknown'}
          </h4>
          <p className="text-gray-500 text-sm">ID: {profileId}</p>
        </div>
      </div>
      <form onSubmit={handleIdorView} className="flex gap-2 mb-4 bg-white p-2 border rounded">
        <span className="text-gray-400 text-sm self-center">/profile?id=</span>
        <input
          type="text"
          className="flex-1 border-none p-0 focus:ring-0 text-sm text-gray-700"
          value={profileId}
          onChange={(e) => setProfileId(e.target.value)}
        />
        <button className="text-blue-600 font-bold text-sm px-2">GO</button>
      </form>
    </div>
  );
};