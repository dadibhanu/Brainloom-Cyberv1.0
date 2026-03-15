import React, { useState } from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  currentView: string;
  onNavigate: (view: any) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, currentView, onNavigate, isDark, toggleTheme, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const NavLink = ({ view, label }: { view: string; label: string }) => {
    // Logic for 'active' state highlighting
    let isActive = false;
    if (view === 'courses') {
        isActive = currentView === 'courses' || currentView === 'red-path' || currentView === 'blue-path' || currentView === 'course-content';
    } else if (view === 'labs') {
        isActive = currentView === 'labs' || currentView === 'lab-active';
    } else {
        isActive = currentView === view;
    }

    return (
      <button
        onClick={() => { onNavigate(view); setMobileMenuOpen(false); }}
        className={`text-sm font-bold tracking-wide transition-colors uppercase font-display ${
          isActive
            ? 'text-white text-glow'
            : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-black font-sans relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-glow-radial opacity-30 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

      {/* Top Navigation Bar */}
      <header className="h-20 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
         
         {/* Logo Section */}
         <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('dashboard')}>
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent-cyan blur opacity-50 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                <div className="relative bg-black border border-white/10 rounded-lg px-3 py-1 flex items-center">
                    <span className="font-display font-black text-2xl tracking-widest text-white italic group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                        BRAIN<span className="text-primary">LOOM</span>
                    </span>
                </div>
            </div>
         </div>

         {/* Desktop Nav */}
         <nav className="hidden md:flex items-center gap-8">
            <NavLink view="dashboard" label="Dashboard" />
            <NavLink view="courses" label="Courses" />
            <NavLink view="labs" label="Labs" />
            <NavLink view="arena" label="Arena" />
            <NavLink view="leaderboard" label="Leaderboard" />
         </nav>

         {/* Profile & Actions */}
         <div className="hidden md:flex items-center gap-4">
             {user ? (
                 <>
                    {/* Admin Trigger (Visible only for ADMIN role) */}
                     {user.role === 'ADMIN' && (
                        <button 
                            onClick={() => onNavigate('admin')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors group"
                        >
                            <span className="material-symbols-outlined text-red-500 text-lg group-hover:animate-spin">settings</span>
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Admin</span>
                        </button>
                     )}

                    {/* Profile Pill */}
                     <div className="relative">
                         <div 
                            className="relative group cursor-pointer"
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                         >
                             {/* Glow effect behind pill */}
                             <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
                             
                             <div className="relative flex items-center bg-[#111] rounded-full border border-white/10 px-1 py-1 pr-6 pill-gradient">
                                 {/* Avatar */}
                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 p-[1px] mr-3">
                                     <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-black" referrerPolicy="no-referrer" />
                                 </div>
                                 
                                 {/* User Info */}
                                 <div className="flex flex-col mr-4">
                                     <span className="text-white font-bold text-sm leading-none font-display tracking-wide">{user.handle}</span>
                                     <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-gray-400">
                                         <span className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                            {user.badges.length}
                                         </span>
                                         <span className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            {user.xp}
                                         </span>
                                         <span className="flex items-center gap-1 text-yellow-500">
                                            <span className="material-symbols-outlined text-[10px]">emoji_events</span>
                                            {user.rank}
                                         </span>
                                     </div>
                                 </div>
                             </div>
                         </div>

                         {/* Profile Dropdown */}
                         {profileMenuOpen && (
                             <div className="absolute top-full right-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                 <div className="px-4 py-2 border-b border-white/5 mb-1">
                                     <p className="text-white text-sm font-bold">{user.name}</p>
                                     <p className="text-xs text-gray-500 font-mono">Lvl {user.level}</p>
                                 </div>
                                 <button 
                                    onClick={() => { onNavigate('profile'); setProfileMenuOpen(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                 >
                                     <span className="material-symbols-outlined text-sm">person</span> Profile
                                 </button>
                                 <button className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                                     <span className="material-symbols-outlined text-sm">settings</span> Settings
                                 </button>
                             </div>
                         )}
                     </div>

                     {/* Quick Logout Button */}
                     <button 
                        onClick={onLogout}
                        className="w-12 h-12 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
                        title="Disconnect / Logout"
                     >
                         <span className="material-symbols-outlined group-hover:text-red-400">power_settings_new</span>
                     </button>
                 </>
             ) : (
                <button 
                    onClick={() => onNavigate('auth')}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-glow text-white font-bold font-display uppercase tracking-widest px-6 py-2.5 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                    <span className="material-symbols-outlined text-lg">login</span>
                    Access Terminal
                </button>
             )}
         </div>

         {/* Mobile Menu Toggle */}
         <button 
           className="md:hidden text-white p-2"
           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
         >
             <span className="material-symbols-outlined">menu</span>
         </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden">
              <button 
                className="absolute top-6 right-6 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                  <span className="material-symbols-outlined text-3xl">close</span>
              </button>
              <NavLink view="dashboard" label="Dashboard" />
              <NavLink view="courses" label="Courses" />
              <NavLink view="labs" label="Labs" />
              <NavLink view="arena" label="Arena" />
              <NavLink view="leaderboard" label="Leaderboard" />
              {user ? (
                 <>
                  <button 
                    onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }}
                    className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 mt-4 bg-white/5 px-6 py-3 rounded-full border border-white/10"
                  >
                      <span className="material-symbols-outlined">person</span> Profile
                  </button>
                  {user.role === 'ADMIN' && (
                    <button 
                        onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                        className="text-red-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2 mt-4 bg-red-500/10 px-6 py-3 rounded-full border border-red-500/20"
                    >
                        <span className="material-symbols-outlined">settings</span> Admin Console
                    </button>
                  )}
                  <button 
                    onClick={onLogout}
                    className="text-red-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2 mt-4 bg-red-500/10 px-6 py-3 rounded-full border border-red-500/20"
                  >
                      <span className="material-symbols-outlined">power_settings_new</span> Disconnect
                  </button>
                 </>
              ) : (
                  <button 
                    onClick={() => { onNavigate('auth'); setMobileMenuOpen(false); }}
                    className="text-primary font-bold uppercase tracking-widest text-sm flex items-center gap-2 mt-8 bg-primary/10 px-6 py-3 rounded-full border border-primary/20"
                  >
                      <span className="material-symbols-outlined">login</span> Access Terminal
                  </button>
              )}
          </div>
      )}

      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full max-w-[1600px] mx-auto px-4 lg:px-8 py-8 flex flex-col">
           {children}
      </main>

      {/* Global Overlay click to close dropdowns */}
      {profileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setProfileMenuOpen(false)}></div>
      )}
    </div>
  );
};