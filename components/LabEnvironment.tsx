import React, { useState, useEffect, useRef } from 'react';
import { Course, LogEntry, CourseModule } from '../types';

// Import modular labs
import { SqlLoginLab } from './labs/SqlLoginLab';
import { XssSearchLab } from './labs/XssSearchLab';
import { FileViewerLab } from './labs/FileViewerLab';
import { TerminalLab } from './labs/TerminalLab';
import { BankPortalLab } from './labs/BankPortalLab';
import { RequestSenderLab } from './labs/RequestSenderLab';
import { IdorProfileLab } from './labs/IdorProfileLab';
import { BolaApiLab } from './labs/BolaApiLab';
import { FileUploadLab } from './labs/FileUploadLab';
import { RepeaterLab } from './labs/RepeaterLab';
import { AiTargetLab } from './labs/AiTargetLab';

interface LabEnvironmentProps {
  course: Course;
  modules: Record<string, CourseModule>;
  onExit: (completed: boolean) => void;
}

export const LabEnvironment: React.FC<LabEnvironmentProps> = ({ course, modules, onExit }) => {
  const moduleData = modules[course.id];
  const config = moduleData?.labConfig;
  const steps = config?.steps || [];

  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [missionComplete, setMissionComplete] = useState(false);
  
  // Responsive Panel State
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (type: LogEntry['type'], message: string) => {
    const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { timestamp: now, type, message }]);
  };

  useEffect(() => {
      setLogs([]);
      setActiveStep(0);
      setMissionComplete(false);
      
      // Auto-collapse panels on mobile initially
      if (window.innerWidth < 1024) {
          setLeftPanelOpen(false);
          setRightPanelOpen(false);
      }
  }, [course.id]);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  if (!config) return <div className="h-screen flex items-center justify-center bg-black text-white font-mono">Initializing Neural Link...</div>;

  const renderLabComponent = () => {
    const props = {
      config,
      activeStep,
      onStepAdvance: () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1)),
      onMissionComplete: () => setMissionComplete(true),
      addLog,
    };

    switch (config.type) {
      case 'SQL_LOGIN': return <SqlLoginLab {...props} />;
      case 'XSS_SEARCH': return <XssSearchLab {...props} />;
      case 'FILE_VIEWER': return <FileViewerLab {...props} />;
      case 'TERMINAL': return <TerminalLab {...props} />;
      case 'BANK_PORTAL': return <BankPortalLab {...props} />;
      case 'REQUEST_SENDER': return <RequestSenderLab {...props} />;
      case 'IDOR_PROFILE': return <IdorProfileLab {...props} />;
      case 'BOLA_API': return <BolaApiLab {...props} />;
      case 'FILE_UPLOAD': return <FileUploadLab {...props} />;
      case 'REPEATER': return <RepeaterLab {...props} />;
      case 'AI_TARGET': return <AiTargetLab {...props} />;
      default: return <div>Unknown Lab Type</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050505] text-gray-300 font-sans">
        
        {/* Success Modal */}
        {missionComplete && (
            <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-[#111] border border-green-500/30 p-8 rounded-2xl max-w-md w-full text-center shadow-[0_0_50px_rgba(34,197,94,0.15)] animate-in zoom-in-95 duration-300">
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border border-green-500/20">
                        <span className="material-symbols-outlined text-6xl">emoji_events</span>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2 uppercase tracking-wide">Mission Accomplished</h2>
                    <p className="text-gray-400 mb-8 font-mono text-sm">Vulnerability exploited. Flag captured.</p>
                    <button 
                        onClick={() => onExit(true)}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold font-display uppercase tracking-widest py-4 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                    >
                        Return to Base
                    </button>
                </div>
            </div>
        )}

        {/* Top Header */}
        <header className="h-14 bg-[#0a0b10] border-b border-white/5 flex items-center justify-between px-4 shrink-0 relative z-20">
            <div className="flex items-center gap-4">
               {/* Mobile Left Toggle */}
               <button onClick={() => setLeftPanelOpen(!leftPanelOpen)} className="lg:hidden text-gray-400 hover:text-white">
                   <span className="material-symbols-outlined">menu_open</span>
               </button>

               <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-white text-xs">memory</span>
                   </div>
                   <h1 className="text-sm font-display font-bold text-white tracking-wide">Brainloom <span className="text-primary-glow font-normal opacity-80 text-xs">Lab Environment</span></h1>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2">
                   {/* Mobile Right Toggle */}
                   <button 
                    onClick={() => setRightPanelOpen(!rightPanelOpen)}
                    className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${rightPanelOpen ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                   >
                       <span className="material-symbols-outlined text-sm">terminal</span>
                       <span className="hidden sm:inline">Logs</span>
                   </button>
               </div>

               <div className="h-6 w-px bg-white/10"></div>

               <button 
                   onClick={() => onExit(false)}
                   className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-all group border border-transparent hover:border-red-500/20"
                   title="Exit Lab Environment"
               >
                   <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">power_settings_new</span>
                   <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Exit</span>
               </button>
            </div>
        </header>

        {/* Workspace Layout */}
        <div className="flex-1 flex overflow-hidden relative">
            
            {/* Left Sidebar: Instructions */}
            <div className={`
                absolute inset-y-0 left-0 z-20 w-80 bg-[#0c0d12] border-r border-white/5 flex flex-col transition-transform duration-300 transform
                lg:relative lg:translate-x-0
                ${leftPanelOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <span className="material-symbols-outlined text-lg">description</span>
                        <h2 className="text-xs font-bold uppercase tracking-widest">Mission Brief</h2>
                    </div>
                    
                    <h1 className="text-lg font-bold text-white mb-4 leading-tight font-display uppercase">{course.title}</h1>
                    <div className="text-sm text-gray-400 leading-relaxed mb-6 border-l-2 border-white/10 pl-4">{steps[activeStep].desc}</div>
                    
                    <div className="bg-[#15171e] rounded border border-white/5 p-4 mb-8">
                        <div className="flex items-center gap-2 mb-2 text-primary text-[10px] font-bold uppercase tracking-wider">
                            <span className="material-symbols-outlined text-sm">flag</span>
                            Current Objective
                        </div>
                        <p className="text-sm text-gray-200 font-medium">{steps[activeStep].task}</p>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 bg-[#0a0b10] flex justify-between items-center">
                   <button 
                     disabled={activeStep === 0}
                     onClick={() => setActiveStep(p => p - 1)}
                     className="px-3 py-1.5 rounded text-[10px] font-bold text-gray-500 hover:text-white disabled:opacity-30 transition-colors uppercase tracking-wider"
                   >
                     Prev
                   </button>
                   <div className="flex gap-1">
                       {steps.map((_, i) => (
                           <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeStep ? 'bg-primary' : 'bg-white/10'}`}></div>
                       ))}
                   </div>
                   <button 
                     disabled={activeStep === steps.length - 1}
                     onClick={() => setActiveStep(p => p + 1)}
                     className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold transition-colors disabled:opacity-50 uppercase tracking-wider border border-white/10"
                   >
                     Next
                   </button>
                </div>
            </div>

            {/* Center: Lab Simulation */}
            <div className="flex-1 flex flex-col min-w-0 bg-black relative z-10">
                <div className="absolute inset-0 overflow-auto">
                     {renderLabComponent()}
                </div>
            </div>

            {/* Right Sidebar: System Logs */}
            <div className={`
                absolute inset-y-0 right-0 z-20 w-80 bg-[#0c0d12] border-l border-white/5 flex flex-col transition-transform duration-300 transform
                lg:relative lg:translate-x-0
                ${rightPanelOpen ? 'translate-x-0' : 'translate-x-full lg:hidden'}
            `}>
                <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-[#0a0b10]">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm">terminal</span>
                        System Console
                    </div>
                    <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                         <span className="text-[9px] font-mono text-green-500">LIVE</span>
                    </div>
                </div>
                
                <div className="flex-1 overflow-auto p-3 font-mono text-xs space-y-1 bg-[#050505] custom-scrollbar">
                    {logs.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-2">
                             <span className="material-symbols-outlined text-2xl opacity-20">dvr</span>
                             <span className="text-[10px] uppercase tracking-widest opacity-50">Awaiting Events</span>
                        </div>
                    )}
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-2 py-1 border-b border-white/5 last:border-0 animate-in slide-in-from-right-2 duration-300">
                            <span className="text-gray-600 shrink-0 text-[10px] pt-0.5">{log.timestamp.split(' ')[0]}</span>
                            <div className="flex-1 min-w-0">
                                <span className={`text-[10px] font-bold uppercase tracking-wider mr-2 ${
                                    log.type === 'INFO' ? 'text-blue-500' : 
                                    log.type === 'ERROR' ? 'text-red-500' : 
                                    log.type === 'SUCCESS' ? 'text-green-500' : 'text-purple-500'
                                }`}>{log.type}</span>
                                <span className="text-gray-300 break-words">{log.message}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={logsEndRef} />
                </div>
                
                {/* Footer status for logs */}
                <div className="p-2 border-t border-white/5 bg-[#0a0b10] text-[9px] text-gray-600 font-mono flex justify-between">
                    <span>BUFFER: {logs.length} LINES</span>
                    <span>TAILING</span>
                </div>
            </div>
            
            {/* Overlay for mobile */}
            {(leftPanelOpen || (rightPanelOpen && window.innerWidth < 1024)) && window.innerWidth < 1024 && (
                <div 
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 lg:hidden"
                    onClick={() => { setLeftPanelOpen(false); setRightPanelOpen(false); }}
                ></div>
            )}

        </div>
    </div>
  );
};