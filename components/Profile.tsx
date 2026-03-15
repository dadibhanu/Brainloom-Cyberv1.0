import React, { useState } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: Partial<User>) => void;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    handle: user.handle,
    email: 'operative@brainloom.io', // Mock email as it's not in User type yet
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [linkedAccounts, setLinkedAccounts] = useState({
    google: true,
    github: false,
    linkedin: false
  });

  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (msg: string, type: 'success' | 'error') => {
      setNotification({ msg, type });
      setTimeout(() => setNotification(null), 3000);
  };

  const handleIdentitySave = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdateUser({ name: formData.name, handle: formData.handle });
      showNotification('Identity Matrix Updated Successfully', 'success');
  };

  const handleSecuritySave = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwords.new !== passwords.confirm) {
          showNotification('Error: Passphrase Mismatch', 'error');
          return;
      }
      if (passwords.new.length < 6) {
          showNotification('Error: Entropy Too Low (Min 6 chars)', 'error');
          return;
      }
      // Mock API call
      setTimeout(() => {
          setPasswords({ current: '', new: '', confirm: '' });
          showNotification('Encryption Keys Rotated', 'success');
      }, 500);
  };

  const toggleLink = (provider: 'google' | 'github' | 'linkedin') => {
      setLinkedAccounts(prev => {
          const newState = !prev[provider];
          showNotification(`${provider.toUpperCase()} Link ${newState ? 'Established' : 'Severed'}`, newState ? 'success' : 'error');
          return { ...prev, [provider]: newState };
      });
  };

  const handleDeleteAccount = () => {
      if(window.confirm("WARNING: IRREVERSIBLE ACTION.\n\nAre you sure you want to scrub your identity from the database? All XP and Badges will be lost.")) {
          onLogout();
      }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 p-0.5">
                        <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-black" referrerPolicy="no-referrer" />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-black rounded-full p-1 border border-white/20 cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-white text-sm">edit</span>
                    </div>
                </div>
                <div>
                    <h1 className="text-3xl font-display font-black text-white uppercase tracking-wider">{user.name}</h1>
                    <p className="text-primary font-mono text-sm mb-2">{user.handle}</p>
                    <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            LVL {user.level}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-yellow-500 uppercase tracking-widest">
                            Rank #{user.rank}
                        </span>
                    </div>
                </div>
            </div>

            {notification && (
                <div className={`px-4 py-2 rounded border flex items-center gap-2 animate-in slide-in-from-right fade-in ${
                    notification.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                    <span className="material-symbols-outlined text-sm">
                        {notification.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide">{notification.msg}</span>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Forms */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Identity Module */}
                <section className="bg-background-card border border-white/5 rounded-2xl overflow-hidden">
                    <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400">badge</span>
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Identity Matrix</h2>
                    </div>
                    <form onSubmit={handleIdentitySave} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Display Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-primary outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Operative Handle</label>
                                <input 
                                    type="text" 
                                    value={formData.handle}
                                    onChange={e => setFormData({...formData, handle: e.target.value})}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-primary outline-none transition-colors font-mono"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Comms (Email)</label>
                            <input 
                                type="email" 
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-primary outline-none transition-colors"
                            />
                        </div>
                        <div className="pt-2 flex justify-end">
                            <button type="submit" className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                                Update Identity
                            </button>
                        </div>
                    </form>
                </section>

                {/* Security Module */}
                <section className="bg-background-card border border-white/5 rounded-2xl overflow-hidden">
                    <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400">lock</span>
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Encryption Keys</h2>
                    </div>
                    <form onSubmit={handleSecuritySave} className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Current Passphrase</label>
                            <input 
                                type="password" 
                                value={passwords.current}
                                onChange={e => setPasswords({...passwords, current: e.target.value})}
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-primary outline-none transition-colors font-mono"
                                placeholder="••••••••••••"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">New Passphrase</label>
                                <input 
                                    type="password" 
                                    value={passwords.new}
                                    onChange={e => setPasswords({...passwords, new: e.target.value})}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-primary outline-none transition-colors font-mono"
                                    placeholder="••••••••••••"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confirm Passphrase</label>
                                <input 
                                    type="password" 
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-primary outline-none transition-colors font-mono"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>
                        <div className="pt-2 flex justify-end">
                            <button type="submit" className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                                Rotate Keys
                            </button>
                        </div>
                    </form>
                </section>
            </div>

            {/* Right Column: Links & Danger */}
            <div className="space-y-8">
                
                {/* Neural Links */}
                <section className="bg-background-card border border-white/5 rounded-2xl overflow-hidden">
                    <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400">link</span>
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Neural Links</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {/* Google */}
                        <div className="flex items-center justify-between p-3 border border-white/5 rounded-lg bg-black/20">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                </div>
                                <span className="text-sm font-bold text-gray-300">Google</span>
                            </div>
                            <button 
                                onClick={() => toggleLink('google')}
                                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded transition-colors ${linkedAccounts.google ? 'text-green-400 bg-green-500/10' : 'text-gray-500 bg-gray-800'}`}
                            >
                                {linkedAccounts.google ? 'Linked' : 'Link'}
                            </button>
                        </div>

                        {/* GitHub */}
                        <div className="flex items-center justify-between p-3 border border-white/5 rounded-lg bg-black/20">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-[#24292e] flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                                </div>
                                <span className="text-sm font-bold text-gray-300">GitHub</span>
                            </div>
                            <button 
                                onClick={() => toggleLink('github')}
                                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded transition-colors ${linkedAccounts.github ? 'text-green-400 bg-green-500/10' : 'text-gray-500 bg-gray-800'}`}
                            >
                                {linkedAccounts.github ? 'Linked' : 'Link'}
                            </button>
                        </div>

                        {/* LinkedIn */}
                        <div className="flex items-center justify-between p-3 border border-white/5 rounded-lg bg-black/20">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-[#0077B5] flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                </div>
                                <span className="text-sm font-bold text-gray-300">LinkedIn</span>
                            </div>
                            <button 
                                onClick={() => toggleLink('linkedin')}
                                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded transition-colors ${linkedAccounts.linkedin ? 'text-green-400 bg-green-500/10' : 'text-gray-500 bg-gray-800'}`}
                            >
                                {linkedAccounts.linkedin ? 'Linked' : 'Link'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-red-500/5 border border-red-500/20 rounded-2xl overflow-hidden">
                    <div className="bg-red-500/10 px-6 py-4 border-b border-red-500/10 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">warning</span>
                        <h2 className="text-sm font-bold text-red-500 uppercase tracking-widest">Termination Protocol</h2>
                    </div>
                    <div className="p-6">
                        <p className="text-xs text-gray-400 mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <button 
                            onClick={handleDeleteAccount}
                            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                        >
                            Delete Account
                        </button>
                    </div>
                </section>
            </div>
        </div>
    </div>
  );
};