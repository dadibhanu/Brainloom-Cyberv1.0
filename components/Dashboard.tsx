import React, { useState, useEffect } from 'react';
import { User, Course } from '../types';

// --- SUB-COMPONENTS ---

const CircularProgress = ({ percentage, color = "text-primary" }: { percentage: number; color?: string }) => {
    const [currentPercentage, setCurrentPercentage] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPercentage(percentage);
        }, 100);
        return () => clearTimeout(timer);
    }, [percentage]);

    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (currentPercentage / 100) * circumference;

    return (
        <div className="relative w-20 h-20 flex items-center justify-center group">
            <svg className="transform -rotate-90 w-full h-full drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-white/5"
                />
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={`${color} transition-all duration-[1500ms] ease-out`}
                    strokeLinecap="round"
                />
            </svg>
            <span className="absolute text-sm font-bold font-mono text-white group-hover:scale-110 transition-transform">
                {currentPercentage}%
            </span>
        </div>
    );
};

const SystemLog = () => {
    const [lines, setLines] = useState<string[]>([
        "[14:02:11] USER_AUTH: SUCCESS",
        "[14:05:32] SESSION_RESUME: 'SQL Injection'",
        "[14:10:45] ALERT: NEW CHALLENGE UNLOCKED",
        "[14:15:22] XP_GAIN: +150 (Vulnerability Scan)",
        "[14:20:01] NODE_SYNC: 100% COMPLETE"
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newLogs = [
                "PACKET_TRACE: 192.168.1.105 > DETECTED",
                "FIREWALL: PORT 22 BLOCKED",
                "SYNC: DATABASE INTEGRITY VERIFIED",
                "MODULE_LOAD: 'XSS_PAYLOADS'",
                "SYSTEM: OPTIMIZING ROUTINE..."
            ];
            const randomLog = newLogs[Math.floor(Math.random() * newLogs.length)];
            const time = new Date().toLocaleTimeString('en-GB');
            setLines(prev => [`[${time}] ${randomLog}`, ...prev.slice(0, 5)]);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-background-card border border-white/5 rounded-2xl p-6 h-full flex flex-col font-mono text-xs">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                <span className="text-gray-500 uppercase tracking-widest font-bold">System Log</span>
                <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                </div>
            </div>
            <div className="flex-1 space-y-2 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-background-card via-transparent to-transparent z-10 pointer-events-none"></div>
                {lines.map((line, i) => (
                    <div key={i} className={`${i === 0 ? 'text-green-400' : 'text-gray-500'} animate-in slide-in-from-left-2 duration-300`}>
                        {line}
                    </div>
                ))}
            </div>
            <div className="mt-2 text-gray-700 animate-pulse">_</div>
        </div>
    );
};

const RadarChart = () => {
    // Simple SVG Radar Chart
    // Points: Web, Network, Forensics, Encryption, Social, Defense
    const pointsRed = "100,20 170,60 170,140 100,180 30,140 30,60"; // Example shape
    const pointsBlue = "100,40 150,70 150,130 100,160 50,130 50,70"; // Example smaller shape

    return (
        <div className="relative w-full h-[300px] flex items-center justify-center">
             {/* Background Grid */}
             <svg viewBox="0 0 200 200" className="w-full h-full max-w-[400px]">
                 {/* Hexagon Grid Levels */}
                 {[100, 80, 60, 40, 20].map((r, i) => (
                     <polygon 
                        key={i}
                        points={`100,${100-r} ${100+r*0.866},${100-r*0.5} ${100+r*0.866},${100+r*0.5} 100,${100+r} ${100-r*0.866},${100+r*0.5} ${100-r*0.866},${100-r*0.5}`}
                        fill="none" 
                        stroke="#333" 
                        strokeWidth="1"
                        className="opacity-30"
                     />
                 ))}
                 
                 {/* Axes */}
                 <line x1="100" y1="0" x2="100" y2="200" stroke="#333" strokeWidth="1" className="opacity-30" />
                 <line x1="13" y1="50" x2="187" y2="150" stroke="#333" strokeWidth="1" className="opacity-30" />
                 <line x1="13" y1="150" x2="187" y2="50" stroke="#333" strokeWidth="1" className="opacity-30" />

                 {/* Data: Red Team */}
                 <polygon 
                    points={pointsRed}
                    fill="rgba(139, 92, 246, 0.2)" 
                    stroke="#8b5cf6" 
                    strokeWidth="2"
                    className="filter drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]"
                 />
                 {/* Data: Blue Team */}
                 <polygon 
                    points={pointsBlue}
                    fill="rgba(59, 130, 246, 0.2)" 
                    stroke="#3b82f6" 
                    strokeWidth="2"
                    className="filter drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                 />
                 
                 {/* Labels (Approximate positions) */}
                 <text x="100" y="10" textAnchor="middle" fill="#666" fontSize="6" fontFamily="monospace">PEN-TESTING</text>
                 <text x="190" y="50" textAnchor="start" fill="#666" fontSize="6" fontFamily="monospace">EXPLOITATION</text>
                 <text x="190" y="150" textAnchor="start" fill="#666" fontSize="6" fontFamily="monospace">FORENSICS</text>
                 <text x="100" y="195" textAnchor="middle" fill="#666" fontSize="6" fontFamily="monospace">ENCRYPTION</text>
                 <text x="10" y="150" textAnchor="end" fill="#666" fontSize="6" fontFamily="monospace">DEFENSE</text>
                 <text x="10" y="50" textAnchor="end" fill="#666" fontSize="6" fontFamily="monospace">SOCIAL ENG</text>
             </svg>
        </div>
    )
}

const StatCard = ({ label, value, sub, color, progress }: { label: string, value: string, sub?: string, color?: string, progress?: number }) => {
    const [currentProgress, setCurrentProgress] = useState(0);

    useEffect(() => {
        if (progress !== undefined) {
            const timer = setTimeout(() => {
                setCurrentProgress(progress);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [progress]);

    return (
        <div className="bg-background-card border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-full relative overflow-hidden group">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest z-10">{label}</span>
            <div className="z-10">
                <div className={`text-3xl font-display font-bold ${color || 'text-white'}`}>{value}</div>
                {sub && <div className="text-xs font-mono text-gray-400 mt-1">{sub}</div>}
            </div>
            
            {progress !== undefined && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                    <div 
                        className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
                        style={{ width: `${currentProgress}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
};

// --- MAIN DASHBOARD ---

interface DashboardProps {
    user: User | null;
    courses: Course[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, courses }) => {
    // Find active course
    const activeCourse = courses.find(c => c.progress > 0 && c.progress < 100) || courses[0];

    const [ping, setPing] = useState<string>('--');

    useEffect(() => {
        const checkPing = async () => {
            const start = performance.now();
            try {
                await fetch(window.location.origin, { method: 'HEAD', cache: 'no-store' });
                const latency = Math.round(performance.now() - start);
                setPing(`${latency}ms`);
            } catch (e) {
                setPing('OFFLINE');
            }
        };
        
        checkPing(); // Initial check
        const interval = setInterval(checkPing, 5000);
        return () => clearInterval(interval);
    }, []);

    const userHandle = user?.handle || 'GUEST_USER';
    const userRank = user?.rank ? `#${user.rank}` : 'UNRANKED';
    const userXp = user?.xp ? user.xp.toLocaleString() : '0';

    return (
        <div className="animate-in fade-in duration-700">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter mb-2">
                        Dashboard
                    </h1>
                    <div className="flex items-center gap-4 text-xs font-mono text-primary uppercase tracking-widest">
                        <span>Operative_ID: {userHandle}</span>
                        <span className="text-gray-600">|</span>
                        <span>Sector: NORTH_GRID</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="border border-white/10 rounded-lg px-4 py-2 bg-black/50">
                        <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Network Ping</div>
                        <div className="text-xl font-display font-bold text-cyan-400">{ping}</div>
                    </div>
                </div>
            </div>

            {/* --- MAIN GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* --- LEFT COLUMN (4 cols) --- */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* CURRENT FOCUS CARD */}
                    {activeCourse ? (
                        <div className="bg-background-card border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <span className="material-symbols-outlined text-6xl text-white">shield</span>
                            </div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Current Focus</h3>
                            
                            <div className="flex items-center gap-6 mb-8">
                                <CircularProgress percentage={activeCourse.progress} />
                                <div>
                                    <h2 className="text-xl font-bold text-white leading-tight">{activeCourse.title}</h2>
                                    <p className="text-xs text-primary font-mono mt-1 uppercase">Module: {activeCourse.category}</p>
                                </div>
                            </div>

                            <button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold font-display uppercase tracking-widest py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-[1.02] active:scale-[0.98]">
                                <span className="material-symbols-outlined">play_arrow</span>
                                Resume Session
                            </button>
                        </div>
                    ) : (
                        <div className="bg-background-card border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                            <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">school</span>
                            <p className="text-sm text-gray-500">No active courses. Start a path to begin learning.</p>
                        </div>
                    )}

                    {/* STATS ROW */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard 
                            label="Global Rank" 
                            value={userRank} 
                            sub="Silver II" 
                            color="text-white"
                        />
                        <StatCard 
                            label="Total Points" 
                            value={userXp} 
                            sub="Level 16 Progress" 
                            color="text-white"
                            progress={82} // Simulated progress to next level
                        />
                    </div>

                    {/* DAILY STREAK */}
                    <div className="bg-background-card border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                         <div>
                             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Daily Streak</div>
                             <div className="text-2xl font-display font-bold text-white">12 DAYS</div>
                         </div>
                         <div className="flex gap-1">
                             <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse-fast"></div>
                             <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                             <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                             <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                         </div>
                    </div>

                    {/* SYSTEM LOG */}
                    <div className="flex-1 min-h-[200px]">
                        <SystemLog />
                    </div>

                </div>


                {/* --- RIGHT COLUMN (8 cols) --- */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    
                    {/* CAPABILITY MATRIX */}
                    <div className="bg-background-card border border-white/5 rounded-2xl p-8 min-h-[400px] flex flex-col relative overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-white italic">CAPABILITY MATRIX</h2>
                                <p className="text-xs text-gray-500 font-mono mt-1">Red Team vs Blue Team Performance</p>
                            </div>
                            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-primary/50 border border-primary"></span>
                                    <span className="text-gray-300">Red Team</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-500/50 border border-blue-500"></span>
                                    <span className="text-gray-300">Blue Team</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Radar Chart Container */}
                        <div className="flex-1 flex items-center justify-center relative z-10">
                            <RadarChart />
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute inset-0 bg-glow-radial opacity-10"></div>
                    </div>

                    {/* MASTERY STATS ROW */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Red Mastery" value="88%" color="text-white" />
                        <StatCard label="Blue Mastery" value="64%" color="text-white" />
                        <StatCard label="Synergy Index" value="A+" color="text-green-400" />
                        <StatCard label="Global Avg" value="42%" color="text-white" />
                    </div>

                    {/* ACHIEVEMENTS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="bg-background-card border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-orange-500/50 transition-colors group cursor-pointer">
                             <div className="w-12 h-12 rounded bg-orange-900/20 border border-orange-500/30 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-black transition-colors text-orange-500">
                                 <span className="material-symbols-outlined text-2xl">military_tech</span>
                             </div>
                             <div>
                                 <h4 className="font-bold text-white text-sm mb-1 group-hover:text-orange-400">Network Ghost</h4>
                                 <p className="text-xs text-gray-500">Successfully bypassed 5 production firewalls.</p>
                             </div>
                         </div>
                         <div className="bg-background-card border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-cyan-500/50 transition-colors group cursor-pointer">
                             <div className="w-12 h-12 rounded bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-colors text-cyan-500">
                                 <span className="material-symbols-outlined text-2xl">verified_user</span>
                             </div>
                             <div>
                                 <h4 className="font-bold text-white text-sm mb-1 group-hover:text-cyan-400">Iron Sentry</h4>
                                 <p className="text-xs text-gray-500">Neutralized 12 automated brute-force attacks.</p>
                             </div>
                         </div>
                    </div>

                </div>
            </div>

            {/* --- FOOTER --- */}
            <footer className="mt-12 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <span className="text-white font-bold italic text-lg mr-4 normal-case tracking-normal">BRAINLOOM</span>
                </div>
                <div className="flex gap-8">
                    <span className="cursor-pointer hover:text-white transition-colors">Documentation</span>
                    <span className="cursor-pointer hover:text-white transition-colors">Support</span>
                    <span className="cursor-pointer hover:text-white transition-colors">API Status</span>
                    <span className="cursor-pointer hover:text-white transition-colors">Policy</span>
                </div>
            </footer>
        </div>
    );
};