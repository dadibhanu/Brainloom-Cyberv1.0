import React from 'react';

export const Arena: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pt-12">
      <div className="relative bg-cyber-dark/50 border border-white/10 rounded-2xl p-12 overflow-hidden text-center min-h-[60vh] flex flex-col items-center justify-center">
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/5 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30 mb-8 relative group cursor-default">
               <div className="absolute inset-0 rounded-full animate-ping bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
               <span className="material-symbols-outlined text-5xl text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">swords</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter mb-6">
                Cyber <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Arena</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 font-sans leading-relaxed">
              Real-time Player vs Player CTF battles. <br/>
              Queue up to test your offensive and defensive skills against top operatives.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                 <div className="px-8 py-4 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm">
                    <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Status</div>
                    <div className="font-mono text-white font-bold animate-pulse">MATCHMAKING_OFFLINE</div>
                 </div>
                 
                 <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-lg">
                     <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Coming In</div>
                     <div className="font-mono text-white font-bold">SEASON 2</div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};