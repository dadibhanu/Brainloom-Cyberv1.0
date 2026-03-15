import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

export const AiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
      {role: 'model', text: 'Hi! I am Brainloom Bot. I can explain cybersecurity concepts or help you if you get stuck on a lab.'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if(isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Construct history for context
        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));
        // Add current message
        history.push({ role: 'user', parts: [{ text: userMsg }] });

        const result = await ai.models.generateContent({
             model: "gemini-3-flash-preview",
             contents: history,
             config: {
                 systemInstruction: "You are Brainloom Bot, a friendly cybersecurity expert mentor. You help students understand concepts like XSS, SQLi, etc. If they ask for the answer to a flag or lab directly, give them a hint instead of the solution. Keep answers concise."
             }
        });

        const responseText = result.text;
        if (responseText) {
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        }

    } catch (error) {
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to the neural network right now." }]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-primary-light text-white rounded-full shadow-[0_0_20px_rgba(19,91,236,0.5)] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <span className="material-symbols-outlined text-2xl">{isOpen ? 'close' : 'smart_toy'}</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-background-card border border-surface-highlight rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="bg-primary/10 border-b border-white/10 p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm">Brainloom Bot</h3>
                    <p className="text-xs text-primary-light flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-dark/50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                            msg.role === 'user' 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-surface-highlight text-gray-200 rounded-tl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-surface-highlight rounded-2xl rounded-tl-none px-4 py-2 flex gap-1">
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-background-card border-t border-white/5">
                <div className="relative">
                    <input 
                        type="text" 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask about XSS, SQLi..." 
                        className="w-full bg-surface-dark border border-surface-highlight rounded-full py-2.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <button 
                        disabled={loading}
                        className="absolute right-1 top-1 w-8 h-8 bg-primary hover:bg-primary-light text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                </div>
            </form>
        </div>
      )}
    </>
  );
};