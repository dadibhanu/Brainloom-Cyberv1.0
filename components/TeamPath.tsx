import React from 'react';
import { Course } from '../types';

interface TeamPathProps {
  team: 'RED' | 'BLUE';
  courses: Course[];
  onBack: () => void;
  onStartCourse: (course: Course) => void;
}

export const TeamPath: React.FC<TeamPathProps> = ({ team, courses, onBack, onStartCourse }) => {
  const isRed = team === 'RED';
  const accent = isRed ? 'red' : 'indigo';
  const teamCourses = courses.filter(c => c.category === (isRed ? 'Red Team' : 'Blue Team'));

  // Define curvature for the path - simple zigzag pattern logic
  // Index % 2 === 0 ? 'justify-start' : 'justify-end' for large zigzag
  // But centered is cleaner for web. Let's do a central spine with alternating offsets.

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-light-surface dark:hover:bg-dark-surface text-light-muted dark:text-dark-muted transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
            <h1 className={`text-3xl font-bold ${isRed ? 'text-red-600' : 'text-brand-500'}`}>
                {isRed ? 'Red Team' : 'Blue Team'} Path
            </h1>
            <p className="text-light-muted dark:text-dark-muted text-sm">Master the curriculum step-by-step</p>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative flex flex-col items-center gap-16 md:gap-24">
          {/* Vertical Connector Line (Background) */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -ml-px bg-gradient-to-b from-transparent via-gray-700 to-transparent z-0"></div>

          {teamCourses.map((course, index) => {
              const isLeft = index % 2 === 0;
              const isLocked = course.isLocked;
              const isComplete = course.progress >= 100;
              const inProgress = !isLocked && !isComplete;

              return (
                 <div key={course.id} className={`relative z-10 w-full flex ${isLeft ? 'justify-end md:justify-center' : 'justify-start md:justify-center'}`}>
                     
                     {/* Connector Line from Spine to Node */}
                     <div className={`hidden md:block absolute top-1/2 left-1/2 w-24 h-0.5 bg-gray-700 -translate-y-1/2 ${isLeft ? '-translate-x-full origin-right' : 'origin-left'}`}></div>
                     <div className={`hidden md:block absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gray-600 -translate-y-1/2 -translate-x-1/2 border border-black`}></div>

                     {/* The Node Wrapper - using margins to create zigzag on desktop */}
                     <div 
                         className={`
                            relative flex items-center
                            ${isLeft ? 'md:pr-48 flex-row-reverse md:flex-row' : 'md:pl-48'}
                            transition-all duration-500
                         `}
                     >
                        {/* Info Card (Desktop Only: Visible on side) */}
                        <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-48 p-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-lg transition-opacity ${isLeft ? 'left-full ml-8 text-left' : 'right-full mr-8 text-right'} ${isLocked ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                             <h3 className="font-bold text-sm text-light-text dark:text-dark-text">{course.title}</h3>
                             <p className="text-xs text-light-muted dark:text-dark-muted line-clamp-2 mt-1">{course.description}</p>
                             <div className="mt-2 text-xs font-mono font-bold text-brand-500">{course.xpReward} XP</div>
                        </div>

                        {/* The Node Circle */}
                        <button 
                            onClick={() => !isLocked && onStartCourse(course)}
                            disabled={isLocked}
                            className={`
                                w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center
                                border-4 shadow-xl transition-all duration-300 transform hover:scale-110 relative group
                                ${isComplete 
                                    ? `bg-${accent}-500 border-${accent}-600 text-white shadow-glow-${isRed ? 'brand' : 'success'}`
                                    : inProgress
                                        ? `bg-light-surface dark:bg-dark-surface border-${accent}-500 text-${accent}-500`
                                        : 'bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400 cursor-not-allowed grayscale'
                                }
                            `}
                        >
                            {isLocked ? (
                                <span className="material-symbols-outlined text-2xl">lock</span>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-2xl mb-1">{course.icon}</span>
                                    {isComplete && <span className="absolute bottom-0 right-0 bg-success text-white rounded-full p-1"><span className="material-symbols-outlined text-xs">check</span></span>}
                                </>
                            )}
                            
                            {/* Stars/Rating simulation */}
                            {!isLocked && (
                                <div className="flex gap-0.5 mt-1">
                                    <div className={`w-1 h-1 rounded-full ${isComplete ? 'bg-white' : `bg-${accent}-500`}`}></div>
                                    <div className={`w-1 h-1 rounded-full ${isComplete ? 'bg-white' : `bg-${accent}-500`}`}></div>
                                    <div className={`w-1 h-1 rounded-full ${isComplete ? 'bg-white' : 'bg-gray-300'}`}></div>
                                </div>
                            )}
                        </button>
                        
                        {/* Mobile Label */}
                        <div className="md:hidden absolute top-full mt-2 left-1/2 -translate-x-1/2 w-32 text-center">
                            <span className="text-xs font-bold text-light-text dark:text-dark-text bg-light-surface/80 dark:bg-dark-surface/80 px-2 py-1 rounded backdrop-blur-sm">
                                {course.title}
                            </span>
                        </div>
                    </div>
                </div>
             )
         })}
         
         {/* Finish Line */}
         <div className="relative z-10 w-24 h-4 bg-light-border dark:bg-dark-border rounded-full flex items-center justify-center">
             <span className="text-[10px] uppercase font-bold text-light-muted dark:text-dark-muted">Mastery</span>
         </div>
      </div>
    </div>
  );
};