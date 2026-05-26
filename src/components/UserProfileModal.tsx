import React, { useState } from 'react';
import { PlayerStats, Skin } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerStats: PlayerStats;
  equippedSkin: Skin;
  onUpdateStats: (updates: Partial<PlayerStats>) => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  playerStats,
  equippedSkin,
  onUpdateStats,
}: UserProfileModalProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(playerStats.name);

  if (!isOpen) return null;

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateStats({ name: nameInput.trim() });
      setIsEditingName(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-lg glass-panel rounded-2xl border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration bar */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 select-none">account_circle</span>
            <span className="font-label-caps text-sm tracking-widest text-blue-300">BLITZER IDENTITY</span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-purple-900/30 hover:border-purple-500 transition-all text-slate-200"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 select-none">
          {/* Top Section: Level & Identity Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Level ring */}
              <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-transparent p-[3px] shadow-[0_0_15px_rgba(59,130,246,0.25)]">
                <div className="w-full h-full bg-[#05070a] rounded-full flex items-center justify-center font-headline text-lg text-blue-400 font-bold">
                  {playerStats.level}
                </div>
              </div>

              <div className="space-y-1">
                {isEditingName ? (
                  <div className="flex items-center gap-1">
                    <input 
                      type="text" 
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={14}
                      className="bg-black/40 border-b-2 border-blue-400 text-white font-sans font-bold text-base px-1 py-0.5 max-w-[120px] focus:outline-none focus:ring-0"
                    />
                    <button 
                      onClick={handleSaveName}
                      className="text-blue-400 hover:text-blue-200"
                    >
                      <span className="material-symbols-outlined text-base">check</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="font-sans text-lg text-white font-bold tracking-wide uppercase">
                      {playerStats.name}
                    </h2>
                    <button 
                      onClick={() => setIsEditingName(true)}
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </div>
                )}
                <p className="font-code-sm text-xs text-blue-400 tracking-wider uppercase select-none">
                  Grandmaster Tier
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-code-sm text-[11px] text-slate-400 block select-none">RANK</span>
              <span className="font-headline text-xl text-purple-400 block leading-none select-none">
                #{playerStats.rank}
              </span>
            </div>
          </div>

          {/* Active Skin Banner */}
          <div className="relative h-[220px] rounded-xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.1)] bg-[#05070A]">
            <img 
              alt="Active Skin Banner" 
              className="w-full h-full object-cover object-top opacity-70" 
              src={equippedSkin.characterImage} 
            />
            {/* Dark gradient blur over image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/20 to-transparent" />
            
            <div className="absolute bottom-3 left-3 flex flex-col z-10 select-none">
              <div className="inline-block self-start px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-label-caps text-[9px] uppercase rounded-full mb-1 font-bold tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                ACTIVE LOADOUT
              </div>
              <h3 className="font-headline text-lg md:text-xl text-white font-extrabold italic uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                {equippedSkin.name}
              </h3>
              <p className="font-code text-[11px] text-slate-400 mt-0.5">
                Rarity: {equippedSkin.rarity} | Equipped
              </p>
            </div>
          </div>

          {/* Player Stats Bento Grid */}
          <div className="space-y-2 select-none">
            <h4 className="font-code text-[11px] text-slate-400 uppercase tracking-widest pl-1 select-none">
              COMPETITIVE STATISTICS
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center items-center text-center">
                <span className="material-symbols-outlined text-blue-400 mb-1 text-2xl">emoji_events</span>
                <span className="font-code-sm text-[10px] text-slate-300 uppercase tracking-wider">Wins</span>
                <span className="font-headline text-base font-bold text-white mt-0.5">
                  {playerStats.wins.toLocaleString()}
                </span>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center items-center text-center">
                <span className="material-symbols-outlined text-purple-400 mb-1 text-2xl">skull</span>
                <span className="font-code-sm text-[10px] text-slate-300 uppercase tracking-wider font-bold">Total KOs</span>
                <span className="font-headline text-base font-bold text-purple-300 mt-0.5">
                  {playerStats.totalKos.toLocaleString()}
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center items-center text-center">
                <span className="material-symbols-outlined text-blue-400 mb-1 text-2xl">speed</span>
                <span className="font-code-sm text-[10px] text-slate-300 uppercase tracking-wider">Top Speed</span>
                <span className="font-headline text-base font-bold text-blue-400 mt-0.5 whitespace-nowrap">
                  {playerStats.topSpeed} <span className="text-[10px] font-sans">km/h</span>
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-center items-center text-center">
                <span className="material-symbols-outlined text-blue-400 mb-1 text-2xl">route</span>
                <span className="font-code-sm text-[10px] text-slate-300 uppercase tracking-wider">Distance</span>
                <span className="font-headline text-base font-bold text-white mt-0.5 whitespace-nowrap">
                  {(playerStats.distance / 1000).toFixed(0)}k <span className="text-[10px]">m</span>
                </span>
              </div>
            </div>
          </div>

          {/* Connections / Settings Section */}
          <div className="space-y-2 select-none">
            <h4 className="font-code text-[11px] text-slate-400 uppercase tracking-widest pl-1 select-none">
              SYSTEM & CONNECTIONS
            </h4>
            <div className="space-y-1">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 pr-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-blue-400">sports_esports</span>
                  </div>
                  <div className="text-left">
                    <div className="font-sans text-sm text-white font-semibold">Cross-Play Link</div>
                    <div className="font-code-sm text-[10px] text-blue-400">Connected (PC/Console)</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-blue-400 text-base">check_circle</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3 pr-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-blue-400">settings</span>
                  </div>
                  <div className="text-left">
                    <div className="font-sans text-sm text-white font-semibold">Matchmaking Server</div>
                    <div className="font-code-sm text-[10px] text-slate-300">Dynamic Region Routing</div>
                  </div>
                </div>
                <div className="w-2 h-2 bg-blue-400 rounded-full active-ring" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-3 bg-[#05070a] border-t border-white/10 flex justify-end gap-2 shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded bg-gradient-to-r from-blue-500/10 to-indigo-500/20 text-blue-300 text-xs font-label-caps uppercase border border-blue-500/30 hover:from-blue-500/20 hover:to-indigo-500/30 transition-all select-none"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
