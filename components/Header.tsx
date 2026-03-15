import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  currentPage: 'courses' | 'leaderboard';
  onNavigate: (page: 'courses' | 'leaderboard') => void;
}

export const Header: React.FC<HeaderProps> = ({ user, currentPage, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-surface-highlight bg-background-dark/80 backdrop-blur-md px-6 py-4 lg:px-10">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate('courses')}>
        <div className="flex h-10 w-10 items-center justify-center rounded bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-white text-2xl">memory</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white font-display">Brainloom</h2>
      </div>

      <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
        <nav className="flex items-center gap-8 mr-4">
          <button
            onClick={() => onNavigate('courses')}
            className={`text-sm font-medium transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] ${
              currentPage === 'courses' 
                ? 'text-white border-b-2 border-primary pb-0.5' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => onNavigate('leaderboard')}
            className={`text-sm font-medium transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] ${
              currentPage === 'leaderboard' 
                ? 'text-white border-b-2 border-primary pb-0.5' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Leaderboard
          </button>
        </nav>
        {user && (
            <div className="flex items-center gap-4 pl-6 border-l border-surface-highlight">
            <div className="flex flex-col items-end">
                <span className="text-xs text-primary font-bold tracking-wider">LEVEL {user.level}</span>
                <div className="text-xs text-slate-400">{user.xp} XP</div>
            </div>
            {/* XP Progress Ring (Simulated with div) */}
            <div className="relative size-10 rounded-full p-[2px] bg-gradient-to-tr from-primary to-purple-500">
                <div
                className="h-full w-full rounded-full bg-surface-dark bg-center bg-cover border-2 border-transparent"
                style={{ backgroundImage: `url('${user.avatar}')` }}
                ></div>
            </div>
            </div>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <button className="md:hidden text-white">
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  );
};