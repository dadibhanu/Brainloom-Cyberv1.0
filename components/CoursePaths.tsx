import React from 'react';
import { Course } from '../types';

interface CoursePathsProps {
  onViewPath: (path: 'RED' | 'BLUE') => void;
  courses: Course[];
}

export const CoursePaths: React.FC<CoursePathsProps> = ({ onViewPath, courses }) => {
  const redCount = courses.filter(c => c.category === 'Red Team').length;
  const blueCount = courses.filter(c => c.category === 'Blue Team').length;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-black text-white uppercase tracking-tighter mb-4">Select Your Path</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Choose a specialization track to begin your journey. Each path consists of curated modules designed to take you from novice to expert.</p>
      </div>

      {/* Path Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Red Team */}
         <div 
           onClick={() => onViewPath('RED')}
           className="group cursor-pointer relative h-96 overflow-hidden clip-corner-tl-br bg-cyber-dark border border-white/5 hover:border-cyber-accent/50 transition-all duration-300"
         >
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-accent/20 to-transparent opacity-20 group-hover:opacity-30 transition-opacity"></div>
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
            
            <div className="relative z-10 p-10 h-full flex flex-col">
               <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-cyber-accent/10 border border-cyber-accent flex items-center justify-center rounded-lg">
                    <span className="material-symbols-outlined text-3xl text-cyber-accent">swords</span>
                  </div>
                  <span className="text-cyber-accent font-tech text-xs uppercase tracking-[0.2em] border border-cyber-accent/30 px-3 py-1 rounded-full">Offensive Security</span>
               </div>
               
               <div className="mt-auto">
                  <h2 className="text-4xl font-display font-bold text-white mb-4 uppercase tracking-wide group-hover:text-cyber-accent transition-colors">
                      Red Team
                  </h2>
                  <p className="text-gray-400 mb-6 font-sans leading-relaxed">
                      Master the art of penetration testing. Learn to exploit vulnerabilities, bypass defenses, and simulate real-world attacks to strengthen security.
                  </p>
                  
                  <div className="space-y-2 mb-8">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                          <span className="material-symbols-outlined text-xs text-cyber-accent">check_circle</span> Web Application Hacking
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                          <span className="material-symbols-outlined text-xs text-cyber-accent">check_circle</span> Network Exploitation
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                          <span className="material-symbols-outlined text-xs text-cyber-accent">check_circle</span> Privilege Escalation
                      </div>
                  </div>

                  <div className="h-px w-full bg-white/10 mb-4 group-hover:bg-cyber-accent/50 transition-colors"></div>
                  <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-tech">{redCount} MODULES // {redCount * 2} LABS</span>
                      <span className="material-symbols-outlined text-white group-hover:translate-x-2 transition-transform">arrow_forward</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Blue Team */}
         <div 
           onClick={() => onViewPath('BLUE')}
           className="group cursor-pointer relative h-96 overflow-hidden clip-corner-tl-br bg-cyber-dark border border-white/5 hover:border-cyber-primary/50 transition-all duration-300"
         >
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/20 to-transparent opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
            
            <div className="relative z-10 p-10 h-full flex flex-col">
               <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-cyber-primary/10 border border-cyber-primary flex items-center justify-center rounded-lg">
                    <span className="material-symbols-outlined text-3xl text-cyber-primary">security</span>
                  </div>
                  <span className="text-cyber-primary font-tech text-xs uppercase tracking-[0.2em] border border-cyber-primary/30 px-3 py-1 rounded-full">Defensive Security</span>
               </div>
               
               <div className="mt-auto">
                  <h2 className="text-4xl font-display font-bold text-white mb-4 uppercase tracking-wide group-hover:text-cyber-primary transition-colors">
                      Blue Team
                  </h2>
                  <p className="text-gray-400 mb-6 font-sans leading-relaxed">
                      Become a defender. Learn threat analysis, incident response, and how to secure infrastructure against sophisticated cyber attacks.
                  </p>

                  <div className="space-y-2 mb-8">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                          <span className="material-symbols-outlined text-xs text-cyber-primary">check_circle</span> Threat Hunting
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                          <span className="material-symbols-outlined text-xs text-cyber-primary">check_circle</span> Digital Forensics
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                          <span className="material-symbols-outlined text-xs text-cyber-primary">check_circle</span> Security Engineering
                      </div>
                  </div>

                  <div className="h-px w-full bg-white/10 mb-4 group-hover:bg-cyber-primary/50 transition-colors"></div>
                  <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-tech">{blueCount} MODULES // {blueCount * 2} LABS</span>
                      <span className="material-symbols-outlined text-white group-hover:translate-x-2 transition-transform">arrow_forward</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};