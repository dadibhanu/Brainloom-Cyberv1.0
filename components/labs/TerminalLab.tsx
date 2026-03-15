import React, { useState, useEffect, useRef } from 'react';
import { LabComponentProps, TerminalEnvironment } from '../../types';

export const TerminalLab: React.FC<LabComponentProps> = ({ config, activeStep, onStepAdvance, onMissionComplete, addLog }) => {
  const [ip, setIp] = useState('8.8.8.8');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['Server online. Diagnostic tool ready.']);
  const outputRef = useRef<HTMLDivElement>(null);

  const env = config.environment as TerminalEnvironment;
  const mockFS = env?.fileSystem || {};
  const commandResponses = env?.commandResponses || {};

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [terminalOutput]);

  const executeCommand = (cmd: string): string => {
    const args = cmd.trim().split(' ');
    const command = args[0];

    // Check specific command overrides
    if (commandResponses[command]) return commandResponses[command];

    switch (command) {
      case 'ls':
        return 'index.php  assets  includes';
      case 'whoami':
        if (activeStep === 0) onStepAdvance();
        return 'root'; 
      case 'id':
        return 'uid=0(root) gid=0(root) groups=0(root)';
      case 'cat':
        const file = args[1];
        if (!file) return 'cat: missing operand';
        if (file === '/etc/passwd') {
            onMissionComplete();
            return 'root:x:0:0:root:/root:/bin/bash'; // Simplified
        }
        if (file === '/etc/shadow') return 'cat: /etc/shadow: Permission denied';
        return `cat: ${file}: No such file or directory`;
      case 'ping':
        return `PING ${args[1] || ''} (127.0.0.1): 56 data bytes...`;
      default:
        return `sh: command not found: ${command}`;
    }
  };

  const handleCmdExec = (e: React.FormEvent) => {
    e.preventDefault();
    addLog('HTTP', `POST /api/ping IP=${ip}`);
    
    const rawInput = ip;
    const injectionChars = [';', '&&', '|', '\n'];
    let splitChar = injectionChars.find(c => rawInput.includes(c));
    
    let commandsToRun = [];
    
    if (splitChar) {
        const parts = rawInput.split(splitChar);
        // The first part is the arg to ping
        commandsToRun.push(`ping -c 1 ${parts[0]}`);
        // The rest are separate commands
        // Handle basic chaining
        for(let i=1; i<parts.length; i++) {
            commandsToRun.push(parts[i].trim());
        }
    } else {
        commandsToRun.push(`ping -c 1 ${rawInput}`);
    }

    const newOutput = [...terminalOutput];
    newOutput.push(`$ ./diagnostic_tool.sh --target "${rawInput}"`);

    commandsToRun.forEach(fullCmd => {
        const [cmdName, ...args] = fullCmd.split(' ');
        
        if (cmdName === 'ping') {
             newOutput.push(`PING ${args[2] || args[0]} (127.0.0.1): 56 data bytes`);
             newOutput.push(`64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.045 ms`);
             newOutput.push(`--- ${args[2] || args[0]} ping statistics ---`);
             newOutput.push(`1 packets transmitted, 1 packets received, 0.0% packet loss`);
        } else {
             // Execute malicious command
             const result = executeCommand(fullCmd);
             addLog('SHELL', `exec: ${fullCmd}`);
             newOutput.push(result);
        }
    });

    setTerminalOutput(newOutput);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">Network Ping Tool</h3>
        <p className="text-xs text-gray-500">
           Server-side diagnostic utility. Enter an IP address to check connectivity.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCmdExec} className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Target Host / IP</label>
        <div className="flex gap-2">
            <input
                type="text"
                className="flex-1 border border-gray-300 p-2 rounded font-mono text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="e.g. 1.1.1.1"
            />
            <button className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded font-bold text-sm transition-colors">
                PING
            </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">
            <span className="font-bold text-orange-500">WARNING:</span> Input is passed directly to system shell.
        </p>
      </form>

      {/* Terminal Output */}
      <div className="flex-1 bg-[#1e1e1e] rounded-lg border border-gray-700 p-4 font-mono text-xs overflow-hidden flex flex-col shadow-inner">
         <div className="flex items-center gap-1.5 mb-2 border-b border-gray-700 pb-2">
             <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
             <span className="ml-2 text-gray-500">root@vulnerable-server:~</span>
         </div>
         <div className="flex-1 overflow-y-auto space-y-1 text-gray-300" ref={outputRef}>
             {terminalOutput.map((line, i) => (
                 <div key={i} className="break-all whitespace-pre-wrap">
                    {line.startsWith('$') ? <span className="text-green-400">{line}</span> : line}
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
};