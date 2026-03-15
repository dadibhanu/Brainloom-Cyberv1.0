import React from 'react';
import { BadgeDisplay } from './BadgeDisplay';
import { User } from '../types';

interface TableProps {
    user: User | null;
    entries?: User[];
}

export const Table: React.FC<TableProps> = ({ user, entries = [] }) => {
  return (
    <div className="bg-background-card border border-gray-800 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-800">
            <tr>
              <th className="p-4 pl-6 w-16 text-center">Rank</th>
              <th className="p-4 w-1/3 min-w-[200px]">Hacker</th>
              <th className="p-4 w-32 hidden md:table-cell">Level</th>
              <th className="p-4 w-48">XP Progress</th>
              <th className="p-4 hidden lg:table-cell text-right pr-6">Badges</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50 text-sm">
            {entries.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 font-mono">
                        No leaderboard entries available.
                    </td>
                </tr>
            ) : (
                entries.map((entry, index) => {
                const rowClass = index % 2 === 0 ? 'hover:bg-white/5' : 'bg-white/[0.02] hover:bg-white/5';
                const xpPercentage = Math.min(Math.max((entry.xp % 10000) / 100, 20), 100); 
                
                return (
                    <tr key={entry.id} className={`${rowClass} transition-colors group`}>
                    <td className="p-4 pl-6 text-center font-mono text-gray-500 font-bold group-hover:text-white">
                        {String(entry.rank).padStart(2, '0')}
                    </td>
                    <td className="p-4">
                        <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                            alt="User Avatar"
                            className="h-10 w-10 rounded-full object-cover border border-gray-700"
                            src={entry.avatar}
                            referrerPolicy="no-referrer"
                            />
                        </div>
                        <div>
                            <div className="font-bold text-white flex items-center gap-2">
                            {entry.name}
                            {entry.isPro && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 uppercase font-bold tracking-wider">
                                Pro
                                </span>
                            )}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">{entry.handle}</div>
                        </div>
                        </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                        <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-300 font-mono font-bold text-xs">
                        LVL {entry.level}
                        </span>
                    </td>
                    <td className="p-4">
                        <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-gray-400 font-mono mb-1">
                            <span>{entry.xp.toLocaleString()} XP</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: `${xpPercentage}%` }}></div>
                        </div>
                        </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-right pr-6">
                        <BadgeDisplay badges={entry.badges} />
                    </td>
                    </tr>
                );
                })
            )}

            {/* Current User Row */}
            {user && (
                <tr className="bg-primary/10 border-l-4 border-l-primary hover:bg-primary/15 transition-colors group relative">
                <td className="p-4 pl-6 text-center font-mono text-primary-light font-bold">
                    {user.rank || '-'}
                </td>
                <td className="p-4">
                    <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                        alt="Your Avatar"
                        className="h-10 w-10 rounded-full object-cover border-2 border-primary"
                        src={user.avatar}
                        referrerPolicy="no-referrer"
                        />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green"></span>
                        </span>
                    </div>
                    <div>
                        <div className="font-bold text-white flex items-center gap-2">
                        {user.name}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-green/10 text-neon-green border border-neon-green/30 uppercase font-bold tracking-wider">
                            Online
                        </span>
                        </div>
                        <div className="text-xs text-gray-400 font-mono">{user.handle}</div>
                    </div>
                    </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                    <span className="px-2 py-1 rounded bg-primary/20 border border-primary/40 text-primary-light font-mono font-bold text-xs">
                    LVL {user.level}
                    </span>
                </td>
                <td className="p-4">
                    <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-primary-light font-mono mb-1">
                        <span>{user.xp.toLocaleString()} XP</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden border border-primary/20">
                        <div className="bg-neon-green h-full rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-[10px] text-gray-500 text-right mt-1">Next Level: Soon</span>
                    </div>
                </td>
                <td className="p-4 hidden lg:table-cell text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                        <span className="material-symbols-outlined text-gray-500 text-lg p-1 bg-gray-700/30 rounded border border-gray-700 border-dashed cursor-pointer hover:text-white hover:border-white transition-colors" title="Earn more badges!">add</span>
                    </div>
                </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

       {/* Pagination */}
       <div className="bg-black/20 border-t border-gray-800 p-4 flex items-center justify-between">
          <span className="text-sm text-gray-400 font-mono hidden sm:inline">
              Showing <span className="text-white">{entries.length > 0 ? 1 : 0}</span> to <span className="text-white">{entries.length}</span> of <span className="text-white">{entries.length}</span>
          </span>
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <button disabled className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-500 cursor-not-allowed text-sm flex items-center gap-1 opacity-50">
                  <span className="material-symbols-outlined text-sm">chevron_left</span> Prev
              </button>
              <div className="flex items-center gap-1 px-2">
                  <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold shadow-[0_0_10px_rgba(19,91,236,0.3)]">1</button>
              </div>
              <button disabled className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-500 cursor-not-allowed text-sm flex items-center gap-1 opacity-50">
                  Next <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
          </div>
      </div>
    </div>
  );
};