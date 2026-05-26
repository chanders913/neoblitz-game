import React, { useState } from 'react';
import { PlayerStats, VaultLevel } from '../types';
import { VAULT_TRACK } from '../data';

interface VaultTabProps {
  playerStats: PlayerStats;
  onUpdateStats: (updates: Partial<PlayerStats>) => void;
}

export default function VaultTab({
  playerStats,
  onUpdateStats,
}: VaultTabProps) {
  const [claimedLevels, setClaimedLevels] = useState<Record<number, { free: boolean; elite: boolean }>>({
    7: { free: true, elite: false },
    8: { free: false, elite: false },
  });
  const [elitePassUnlocked, setElitePassUnlocked] = useState(false);
  const [unlockedReward, setUnlockedReward] = useState<{ name: string; img?: string; type: string } | null>(null);

  const handleClaimReward = (level: number, type: 'free' | 'elite', prizeName: string) => {
    // Deduct / Add stats
    if (type === 'free') {
      if (level === 8) {
        onUpdateStats({ volt: playerStats.volt + 500, gems: playerStats.gems + 20 });
      }
    } else {
      onUpdateStats({ gems: playerStats.gems + 50 });
    }

    setClaimedLevels((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        [type]: true,
      },
    }));

    // Trigger reward showcase window
    setUnlockedReward({
      name: prizeName,
      img: level === 8 && type === 'free' 
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHYlkyoQZONAq2xz22hoF9d63LeYp86YptOtFZhH7GfkNvZDhqiiZ6eY_XZ8wMhmCLrTf4vDUgLeVuCEsssL_extNjDVA6vvNOg06jrcf5yekF69QduCeFwA-fey9ZvSaviD9yzz7ZIzipRYfpyj8uDjaBowB9FplSMNMJUv38YCcW8Ifg4iPTujNByy5-V-Jtjd4Ph5aFf7DL8n5A_x7KB4VFlWqDrp7sRv5DcrGNf6vbxog9niqvaKq5vWtuvJzGhypgd3Xw4_8' // weapon skin
        : undefined,
      type: type === 'free' ? 'FREE PASS LAUNCHER' : 'ELITE SEASON REWARD',
    });
  };

  const handleUnlockElite = () => {
    setElitePassUnlocked(true);
    onUpdateStats({ gems: playerStats.gems >= 100 ? playerStats.gems - 100 : playerStats.gems });
    setUnlockedReward({
      name: 'ELITE MULTIPLIER REGULATOR ACTIVE',
      type: 'PASS LEVEL UPGRADE',
    });
  };

  return (
    <div className="flex-grow flex flex-col w-full max-w-lg mx-auto relative z-10 pb-6 pr-1 select-none">
      
      {/* Dynamic Pop-up Rewards Window */}
      {unlockedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm glass-panel text-center p-6 rounded-2xl border border-blue-500/70 shadow-[0_0_35px_rgba(59,130,246,0.4)] space-y-4">
            <span className="font-label-caps text-xs text-white px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full font-bold select-none leading-none shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              REWARD UNLOCKED!
            </span>

            {unlockedReward.img ? (
              <div className="w-32 h-32 rounded-xl mx-auto border-2 border-blue-500/50 overflow-hidden bg-[#05070a] flex items-center justify-center p-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-bounce select-none">
                <img src={unlockedReward.img} alt={unlockedReward.name} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto bg-purple-500/10 border-2 border-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-pulse">
                <span className="material-symbols-outlined text-4xl text-purple-400">military_tech</span>
              </div>
            )}

            <div className="space-y-1 select-none">
              <h3 className="font-headline text-lg text-white font-extrabold italic uppercase drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                {unlockedReward.name}
              </h3>
              <p className="font-code text-[11px] text-slate-400 uppercase">
                {unlockedReward.type} • ADDED TO ACCOUNT
              </p>
            </div>

            <button 
              onClick={() => setUnlockedReward(null)}
              className="px-6 py-2 rounded bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-label-caps uppercase font-bold select-none cursor-pointer hover:scale-105 active:scale-95 transition-all w-full leading-none shadow-md"
            >
              CONFIRM CLAIM
            </button>
          </div>
        </div>
      )}

      {/* Season Banner Card */}
      <section className="relative w-full h-[180px] md:h-[220px] rounded-xl overflow-hidden border border-blue-500/30 shadow-[0_0_25px_rgba(59,130,246,0.15)] bg-[#05070a] select-none">
        <img 
          alt="Season Cover" 
          className="absolute inset-0 w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXIt3pq5BUN5M-Gnb69nPE0EGGp1YRk9Ejg5PE_T882CHCOcj08xEIaVRVQ0LnSxW2AT0OUTnZwTgZ7qPD7ReLWAInkZhDpCmR4dDnJdhn7qOHVD00sGXv08V9qxWBQdyHhigYgeD-0ErnGmR1Wb5mow8Kh4fqKoQQxyegfx4cgd7bhdWzWWL7e4zwZdWHJfu5ABmQoFia_noG6Oh2bZUeuWHm0bfIQ_hNnb7yC3cy8SDwI3Otprju8tgxoE46ySNMNuwMINlVQnw" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070a]/95 via-[#05070a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 z-10 text-left select-none max-w-[80%]">
          <div className="bg-purple-600 text-[#ffd7f0] font-label-caps text-[9px] px-2 py-0.5 rounded uppercase font-bold select-none self-start shadow-[0_0_10px_rgba(139,92,246,0.5)] mb-1">
            Active Season Pass
          </div>
          <h2 className="font-headline text-lg md:text-xl text-[#e1fdff] font-extrabold italic uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] leading-tight">
            SEASON 1:<br />NEON GENESIS
          </h2>
          <p className="font-sans text-[10px] text-slate-400 leading-relaxed mt-0.5 select-none">
            Unlock exclusive dynamic projectile skins, weapon attachments and dynamic gems.
          </p>
        </div>
      </section>

      {/* Progress Lane Level */}
      <section className="flex flex-col gap-2 mt-4 select-none">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="font-headline text-sm text-[#e1fdff] font-bold uppercase tracking-wider select-none">
              Vault Progress
            </h3>
            <p className="font-code text-[10px] text-slate-400 mt-0.5 select-none">LEVEL 8 / 50</p>
          </div>
          <button 
            onClick={handleUnlockElite}
            disabled={elitePassUnlocked}
            className={`font-label-caps text-[9px] py-1.5 px-3 rounded uppercase border select-none transition-all leading-none ${
              elitePassUnlocked 
                ? 'border-purple-500/30 bg-purple-500/10 text-purple-300 cursor-default' 
                : 'border-blue-500 bg-blue-500/20 text-blue-300 hover:bg-blue-500/40 cursor-pointer'
            }`}
          >
            {elitePassUnlocked ? 'ELITE ACTIVE' : 'UNLOCK ELITE PASS'}
          </button>
        </div>

        {/* Level Process Progress Bar */}
        <div className="relative w-full h-3 bg-[#05070a] rounded-full overflow-hidden border border-white/5 shadow-inner">
          <div className="absolute top-0 left-0 h-full bg-blue-500/80 progress-pulse rounded-full" style={{ width: '16%' }} />
        </div>
      </section>

      {/* Reward Track Scroll */}
      <section className="flex flex-col mt-4 select-none">
        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 pl-1">
          {VAULT_TRACK.map((reward) => {
            const isClaimedFree = claimedLevels[reward.level]?.free || false;
            const isClaimedElite = claimedLevels[reward.level]?.elite || false;
            const isActiveLevel = reward.level === 8;

            return (
              <div 
                key={reward.level}
                className="flex flex-col gap-3 min-w-[120px] shrink-0 transform hover:scale-[1.02] transition-transform select-none"
              >
                {/* Level Title */}
                <div className="text-center">
                  <span className={`font-label-caps text-[10px] ${
                    isActiveLevel ? 'text-purple-400 font-bold' : 'text-slate-400'
                  }`}>
                    LVL {reward.level}
                  </span>
                </div>

                {/* Free Rewards Slot */}
                <div className={`h-24 rounded-lg glass-panel relative flex flex-col items-center justify-center p-2.5 ${
                  isActiveLevel 
                    ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                    : isClaimedFree ? 'opacity-40 border-white/5' : 'border-white/10'
                }`}>
                  {reward.freeReward.img ? (
                    <img src={reward.freeReward.img} alt="" className="w-10 h-10 object-contain mb-1.5" />
                  ) : (
                    <span className="material-symbols-outlined text-blue-400 text-2xl mb-1 select-none">
                      {reward.freeReward.type === 'Volt' ? 'currency_rupee' : 'backpack'}
                    </span>
                  )}
                  <span className="font-label-caps text-[8px] text-white text-center leading-tight truncate max-w-full font-bold">
                    {reward.freeReward.name}
                  </span>

                  {/* Claim Status overlays */}
                  {isClaimedFree ? (
                    <div className="absolute inset-0 bg-[#05070a]/80 rounded-lg flex items-center justify-center select-none">
                      <span className="material-symbols-outlined text-blue-400 text-sm">check_circle</span>
                    </div>
                  ) : isActiveLevel ? (
                    <button 
                      onClick={() => handleClaimReward(reward.level, 'free', reward.freeReward.name)}
                      className="absolute -bottom-3 w-[90%] left-[5%] py-1 rounded bg-blue-500 text-slate-100 font-label-caps font-bold text-[8px] uppercase select-none text-center cursor-pointer shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                    >
                      CLAIM
                    </button>
                  ) : (
                    <div className="absolute top-1 right-1 text-slate-400 select-none text-[8px]">FREE</div>
                  )}
                </div>

                {/* Elite Reward Slot */}
                <div className={`h-24 rounded-lg glass-panel relative flex flex-col items-center justify-center p-2.5 bg-[#05070a]/90 ${
                  isClaimedElite ? 'opacity-40 border-white/5' : 'border-purple-500/20'
                }`}>
                  {reward.eliteReward.img ? (
                    <img src={reward.eliteReward.img} alt="" className="w-10 h-10 object-contain mb-1.5" />
                  ) : (
                    <span className="material-symbols-outlined text-purple-400 text-2xl mb-1 select-none">
                      {reward.eliteReward.type === 'Gems' ? 'diamond' : 'security'}
                    </span>
                  )}
                  <span className="font-label-caps text-[8px] text-[#fface8] text-center leading-tight truncate max-w-full font-semibold">
                    {reward.eliteReward.name}
                  </span>

                  {/* Locked elite conditions */}
                  {isClaimedElite ? (
                    <div className="absolute inset-0 bg-[#05070a]/80 rounded-lg flex items-center justify-center select-none">
                      <span className="material-symbols-outlined text-blue-400 text-sm">check_circle</span>
                    </div>
                  ) : !elitePassUnlocked ? (
                    <div className="absolute inset-0 bg-[#05070a]/80 rounded-lg flex items-center justify-center select-none">
                      <span className="material-symbols-outlined text-slate-500 text-xs">lock</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleClaimReward(reward.level, 'elite', reward.eliteReward.name)}
                      className="absolute -bottom-3 w-[90%] left-[5%] py-1 rounded bg-purple-500 text-white font-label-caps font-bold text-[8px] uppercase select-none text-center cursor-pointer shadow-[0_0_10px_rgba(139,92,246,0.6)]"
                    >
                      CLAIM
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
