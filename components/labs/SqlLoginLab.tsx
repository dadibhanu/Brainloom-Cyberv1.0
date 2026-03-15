import React, { useState, useEffect } from 'react';
import { LabComponentProps, SqlEnvironment } from '../../types';

export const SqlLoginLab: React.FC<LabComponentProps> = ({ config, activeStep, onStepAdvance, onMissionComplete, addLog }) => {
  const [db, setDb] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'FAILURE'>('IDLE');
  const [executedQuery, setExecutedQuery] = useState('');

  const env = config.environment as SqlEnvironment;
  const queryTemplate = env?.queryTemplate || "SELECT * FROM users WHERE username = '$USER' AND password = '$PASS'";

  useEffect(() => {
    if (env && env.dbSchema) {
      const initDB = async () => {
        try {
          // @ts-ignore
          const SQL = await window.initSqlJs({ locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` });
          const database = new SQL.Database();
          env.dbSchema.forEach((cmd) => database.run(cmd));
          if (env.dbSeed) env.dbSeed.forEach((cmd) => database.run(cmd));
          setDb(database);
          addLog('INFO', 'SQL Engine Online');
        } catch (e) {
          addLog('ERROR', 'SQL Init Failed');
        }
      };
      initDB();
    }
  }, []);

  const handleSqlLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    // Simulate the server-side concatenation vulnerability
    const unsafeQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    setExecutedQuery(unsafeQuery);
    
    addLog('QUERY', unsafeQuery);
    
    try {
      const res = db.exec(unsafeQuery);
      if (res.length > 0) {
        setStatus('SUCCESS');
        addLog('SUCCESS', 'Login Bypass Successful');
        addLog('INFO', `Logged in as: ${res[0].values[0][1]}`); // Show username
        if (activeStep === 0 && (username.includes("'") || password.includes("'"))) {
          onMissionComplete();
        }
      } else {
        setStatus('FAILURE');
        addLog('ERROR', 'Invalid Credentials (0 rows returned)');
      }
    } catch (err: any) {
      setStatus('FAILURE');
      addLog('ERROR', `SQL Syntax Error: ${err.message}`);
      if (activeStep === 0) onStepAdvance();
    }
  };

  // Helper to highlight the injected parts in the debug view
  const renderLiveQuery = () => {
      const parts = queryTemplate.split(/(\$USER|\$PASS)/);
      return (
          <div className="font-mono text-sm leading-relaxed text-cyan-100/70">
              {parts.map((part, i) => {
                  if (part === '$USER') return <span key={i} className="text-white border-b border-cyan-400 font-bold px-1 mx-0.5 bg-cyan-900/30 transition-all duration-300">{username || ''}</span>;
                  if (part === '$PASS') return <span key={i} className="text-white border-b border-cyan-400 font-bold px-1 mx-0.5 bg-cyan-900/30 transition-all duration-300">{password || ''}</span>;
                  return <span key={i} className="opacity-70">{part}</span>;
              })}
          </div>
      );
  };

  return (
    <div className="min-h-full bg-[#02040a] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        
        {/* Background Grid & Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>

        {/* Main Interface Card */}
        <div className="relative w-full max-w-md bg-[#0a0b10] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden z-10 transition-all duration-500 hover:shadow-[0_0_70px_rgba(6,182,212,0.2)]">
            
            {/* Top Glow Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80"></div>
            
            <div className="p-10">
                {/* Branding */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-5 relative group">
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl"></div>
                        <span className="material-symbols-outlined text-4xl text-white drop-shadow-md">account_balance_wallet</span>
                    </div>
                    <h1 className="text-3xl font-display font-black text-white tracking-widest">NEXUS PAY</h1>
                    <p className="text-cyan-500/60 text-xs font-mono tracking-[0.2em] uppercase mt-2">Global Financial Node Access</p>
                </div>

                {/* Login Form */}
                {status === 'SUCCESS' ? (
                    <div className="py-8 text-center animate-in zoom-in duration-500">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                            <span className="material-symbols-outlined text-4xl text-green-500">verified_user</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Access Granted</h3>
                        <p className="text-gray-400 text-sm font-mono">Session Token: <span className="text-green-400">ADMIN_8X29</span></p>
                        <button 
                             onClick={() => { setStatus('IDLE'); setUsername(''); setPassword(''); }}
                             className="mt-8 text-xs font-bold text-cyan-500 hover:text-white uppercase tracking-widest transition-colors"
                        >
                            Reset Connection
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSqlLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider ml-1">Node Account ID</label>
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full bg-[#13151a] border border-white/10 rounded-lg py-3.5 pl-4 pr-10 text-cyan-100 placeholder-white/20 text-sm focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-[#1a1d24] transition-all font-mono outline-none"
                                    placeholder="Enter ID..."
                                />
                                <span className="material-symbols-outlined absolute right-3 top-3.5 text-white/20 group-focus-within:text-cyan-500 transition-colors text-lg">database</span>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider ml-1">Access Token</label>
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-[#13151a] border border-white/10 rounded-lg py-3.5 pl-4 pr-10 text-cyan-100 placeholder-white/20 text-sm focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-[#1a1d24] transition-all font-mono outline-none"
                                    placeholder="••••••••"
                                />
                                <span className="material-symbols-outlined absolute right-3 top-3.5 text-white/20 group-focus-within:text-cyan-500 transition-colors text-lg">key</span>
                            </div>
                        </div>

                        <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-display uppercase tracking-widest py-4 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group mt-2">
                            Authenticate
                            <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">bolt</span>
                        </button>
                    </form>
                )}
                
                <div className="mt-8 text-center">
                    <span className="text-[10px] text-white/20 font-mono cursor-pointer hover:text-red-500 transition-colors tracking-wide">EMERGENCY PROTOCOL RECOVERY</span>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-[#0c0e12] border-t border-white/5 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                    <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider">Secure Link Active</span>
                </div>
                <span className="text-[10px] text-white/20 font-mono">AES-256-GCM</span>
            </div>
        </div>

        {/* Backend Monitor Debugger (Below the card) */}
        <div className="w-full max-w-3xl mt-16 animate-in slide-in-from-bottom-4 duration-700">
             <div className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-widest mb-2 pl-1">Real-Time Injection Traffic Analysis</div>
             <div className="bg-[#0a0b10]/90 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm font-mono text-xs shadow-2xl">
                 <div className="flex border-b border-white/5">
                     <div className="px-4 py-2 border-r border-white/5 text-gray-500">LOG_ID: 9942</div>
                     <div className="px-4 py-2 text-gray-500">STATUS: MONITORING</div>
                 </div>
                 <div className="p-6 space-y-4">
                     <div>
                         <span className="text-gray-500 mr-2">[14:22:01]</span>
                         <span className="text-blue-400 font-bold">POST</span>
                         <span className="text-gray-300 ml-2">/api/v1/auth HTTP/1.1</span>
                     </div>
                     <div>
                         <span className="text-gray-500 mr-2">[14:22:01]</span>
                         <span className="text-gray-400">Content-Type: application/json</span>
                     </div>
                     {executedQuery && (
                         <>
                            <div className="bg-yellow-900/10 border-l-2 border-yellow-500/50 pl-3 py-1 my-2">
                                <span className="text-gray-500 mr-2">[14:22:02]</span>
                                <span className="text-yellow-500 font-bold">Payload Detected:</span>
                                <span className="text-yellow-200/80 ml-2 italic">"acc_id": "{username}" OR 1=1 --"</span>
                            </div>
                            <div>
                                <span className="text-gray-500 mr-2">[14:22:02]</span>
                                <span className="text-cyan-500 font-bold">SQL_EXEC:</span>
                                <span className="text-gray-400 ml-2 whitespace-pre-wrap">SELECT * FROM accounts WHERE id = </span>
                                {renderLiveQuery()}
                            </div>
                         </>
                     )}
                     
                     {status === 'SUCCESS' && (
                         <div>
                             <span className="text-gray-500 mr-2">[14:22:02]</span>
                             <span className="text-green-500 font-bold">SUCCESS:</span>
                             <span className="text-green-400 ml-2">Query returned 152 rows. Logic gate bypassed. Session cookie generated.</span>
                         </div>
                     )}
                     
                     {status === 'FAILURE' && executedQuery && (
                         <div>
                             <span className="text-gray-500 mr-2">[14:22:02]</span>
                             <span className="text-red-500 font-bold">ERROR:</span>
                             <span className="text-red-400 ml-2">Syntax error or empty result set. Transaction rolled back.</span>
                         </div>
                     )}
                     
                     {!executedQuery && <div className="text-gray-600 italic">Waiting for input stream...</div>}
                 </div>
             </div>
        </div>
    </div>
  );
};