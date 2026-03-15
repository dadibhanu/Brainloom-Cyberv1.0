import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LabComponentProps, AiEnvironment } from '../../types';

export const AiTargetLab: React.FC<LabComponentProps> = ({ config, activeStep, onStepAdvance, onMissionComplete, addLog }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  
  const env = config.environment as AiEnvironment;

  const handleAiPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    addLog('QUERY', prompt);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemP = env?.systemPrompt || "You are a helpful assistant.";

    try {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `System Instruction: ${systemP}\n\nUser Input: ${prompt}` }] }
        ]
      });
      const text = result.text;
      if (text) {
        setResponse(text);
        addLog('AI', text);

        if (text.includes('BRAINLOOM_AI_MASTER')) {
          onMissionComplete();
          addLog('SUCCESS', 'Secret Leaked!');
        }
      }
    } catch (err) {
      setResponse("AI Error: Service unavailable.");
      addLog('ERROR', 'AI Service Error');
    }
    setPrompt('');
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-bold text-lg mb-2">Corporate AI Chat</h3>
      <div className="flex-1 bg-gray-100 rounded-lg p-4 mb-4 overflow-y-auto border">
        <div className="flex flex-col gap-3">
          <div className="self-start bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%] text-sm">
            Hello! I am the corporate AI assistant. How can I help you today?
          </div>
          {response && (
            <div className="self-start bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%] text-sm">
              {response}
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleAiPrompt} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Ask something..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button className="bg-blue-600 text-white rounded-lg px-4 py-2 font-bold">
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
};