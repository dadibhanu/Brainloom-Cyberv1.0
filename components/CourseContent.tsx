import React from 'react';
import { Course, CourseModule } from '../types';
import { EduContentRenderer } from './EduContentRenderer';

interface CourseContentProps {
  course: Course;
  modules: Record<string, CourseModule>;
  onStartLab: () => void;
  onBack: () => void;
}

export const CourseContent: React.FC<CourseContentProps> = ({ course, modules, onStartLab, onBack }) => {
  const moduleData = modules[course.id];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Navigation */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-cyber-primary mb-8 transition-colors group text-xs font-tech uppercase tracking-wider"
      >
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Return to Database
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
             {/* Header */}
            <div className="bg-cyber-dark/80 border border-white/10 p-8 relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity">
                   <span className="material-symbols-outlined text-[200px] text-white">{course.icon}</span>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                     <span className={`px-2 py-0.5 text-[9px] font-bold font-tech uppercase tracking-widest border ${
                        course.category === 'Red Team' 
                            ? 'text-cyber-accent border-cyber-accent' 
                            : 'text-cyber-primary border-cyber-primary'
                     }`}>
                        {course.category}
                     </span>
                     <span className="text-slate-500 text-xs flex items-center gap-1 font-tech uppercase">
                        <span className="material-symbols-outlined text-[12px]">schedule</span> {course.timeEstimate}
                     </span>
                  </div>
                  <h1 className="text-4xl font-display font-bold text-white mb-6 uppercase tracking-wide drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{course.title}</h1>
                  <p className="text-slate-300 text-lg leading-relaxed font-sans border-l-2 border-white/10 pl-4">{course.description}</p>
                </div>
            </div>

            {/* Educational Content */}
            <div className="bg-black/40 border border-white/10 p-8 prose prose-invert max-w-none font-sans">
                {moduleData ? (
                    moduleData.education ? (
                        <EduContentRenderer data={moduleData.education} />
                    ) : moduleData.content ? (
                        moduleData.content
                    ) : (
                        <div className="p-8 border border-dashed border-white/10 text-center text-slate-500 font-tech">
                            DATA_STREAM_INTERRUPTED // NO CONTENT
                        </div>
                    )
                ) : (
                     <div className="p-8 border border-dashed border-white/10 text-center text-slate-500 font-tech">
                        MODULE_NOT_INITIALIZED // LOADING...
                     </div>
                )}
            </div>
        </div>

            {/* Sidebar Actions */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                <button 
                    onClick={onStartLab}
                    className="w-full py-4 bg-cyber-primary hover:bg-cyber-primary/90 text-black font-bold font-display uppercase tracking-widest text-lg rounded shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 group"
                >
                    <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">rocket_launch</span>
                    Launch Lab
                </button>

                <div className="bg-cyber-dark/90 border border-white/10 p-1 clip-corner-br">
                <div className="bg-black/40 p-5">
                    <h3 className="font-bold text-white mb-4 text-xs font-tech uppercase tracking-widest border-b border-white/10 pb-2">Mission Parameters</h3>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/5">
                            <div className="text-cyber-primary pt-0.5">
                                <span className="material-symbols-outlined text-lg">public</span>
                            </div>
                            <div>
                                <div className="text-[9px] font-bold text-slate-500 uppercase font-tech tracking-wider">Target Host</div>
                                <div className="text-sm font-mono text-white">
                                    {moduleData?.labConfig.urlBar.split('/')[0] || 'Unknown'}
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-white/5 border border-white/5">
                                <div className="text-[9px] font-bold text-slate-500 uppercase font-tech tracking-wider">Bounty</div>
                                <div className="text-cyber-warning font-bold font-mono">{course.xpReward} XP</div>
                            </div>
                            <div className="p-3 bg-white/5 border border-white/5">
                                <div className="text-[9px] font-bold text-slate-500 uppercase font-tech tracking-wider">Threat Lvl</div>
                                <div className={`font-bold font-tech uppercase ${course.difficulty === 'HARD' ? 'text-cyber-accent' : course.difficulty === 'MEDIUM' ? 'text-cyber-warning' : 'text-cyber-success'}`}>
                                    {course.difficulty}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Topics Section */}
                    <div className="mb-6">
                        <div className="text-[9px] font-bold text-slate-500 uppercase font-tech tracking-wider mb-2">Key Topics</div>
                        <div className="flex flex-wrap gap-2">
                            {course.topics && course.topics.length > 0 ? course.topics.map((topic, index) => (
                                <span key={index} className="text-[10px] px-2 py-1 bg-white/5 rounded text-gray-300 border border-white/10">
                                    {topic}
                                </span>
                            )) : (
                                <span className="text-[10px] text-gray-600">No topic data available</span>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={onStartLab}
                        className="w-full bg-cyber-primary text-black font-bold font-tech uppercase tracking-wider py-4 hover:bg-white transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] flex items-center justify-center gap-2 group clip-corner-br"
                    >
                        <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">rocket_launch</span>
                        Initialize Simulation
                    </button>
                    <p className="text-center text-[10px] text-slate-600 font-tech mt-3 uppercase">
                        Secure Connection Required
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};