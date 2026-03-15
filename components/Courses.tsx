import React, { useState, useMemo } from 'react';
import { Course } from '../types';

interface CoursesProps {
  courses: Course[];
  onViewPath: (path: 'RED' | 'BLUE') => void;
  onStartCourse: (course: Course) => void;
}

const DifficultyBadge: React.FC<{ level: Course['difficulty'] }> = ({ level }) => {
  const styles = {
    EASY: 'text-cyber-success border-cyber-success bg-cyber-success/5',
    MEDIUM: 'text-cyber-warning border-cyber-warning bg-cyber-warning/5',
    HARD: 'text-cyber-accent border-cyber-accent bg-cyber-accent/5',
  };

  return (
    <span className={`text-[9px] font-bold font-tech px-2 py-0.5 border rounded ${styles[level]} uppercase tracking-widest`}>
      {level}
    </span>
  );
};

export const Courses: React.FC<CoursesProps> = ({ courses, onViewPath, onStartCourse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Red Team' | 'Blue Team'>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || course.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === 'ALL' || course.difficulty === difficultyFilter;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [courses, searchTerm, categoryFilter, difficultyFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* Path Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Red Team */}
         <div 
           onClick={() => onViewPath('RED')}
           className="group cursor-pointer relative h-64 overflow-hidden clip-corner-tl-br bg-cyber-dark border border-white/5 hover:border-cyber-accent/50 transition-all duration-300"
         >
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-accent/20 to-transparent opacity-20 group-hover:opacity-30 transition-opacity"></div>
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
            
            <div className="relative z-10 p-8 h-full flex flex-col">
               <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-cyber-accent/10 border border-cyber-accent flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-cyber-accent">swords</span>
                  </div>
                  <span className="text-cyber-accent font-tech text-xs uppercase tracking-[0.2em]">Offensive</span>
               </div>
               
               <div className="mt-auto">
                  <h2 className="text-3xl font-display font-bold text-white mb-2 uppercase tracking-wide group-hover:text-cyber-accent transition-colors">
                      Red Team
                  </h2>
                  <div className="h-px w-full bg-white/10 mb-4 group-hover:bg-cyber-accent/50 transition-colors"></div>
                  <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-tech">PENETRATION TESTING // EXPLOIT DEV</span>
                      <span className="material-symbols-outlined text-white group-hover:translate-x-2 transition-transform">arrow_forward</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Blue Team */}
         <div 
           onClick={() => onViewPath('BLUE')}
           className="group cursor-pointer relative h-64 overflow-hidden clip-corner-tl-br bg-cyber-dark border border-white/5 hover:border-cyber-primary/50 transition-all duration-300"
         >
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/20 to-transparent opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
            
            <div className="relative z-10 p-8 h-full flex flex-col">
               <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-cyber-primary/10 border border-cyber-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-cyber-primary">security</span>
                  </div>
                  <span className="text-cyber-primary font-tech text-xs uppercase tracking-[0.2em]">Defensive</span>
               </div>
               
               <div className="mt-auto">
                  <h2 className="text-3xl font-display font-bold text-white mb-2 uppercase tracking-wide group-hover:text-cyber-primary transition-colors">
                      Blue Team
                  </h2>
                  <div className="h-px w-full bg-white/10 mb-4 group-hover:bg-cyber-primary/50 transition-colors"></div>
                  <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-tech">THREAT ANALYSIS // INCIDENT RESPONSE</span>
                      <span className="material-symbols-outlined text-white group-hover:translate-x-2 transition-transform">arrow_forward</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-4">
         <div className="flex items-center gap-2">
             <span className="w-2 h-2 bg-cyber-primary rounded-none animate-pulse"></span>
             <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest">Training Modules</h2>
         </div>
         
         <div className="flex flex-wrap items-center gap-4">
             {/* Category Tabs */}
             <div className="flex bg-white/5 p-1 clip-corner-br">
                {['ALL', 'Red Team', 'Blue Team'].map((filter) => (
                   <button
                     key={filter}
                     onClick={() => setCategoryFilter(filter as any)}
                     className={`px-4 py-1.5 text-[10px] font-bold font-tech uppercase tracking-wider transition-all ${
                       categoryFilter === filter 
                       ? 'bg-cyber-primary text-black' 
                       : 'text-slate-400 hover:text-white'
                     }`}
                   >
                     {filter}
                   </button>
                ))}
             </div>

             {/* Difficulty */}
             <div className="relative group">
                <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value as any)}
                    className="appearance-none bg-black border border-white/20 text-white pl-4 pr-10 py-1.5 text-xs font-tech uppercase focus:border-cyber-primary focus:ring-0 cursor-pointer w-32"
                >
                    <option value="ALL">Difficulty: All</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cyber-primary">
                    <span className="material-symbols-outlined text-xs">expand_more</span>
                </div>
             </div>
             
             {/* Search */}
             <div className="relative">
                <input 
                   type="text" 
                   placeholder="SEARCH DATABASE..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="bg-black border border-white/20 text-white pl-4 pr-4 py-1.5 text-xs font-tech w-48 focus:border-cyber-primary focus:ring-0 placeholder:text-slate-600"
                />
             </div>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredCourses.map(course => (
            <div 
               key={course.id}
               className={`group relative bg-cyber-dark border border-white/10 rounded-xl overflow-hidden transition-all hover:border-cyber-primary/50 hover:shadow-lg hover:shadow-cyber-primary/10 hover:-translate-y-1 ${course.isLocked ? 'opacity-60' : ''}`}
            >
               {/* Hover Effect Line */}
               <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

               <div className="p-6 flex flex-col h-full relative z-10">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-5">
                     <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyber-primary/10 group-hover:border-cyber-primary/30 transition-all duration-300">
                        <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-cyber-primary transition-colors">{course.icon}</span>
                     </div>
                     {!course.isLocked ? (
                        <DifficultyBadge level={course.difficulty} /> 
                     ) : (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/5">
                            <span className="material-symbols-outlined text-[10px] text-slate-500">lock</span>
                            <span className="text-[9px] font-tech text-slate-500 uppercase tracking-wider">Lvl {course.requiredLevel}</span>
                        </div>
                     )}
                  </div>
                  
                  {/* Card Body */}
                  <div className="mb-6 flex-1">
                      <h3 className="font-display font-bold text-lg text-white mb-2 leading-tight uppercase tracking-wide group-hover:text-cyber-primary transition-colors">
                         {course.title}
                      </h3>
                      <p className="text-sm font-sans text-slate-400 line-clamp-3 leading-relaxed">
                         {course.description}
                      </p>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                     <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 font-tech uppercase tracking-wider mb-0.5">Duration</span>
                        <span className="text-xs font-mono text-slate-300 font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px] text-cyber-primary">schedule</span>
                            {course.timeEstimate}
                        </span>
                     </div>
                     
                     {!course.isLocked ? (
                        <button 
                           onClick={() => onStartCourse(course)}
                           className="relative overflow-hidden px-4 py-2 bg-white/5 hover:bg-cyber-primary text-cyber-primary hover:text-black border border-white/10 hover:border-cyber-primary rounded-lg text-[10px] font-bold font-tech uppercase tracking-wider transition-all duration-300 flex items-center gap-2 group/btn"
                        >
                           <span>{course.progress > 0 ? 'Resume' : 'Start Lab'}</span>
                           <span className="material-symbols-outlined text-[12px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                     ) : (
                         <button disabled className="px-4 py-2 bg-black/20 border border-white/5 text-slate-600 rounded-lg text-[10px] font-bold font-tech uppercase tracking-wider cursor-not-allowed">
                             Locked
                         </button>
                     )}
                  </div>
               </div>
               
               {/* Progress Bar */}
               {!course.isLocked && course.progress > 0 && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                     <div className="h-full bg-cyber-primary shadow-[0_0_5px_#00f0ff]" style={{ width: `${course.progress}%` }}></div>
                  </div>
               )}
            </div>
         ))}
      </div>
    </div>
  );
};