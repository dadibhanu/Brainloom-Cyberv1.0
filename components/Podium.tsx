import React from 'react';
import { User } from '../types';

interface PodiumProps {
  users?: User[];
}

export const Podium: React.FC<PodiumProps> = ({ users = [] }) => {
  // Sort podium users by rank to ensure correct order
  const sorted = [...users].sort((a, b) => a.rank - b.rank);
  
  if (sorted.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 mb-16 px-4 pt-8">
        <div className="text-center text-gray-500 font-mono">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">leaderboard</span>
          <p>No rankings available yet.</p>
        </div>
      </div>
    );
  }

  const [first, second, third] = sorted;

  return (
    <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-16 px-4 pt-8">
      {/* 2nd Place */}
      {second && (
        <div className="order-2 md:order-1 w-full md:w-1/3 max-w-sm relative group">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
            <span className="bg-gray-800 text-gray-300 font-bold px-3 py-1 rounded-full border border-gray-600 text-sm shadow-lg">
              #2
            </span>
          </div>
          <div className="rank-silver rounded-xl p-6 text-center relative overflow-hidden transition-transform duration-300 hover:-translate-y-2 bg-background-card">
            <div className="absolute top-0 right-0 p-3 opacity-20">
              <span className="material-symbols-outlined text-4xl text-gray-400">military_tech</span>
            </div>
            <div className="mb-4 relative inline-block">
              <div className="w-20 h-20 rounded-full p-1 border-2 border-gray-400 mx-auto">
                <img
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                  src={second.avatar}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-1 border border-gray-600">
                <span className="material-symbols-outlined text-gray-300 text-sm">security</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1 truncate">{second.name}</h3>
            <p className="text-primary font-mono text-sm mb-4">Lvl {second.level}</p>
            <div className="bg-black/30 rounded-lg p-2 border border-white/5">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Total XP</p>
              <p className="text-white font-mono font-bold text-lg">{second.xp.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* 1st Place */}
      {first && (
        <div className="order-1 md:order-2 w-full md:w-1/3 max-w-sm relative z-10 -mt-8 md:-mt-12 group">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
            <span className="text-yellow-400 mb-1 material-symbols-outlined text-3xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
              emoji_events
            </span>
          </div>
          <div className="rank-gold rounded-xl p-8 text-center relative overflow-hidden transition-transform duration-300 hover:-translate-y-2 shadow-[0_0_30px_rgba(255,215,0,0.05)] bg-background-card">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>
            <div className="mb-5 relative inline-block">
              <div className="w-24 h-24 rounded-full p-1 border-2 border-yellow-400 mx-auto shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                <img
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                  src={first.avatar}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-yellow-900 rounded-full p-1.5 border border-yellow-500">
                <span className="material-symbols-outlined text-yellow-400 text-sm">local_police</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1 truncate">{first.name}</h3>
            <p className="text-yellow-400 font-mono text-sm mb-6 font-semibold">
              Lvl {first.level} • Grandmaster
            </p>
            <div className="bg-black/40 rounded-lg p-3 border border-yellow-500/30 backdrop-blur-sm">
              <p className="text-yellow-200/70 text-xs uppercase tracking-wider">Total XP</p>
              <p className="text-white font-mono font-bold text-2xl tracking-tight">
                {first.xp.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3rd Place */}
      {third && (
        <div className="order-3 w-full md:w-1/3 max-w-sm relative group">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
            <span className="bg-gray-800 text-orange-300 font-bold px-3 py-1 rounded-full border border-orange-700 text-sm shadow-lg">
              #3
            </span>
          </div>
          <div className="rank-bronze rounded-xl p-6 text-center relative overflow-hidden transition-transform duration-300 hover:-translate-y-2 bg-background-card">
            <div className="absolute top-0 right-0 p-3 opacity-20">
              <span className="material-symbols-outlined text-4xl text-orange-400">military_tech</span>
            </div>
            <div className="mb-4 relative inline-block">
              <div className="w-20 h-20 rounded-full p-1 border-2 border-orange-700 mx-auto">
                <img
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                  src={third.avatar}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1 truncate">{third.name}</h3>
            <p className="text-primary font-mono text-sm mb-4">Lvl {third.level}</p>
            <div className="bg-black/30 rounded-lg p-2 border border-white/5">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Total XP</p>
              <p className="text-white font-mono font-bold text-lg">{third.xp.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};