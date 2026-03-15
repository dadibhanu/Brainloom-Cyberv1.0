import React, { useState } from 'react';
import { Course, CourseModule, LabType } from '../types';

interface AdminPanelProps {
  courses: Course[];
  modules: Record<string, CourseModule>;
  onSave: (course: Course, module: CourseModule) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const LAB_TYPES: LabType[] = [
  'SQL_LOGIN', 'XSS_SEARCH', 'FILE_VIEWER', 'TERMINAL', 'BANK_PORTAL', 
  'REQUEST_SENDER', 'IDOR_PROFILE', 'BOLA_API', 'FILE_UPLOAD', 'REPEATER', 'AI_TARGET'
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ courses, modules, onSave, onDelete, onClose }) => {
  const [view, setView] = useState<'LIST' | 'EDIT'>('LIST');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Course>>({});
  const [labData, setLabData] = useState<Partial<CourseModule['labConfig']>>({});
  const [labContentDesc, setLabContentDesc] = useState('');
  
  // JSON Editor State for complex config
  const [jsonConfig, setJsonConfig] = useState('{}');

  const handleEdit = (course: Course) => {
    const module = modules[course.id];
    setEditingId(course.id);
    setFormData(course);
    
    if (module) {
        setLabData(module.labConfig);
        // Extract plain text from the ReactNode content if possible, or simplified
        // For this admin panel, we are editing the raw data
        
        // Separate the 'config' specific fields from the standard fields
        const { type, urlBar, steps, ...rest } = module.labConfig;
        setJsonConfig(JSON.stringify(rest, null, 2));
    } else {
        setLabData({ type: 'REPEATER', urlBar: 'localhost', steps: [] });
        setJsonConfig('{}');
    }
    
    setView('EDIT');
  };

  const handleCreate = () => {
    setEditingId(null);
    const newId = (Math.max(...courses.map(c => parseInt(c.id))) + 1).toString();
    setFormData({
        id: newId,
        title: 'New Operation',
        description: 'Operation description...',
        difficulty: 'EASY',
        category: 'Red Team',
        xpReward: 100,
        timeEstimate: '30m',
        icon: 'terminal',
        progress: 0,
        topics: [],
        isLocked: false
    });
    setLabData({
        type: 'REPEATER',
        urlBar: 'target.int',
        steps: [{ title: 'Step 1', desc: 'Description', task: 'Task', hint: 'Hint' }]
    });
    setJsonConfig('{}');
    setView('EDIT');
  };

  const handleSaveForm = () => {
     if (!formData.title || !labData.type) return;

     let parsedConfig = {};
     try {
         parsedConfig = JSON.parse(jsonConfig);
     } catch (e) {
         alert("Invalid JSON in Lab Configuration");
         return;
     }

     const finalCourse: Course = {
         ...formData as Course,
         id: formData.id || Math.random().toString(),
     };

     // Reconstruct the React Node content (Simulated)
     // In a real app, you'd save the text and render it dynamically
     const finalModule: CourseModule = {
         id: finalCourse.id,
         content: (
            <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    {finalCourse.title}
                </h2>
                <div className="prose prose-invert max-w-none text-slate-300">
                    <p className="mb-4">{formData.description}</p>
                </div>
            </section>
         ),
         labConfig: {
             type: labData.type as LabType,
             urlBar: labData.urlBar || 'localhost',
             steps: labData.steps || [],
             ...parsedConfig
         }
     };

     onSave(finalCourse, finalModule);
     setView('LIST');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300 overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-white/10 bg-[#0a0b10] flex items-center justify-between px-6 shrink-0">
             <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-red-500/20 border border-red-500 rounded flex items-center justify-center">
                     <span className="material-symbols-outlined text-red-500 text-lg">admin_panel_settings</span>
                 </div>
                 <h1 className="text-xl font-display font-bold text-white uppercase tracking-widest">C2 Admin Console</h1>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                 <span className="material-symbols-outlined text-white">close</span>
             </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/10 bg-black/50 p-4 flex flex-col gap-2">
                <button 
                    onClick={() => setView('LIST')}
                    className={`w-full text-left px-4 py-3 rounded border text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${view === 'LIST' ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-400 border-transparent hover:bg-white/5'}`}
                >
                    <span className="material-symbols-outlined text-base">dns</span>
                    Database
                </button>
                <button 
                    onClick={handleCreate}
                    className={`w-full text-left px-4 py-3 rounded border text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${view === 'EDIT' && !editingId ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-400 border-transparent hover:bg-white/5'}`}
                >
                    <span className="material-symbols-outlined text-base">add_circle</span>
                    New Operation
                </button>
            </div>

            {/* Main View */}
            <div className="flex-1 overflow-auto bg-[#050505] p-8">
                {view === 'LIST' ? (
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white font-display uppercase">Active Modules</h2>
                            <span className="text-xs font-mono text-gray-500">{courses.length} RECORDS FOUND</span>
                        </div>
                        
                        <div className="border border-white/10 rounded-lg overflow-hidden bg-[#0a0b10]">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-white/5 text-gray-200 font-mono text-xs uppercase">
                                    <tr>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Title</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Difficulty</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {courses.map(c => (
                                        <tr key={c.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-mono">{c.id}</td>
                                            <td className="p-4 text-white font-bold">{c.title}</td>
                                            <td className="p-4">
                                                <span className={`text-[10px] px-2 py-1 rounded border uppercase font-bold ${c.category === 'Red Team' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
                                                    {c.category}
                                                </span>
                                            </td>
                                            <td className="p-4">{c.difficulty}</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => handleEdit(c)} className="text-blue-400 hover:text-white mr-4 font-bold text-xs uppercase">Edit</button>
                                                <button onClick={() => onDelete(c.id)} className="text-red-500 hover:text-white font-bold text-xs uppercase">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Col: Course Details */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mb-4 font-display uppercase">Module Meta Data</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                    <input 
                                        className="w-full bg-[#111] border border-white/10 rounded p-2 text-white focus:border-primary outline-none"
                                        value={formData.title || ''}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                    <textarea 
                                        className="w-full bg-[#111] border border-white/10 rounded p-2 text-white focus:border-primary outline-none h-24"
                                        value={formData.description || ''}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                        <select 
                                            className="w-full bg-[#111] border border-white/10 rounded p-2 text-white focus:border-primary outline-none"
                                            value={formData.category}
                                            onChange={e => setFormData({...formData, category: e.target.value as any})}
                                        >
                                            <option value="Red Team">Red Team</option>
                                            <option value="Blue Team">Blue Team</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Difficulty</label>
                                        <select 
                                            className="w-full bg-[#111] border border-white/10 rounded p-2 text-white focus:border-primary outline-none"
                                            value={formData.difficulty}
                                            onChange={e => setFormData({...formData, difficulty: e.target.value as any})}
                                        >
                                            <option value="EASY">EASY</option>
                                            <option value="MEDIUM">MEDIUM</option>
                                            <option value="HARD">HARD</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">XP Reward</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-[#111] border border-white/10 rounded p-2 text-white focus:border-primary outline-none"
                                            value={formData.xpReward || 0}
                                            onChange={e => setFormData({...formData, xpReward: parseInt(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time Est.</label>
                                        <input 
                                            className="w-full bg-[#111] border border-white/10 rounded p-2 text-white focus:border-primary outline-none"
                                            value={formData.timeEstimate || ''}
                                            onChange={e => setFormData({...formData, timeEstimate: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Icon (Material Symbol)</label>
                                    <input 
                                        className="w-full bg-[#111] border border-white/10 rounded p-2 text-white focus:border-primary outline-none"
                                        value={formData.icon || ''}
                                        onChange={e => setFormData({...formData, icon: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Col: Lab Config */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mb-4 font-display uppercase">Simulation Config</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lab Type</label>
                                    <select 
                                        className="w-full bg-[#111] border border-white/10 rounded p-2 text-white focus:border-primary outline-none font-mono text-xs"
                                        value={labData.type}
                                        onChange={e => setLabData({...labData, type: e.target.value as LabType})}
                                    >
                                        {LAB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Virtual URL</label>
                                    <input 
                                        className="w-full bg-[#111] border border-white/10 rounded p-2 text-white focus:border-primary outline-none font-mono"
                                        value={labData.urlBar || ''}
                                        onChange={e => setLabData({...labData, urlBar: e.target.value})}
                                    />
                                </div>

                                {/* Simplified Steps Editor - Just editing the first step for this MVP */}
                                <div className="border border-white/10 p-4 rounded bg-white/5">
                                    <h4 className="text-xs font-bold text-primary mb-2 uppercase">Step 1 Configuration</h4>
                                    <div className="space-y-2">
                                        <input 
                                            className="w-full bg-[#111] border border-white/10 rounded p-2 text-xs text-white"
                                            placeholder="Task Title"
                                            value={labData.steps?.[0]?.title || ''}
                                            onChange={e => {
                                                const newSteps = [...(labData.steps || [])];
                                                if(!newSteps[0]) newSteps[0] = {title:'', desc:'', task:'', hint:''};
                                                newSteps[0].title = e.target.value;
                                                setLabData({...labData, steps: newSteps});
                                            }}
                                        />
                                        <textarea 
                                            className="w-full bg-[#111] border border-white/10 rounded p-2 text-xs text-white h-16"
                                            placeholder="Task Description"
                                            value={labData.steps?.[0]?.desc || ''}
                                            onChange={e => {
                                                const newSteps = [...(labData.steps || [])];
                                                if(!newSteps[0]) newSteps[0] = {title:'', desc:'', task:'', hint:''};
                                                newSteps[0].desc = e.target.value;
                                                setLabData({...labData, steps: newSteps});
                                            }}
                                        />
                                        <input 
                                            className="w-full bg-[#111] border border-white/10 rounded p-2 text-xs text-white"
                                            placeholder="Objective (Task)"
                                            value={labData.steps?.[0]?.task || ''}
                                            onChange={e => {
                                                const newSteps = [...(labData.steps || [])];
                                                if(!newSteps[0]) newSteps[0] = {title:'', desc:'', task:'', hint:''};
                                                newSteps[0].task = e.target.value;
                                                setLabData({...labData, steps: newSteps});
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Advanced Config JSON */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex justify-between">
                                        <span>Advanced Config (JSON)</span>
                                        <span className="text-[10px] text-gray-600">sqlInit, fileSystem, etc.</span>
                                    </label>
                                    <textarea 
                                        className="w-full bg-[#0a0b10] border border-white/10 rounded p-2 text-green-500 font-mono text-xs focus:border-primary outline-none h-32"
                                        value={jsonConfig}
                                        onChange={e => setJsonConfig(e.target.value)}
                                        spellCheck={false}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="lg:col-span-2 flex justify-end gap-4 border-t border-white/10 pt-6">
                            <button onClick={() => setView('LIST')} className="px-6 py-3 rounded border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-colors">Cancel</button>
                            <button onClick={handleSaveForm} className="px-6 py-3 rounded bg-primary text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-lg shadow-primary/20">Save Module</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};