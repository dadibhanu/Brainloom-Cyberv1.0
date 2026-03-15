import React, { useState, useMemo } from 'react';
import { Course } from '../types';

interface LabsGridProps {
  courses: Course[];
  onStartLab: (course: Course) => void;
}

const DifficultyBadge: React.FC<{ level: Course['difficulty'] }> = ({ level }) => {
  const styles = {
    EASY: 'text-cyber-success border-cyber-success',
    MEDIUM: 'text-cyber-warning border-cyber-warning',
    HARD: 'text-cyber-accent border-cyber-accent',
  };

  return (
    <span className={`text-[9px] font-bold font-tech px-2 py-0.5 border ${styles[level]} uppercase tracking-widest bg-black/50`}>
      {level}
    </span>
  );
};

export const LabsGrid: React.FC<LabsGridProps> = ({ courses, onStartLab }) => {
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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white uppercase tracking-tighter mb-2">Lab Library</h1>
            <p className="text-gray-400 text-sm">Access the complete catalog of simulation environments.</p>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-mono text-gray-300">{courses.length} LABS ONLINE</span>
          </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-4 bg-black/40 p-4 rounded-lg">
         <div className="flex items-center gap-2">
             <span className="material-symbols-outlined text-cyber-primary">filter_list</span>
             <h2 className="text-sm font-bold text-white uppercase tracking-widest">Filters</h2>
         </div>
         
         <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
             {/* Category Tabs */}
             <div className="flex bg-white/5 p-1 rounded">
                {['ALL', 'Red Team', 'Blue Team'].map((filter) => (
                   <button
                     key={filter}
                     onClick={() => setCategoryFilter(filter as any)}
                     className={`px-4 py-1.5 text-[10px] font-bold font-tech uppercase tracking-wider transition-all rounded ${
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
                    className="appearance-none bg-black border border-white/20 text-white pl-4 pr-10 py-1.5 text-xs font-tech uppercase focus:border-cyber-primary focus:ring-0 cursor-pointer w-32 rounded"
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
             <div className="relative flex-1 md:flex-none md:w-64">
                <input 
                   type="text" 
                   placeholder="SEARCH LABS..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="w-full bg-black border border-white/20 text-white pl-10 pr-4 py-1.5 text-xs font-tech focus:border-cyber-primary focus:ring-0 placeholder:text-slate-600 rounded"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
             </div>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredCourses.map(course => (
            <div 
               key={course.id}
               className={`group relative bg-cyber-dark border border-white/10 overflow-hidden transition-all hover:border-cyber-primary/50 rounded-lg hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] ${course.isLocked ? 'opacity-50 grayscale' : ''}`}
            >
               {/* Hover Effect Line */}
               <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

               <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                     <span className="material-symbols-outlined text-2xl text-slate-500 group-hover:text-white transition-colors p-2 bg-white/5 rounded-lg">{course.icon}</span>
                     {!course.isLocked ? <DifficultyBadge level={course.difficulty} /> : <span className="material-symbols-outlined text-sm text-slate-600">lock</span>}
                  </div>
                  
                  <h3 className="font-display font-bold text-lg text-white mb-2 leading-tight uppercase tracking-wide group-hover:text-cyber-primary transition-colors">
                     {course.title}
                  </h3>
                  <p className="text-xs font-sans text-slate-400 line-clamp-2 mb-6 leading-relaxed">
                     {course.description}
                  </p>
                  
                  <div className="mt-auto border-t border-white/5 pt-4 flex items-center justify-between">
                     <div className="text-[10px] text-slate-500 font-tech uppercase">
                        {course.xpReward} XP REWARD
                     </div>
                     {!course.isLocked ? (
                        <button 
                           onClick={() => onStartLab(course)}
                           className="text-[10px] font-bold font-tech text-cyber-primary hover:text-white uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                        >
                           LAUNCH LAB <span className="material-symbols-outlined text-[10px]">rocket_launch</span>
                        </button>
                     ) : (
                         <span className="text-[10px] font-tech text-slate-600 uppercase">LOCKED</span>
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