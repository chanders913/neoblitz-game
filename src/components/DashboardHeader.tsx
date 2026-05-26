import React from 'react';
import { PlayerStats, Skin } from '../types';

interface DashboardHeaderProps {
  playerStats: PlayerStats;
  equippedSkin: Skin;
  onAvatarClick: () => void;
}

export default function DashboardHeader({
  playerStats,
  onAvatarClick,
}: DashboardHeaderProps) {
  return (
    <header className="bg-[#05070A]/85 backdrop-blur-md border-b border-white/10 fixed top-0 left-0 w-full flex justify-between items-center px-4 md:px-8 h-16 z-40">
      <div className="flex items-center gap-3">
        {/* Leading Avatar with active glowing ring */}
        <div 
          onClick={onAvatarClick}
          className="relative w-10 h-10 rounded-full border-2 border-blue-500/80 active-ring p-[2px] cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          id="hdr-avatar"
        >
          <img 
            alt="Player Avatar" 
            className="w-full h-full rounded-full object-cover" 
            src={playerStats.avatar} 
          />
          {/* Active Status Indicator */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border border-[#05070A] shadow-[0_0_8px_#60a5fa]" />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Aetheris OS inspired icon block */}
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 hidden md:flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.5)]">
            <div className="w-2.5 h-2.5 rounded-full border border-white/50"></div>
          </div>
          <h1 className="font-headline font-extrabold text-[#f8fafc] tracking-tight uppercase select-none">
            NEOBLITZ <span className="font-light text-blue-400">OS</span>
          </h1>
        </div>
      </div>

      {/* Trailing Celestial Coordinates and Currency Counters */}
      <div className="flex items-center gap-4">
        {/* Spatial timing telemetry (desktop-only) */}
        <div className="hidden lg:flex flex-col items-end text-right select-none pr-2">
          <span className="text-[9px] text-blue-400 uppercase tracking-widest font-label-caps leading-none mb-0.5">Orbit Coordinates</span>
          <span className="font-code text-[11px] text-slate-300">14.28.09 / -02.11.54 LMT</span>
        </div>
        
        <div className="hidden lg:block h-6 w-[1px] bg-white/10"></div>

        {/* Currency Counters with space look */}
        <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1 border border-white/10 backdrop-blur-md select-none">
          <div className="flex items-center gap-1 text-xs font-label-caps font-bold text-blue-300 drop-shadow-[0_0_4px_rgba(96,165,250,0.4)] font-bold">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span>{playerStats.volt.toLocaleString()} V</span>
          </div>
          <span className="text-white/10 font-bold text-xs h-3 w-px bg-current self-center" />
          <div className="flex items-center gap-1 text-xs font-label-caps font-bold text-purple-300 drop-shadow-[0_0_4px_rgba(192,132,252,0.4)] font-bold">
            <span className="material-symbols-outlined text-[14px]">diamond</span>
            <span>{playerStats.gems} G</span>
          </div>
        </div>
      </div>
    </header>
  );
}
