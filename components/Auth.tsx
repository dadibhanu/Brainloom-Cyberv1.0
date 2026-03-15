import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        if (mode === 'REGISTER') {
            if (!username || !email || !password || !confirmPassword) {
                setError('ERROR: MISSING_FIELDS');
                setLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                setError('ERROR: PASSWORDS_DO_NOT_MATCH');
                setLoading(false);
                return;
            }
            if (password.length < 6) {
                setError('ERROR: WEAK_PASSPHRASE');
                setLoading(false);
                return;
            }
            
            // Implement registration API call
            const response = await fetch('https://api.brainloom.in/api/auth/register/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Assuming the API returns user data in data.user or similar structure
            // Adjust this based on the actual API response structure
            const userData = data.user || data;

             const newUser: User = {
                id: userData.id || `user_${Math.random().toString(36).substr(2, 9)}`,
                name: userData.name || username || 'Operative',
                handle: userData.username ? `@${userData.username.toLowerCase()}` : (username ? `@${username.toLowerCase().replace(/\s+/g, '_')}` : '@operative'),
                avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'operative'}`,
                isOnline: true,
                level: userData.level || 1,
                xp: userData.xp || 0,
                rank: userData.rank || 9999,
                badges: userData.badges || [],
                role: 'USER', // Force USER role for new registrations
            };
            onLogin(newUser);
            
        } else {
             if (!email || !password) {
                setError('ERROR: CREDENTIALS_REQUIRED');
                setLoading(false);
                return;
             }

             const response = await fetch('https://api.brainloom.in/api/auth/login', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({
                     as: 'user',
                     email: email,
                     password: password
                 })
             });

             const data = await response.json();

             if (!response.ok) {
                 throw new Error(data.message || 'Authentication failed');
             }

             // Assuming the API returns user data in data.user or similar structure
             // Adjust this based on the actual API response structure
             const userData = data.user || data;

             const newUser: User = {
                id: userData.id || `user_${Math.random().toString(36).substr(2, 9)}`,
                name: userData.name || 'Operative',
                handle: userData.username ? `@${userData.username.toLowerCase()}` : '@dev_ops_master',
                avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username || 'operative'}`,
                isOnline: true,
                level: userData.level || 15,
                xp: userData.xp || 24500,
                rank: userData.rank || 128,
                badges: userData.badges || [],
                role: userData.role || 'USER',
            };
            
            onLogin(newUser);
        }
    } catch (err: any) {
        console.error('Login error:', err);
        setError(err.message || 'ERROR: CONNECTION_FAILED');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center relative z-10 w-full">
        {/* Ambient Glows around card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse-fast"></div>

        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 my-10">
            {/* Header Text */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-display font-black text-white tracking-widest uppercase mb-2">
                    System Access
                </h1>
                <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase">Secure Terminal Gateway v2.4.0</p>
            </div>

            {/* Auth Card */}
            <div className="bg-[#0a0b10]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                
                {/* Tabs */}
                <div className="flex bg-black/40 rounded-lg p-1 mb-8 border border-white/5">
                    <button 
                        onClick={() => { setMode('LOGIN'); setError(''); }}
                        className={`flex-1 py-2 text-xs font-bold font-tech uppercase tracking-wider rounded transition-all ${mode === 'LOGIN' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => { setMode('REGISTER'); setError(''); }}
                        className={`flex-1 py-2 text-xs font-bold font-tech uppercase tracking-wider rounded transition-all ${mode === 'REGISTER' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {mode === 'REGISTER' && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#13151a] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-700 font-mono"
                                    placeholder="Execute_01"
                                />
                                <span className="material-symbols-outlined absolute left-3 top-3 text-gray-600 text-lg group-focus-within:text-primary transition-colors">badge</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                        <div className="relative group">
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#13151a] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-700 font-mono"
                                placeholder="operative@brainloom.io"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-600 text-lg group-focus-within:text-primary transition-colors">mail</span>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#13151a] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-700 font-mono"
                                placeholder="••••••••••••"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-600 text-lg group-focus-within:text-primary transition-colors">lock</span>
                        </div>
                    </div>

                    {mode === 'REGISTER' && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                            <div className="relative group">
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-[#13151a] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-700 font-mono"
                                    placeholder="••••••••••••"
                                />
                                <span className="material-symbols-outlined absolute left-3 top-3 text-gray-600 text-lg group-focus-within:text-primary transition-colors">lock_reset</span>
                            </div>
                        </div>
                    )}
                    
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 animate-in slide-in-from-top-2">
                             <span className="material-symbols-outlined text-sm">error</span>
                             <span className="text-xs font-mono font-bold">{error}</span>
                        </div>
                    )}

                    <button 
                        disabled={loading}
                        className="w-full bg-white hover:bg-gray-200 text-black font-bold font-display uppercase tracking-widest py-3.5 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-4 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                Authenticating...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">power_settings_new</span>
                                {mode === 'LOGIN' ? 'Login' : 'Register'}
                            </>
                        )}
                    </button>
                </form>

                {/* Social Login Section */}
                <div className="mt-8">
                     <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-2 text-[10px] text-gray-600 font-mono uppercase tracking-widest">Or Link Identity</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-4">
                        <button className="flex items-center justify-center py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-all group relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                        </button>
                        <button className="flex items-center justify-center py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-all group relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                            </svg>
                        </button>
                        <button className="flex items-center justify-center py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-all group relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <svg className="w-5 h-5 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Footer Stats */}
            <div className="mt-8 flex justify-between px-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest opacity-60">
                 <span>Sys_Status: ONLINE</span>
                 <span>Ver: 2.4.0</span>
            </div>
        </div>
    </div>
  );
};