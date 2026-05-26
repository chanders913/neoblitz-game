import React, { useState } from 'react';
import { PlayerStats, Skin } from '../types';

interface ArmoryTabProps {
  playerStats: PlayerStats;
  skins: Skin[];
  onEquipSkin: (id: string) => void;
  onBuySkin: (id: string, costVolt?: number, costGems?: number) => void;
}

export default function ArmoryTab({
  playerStats,
  skins,
  onEquipSkin,
  onBuySkin,
}: ArmoryTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'SKINS' | 'CORES' | 'CUSTOMIZE'>('SKINS');
  const [selectedSkinId, setSelectedSkinId] = useState<string>(playerStats.equippedSkinId);
  const [activeCore, setActiveCore] = useState<string>('chrono');
  const [beamColor, setBeamColor] = useState<string>('cyan');
  
  // Find active data representation
  const activeSelectedSkin = skins.find((s) => s.id === selectedSkinId) || skins[0];
  const activeEquippedSkin = skins.find((s) => s.id === playerStats.equippedSkinId) || skins[0];

  const handleEquipClick = (skin: Skin) => {
    if (skin.owned) {
      onEquipSkin(skin.id);
    } else {
      // Trigger buy flow directly
      if (
        (!skin.costVolt || playerStats.volt >= skin.costVolt) &&
        (!skin.costGems || playerStats.gems >= skin.costGems)
      ) {
        if (confirm(`Unlock ${skin.name} for ${skin.costVolt ? skin.costVolt + ' Volt' : ''} ${skin.costGems ? 'and ' + skin.costGems + ' Gems' : ''}?`)) {
          onBuySkin(skin.id, skin.costVolt, skin.costGems);
        }
      } else {
        alert("Insufficient dynamic credits to unlock this legendary skin! Play matchmaking battles to earn dynamic Volt caches.");
      }
    }
  };

  return (
    <div className="flex-grow flex flex-col w-full max-w-md mx-auto relative z-10 pb-6 pr-1">
      
      {/* Hero Pedestal View */}
      <section className="relative w-full h-[280px] flex items-center justify-center overflow-hidden shrink-0 mt-2 select-none">
        {/* Ambient Glowing Orbs */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-56 h-56 bg-blue-500/10 rounded-full blur-[60px] animate-pulse"></div>
          <div className="absolute w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] translate-y-10"></div>
        </div>

        {/* Dynamic Pedestal Base */}
        <div className="absolute bottom-6 w-40 h-8 rounded-full border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)_inset,0_10px_20px_rgba(0,0,0,0.8)] bg-[#05070a]/80 backdrop-blur-sm z-0"></div>

        {/* Floating Core Orb (Bounce animations based on selected skins) */}
        <div className="relative z-10 w-44 h-44 animate-bounce duration-[4000ms] flex items-center justify-center">
          <img 
            className="w-40 h-40 object-contain rounded-full shadow-[0_0_35px_rgba(59,130,246,0.3)] border border-blue-500/30 p-2 bg-[#05070a]/90 transition-all duration-300" 
            src={activeSelectedSkin.orbImage}
            alt={activeSelectedSkin.name}
          />
        </div>

        {/* Selected/Equipped Overlay Label */}
        <div className="absolute bottom-0 z-20 flex flex-col items-center select-none">
          <span className="font-label-caps text-[9px] text-slate-400 tracking-[0.2em] uppercase select-none font-bold">
            {activeSelectedSkin.id === playerStats.equippedSkinId ? 'ACTIVE EQUIPMENT' : 'PREVIEW BLUEPRINT'}
          </span>
          <div className="mt-1 bg-[#05070a]/75 backdrop-blur-md border border-blue-500/40 rounded-md px-4 py-0.5 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
            <span className="font-headline text-sm text-blue-400 italic tracking-tight font-extrabold uppercase select-none">
              {activeSelectedSkin.name}
            </span>
          </div>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      <nav className="flex justify-around items-center py-2.5 mt-4 border-b border-white/5 relative z-10 select-none">
        <button 
          onClick={() => { setActiveSubTab('SKINS'); }}
          className={`font-label-caps text-xs pb-1.5 px-2 transition-all cursor-pointer ${
            activeSubTab === 'SKINS' 
              ? 'text-blue-400 border-b-2 border-blue-500 font-bold shadow-[0_10px_10px_-10px_rgba(59,130,246,0.5)]' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          SKINS
        </button>
        <button 
          onClick={() => { setActiveSubTab('CORES'); }}
          className={`font-label-caps text-xs pb-1.5 px-2 transition-all cursor-pointer ${
            activeSubTab === 'CORES' 
              ? 'text-blue-400 border-b-2 border-blue-500 font-bold shadow-[0_10px_10px_-10px_rgba(59,130,246,0.5)]' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          CORES
        </button>
        <button 
          onClick={() => { setActiveSubTab('CUSTOMIZE'); }}
          className={`font-label-caps text-xs pb-1.5 px-2 transition-all cursor-pointer ${
            activeSubTab === 'CUSTOMIZE' 
              ? 'text-blue-400 border-b-2 border-blue-500 font-bold shadow-[0_10px_10px_-10px_rgba(59,130,246,0.5)]' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Tuning
        </button>
      </nav>

      {/* Dynamic Sub-Tab Content */}
      <div className="flex-1 mt-3">
        {activeSubTab === 'SKINS' && (
          <section className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
            {skins.map((skin) => {
              const isEquipped = skin.id === playerStats.equippedSkinId;
              const isSelected = skin.id === selectedSkinId;
              
              return (
                <div 
                  key={skin.id}
                  onClick={() => setSelectedSkinId(skin.id)}
                  className={`relative rounded-xl border p-3 flex flex-col items-center cursor-pointer transition-all duration-300 group select-none ${
                    isSelected 
                      ? 'bg-white/5 border-blue-500/65 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Status Indicator */}
                  {isEquipped ? (
                    <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] select-none">
                      <span className="material-symbols-outlined text-[12px] text-[#05070a] font-black leading-none">check</span>
                    </div>
                  ) : !skin.owned ? (
                    <div className="absolute top-2 right-2 flex items-center justify-center text-xs text-slate-400 select-none">
                      <span className="material-symbols-outlined text-sm leading-none">lock</span>
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(139,92,246,0.8)] select-none" />
                  )}

                  {/* Skin image circle */}
                  <div className={`w-14 h-14 rounded-full border mb-2 mt-1 flex items-center justify-center overflow-hidden transition-all duration-300 ${
                    isSelected ? 'border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'border-white/20'
                  }`}>
                    {skin.owned ? (
                      <img className="w-full h-full object-cover opacity-80" src={skin.thumbnail} alt={skin.name} />
                    ) : (
                      <img className="w-full h-full object-cover grayscale blur-[1px] opacity-40" src={skin.thumbnail} alt={skin.name} />
                    )}
                  </div>

                  <span className={`font-sans font-semibold text-center leading-tight text-xs block select-none ${
                    isSelected ? 'text-blue-400' : 'text-white'
                  }`}>
                    {skin.name}
                  </span>
                  
                  <span className="font-label-caps text-[9px] text-slate-400/80 mt-0.5 select-none">
                    {skin.rarity}
                  </span>

                  {/* Buy/Equip action floating button for selected items */}
                  {isSelected && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEquipClick(skin); }}
                      className={`mt-2 py-1 px-3 w-full rounded font-label-caps text-[10px] uppercase font-bold text-center border transition-all ${
                        isEquipped 
                          ? 'border-white/5 bg-[#05070a]/40 text-slate-400 cursor-default'
                          : skin.owned 
                            ? 'border-blue-500 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20'
                            : 'border-purple-500 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                      }`}
                    >
                      {isEquipped ? 'EQUIPPED' : skin.owned ? 'EQUIP' : 'UNLOCK'}
                    </button>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* Passive CORES Tab */}
        {activeSubTab === 'CORES' && (
          <section className="space-y-2 max-h-[280px] overflow-y-auto pr-1 select-none">
            <div 
              onClick={() => setActiveCore('chrono')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                activeCore === 'chrono' ? 'bg-white/5 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-glow text-blue-400 text-2xl">speed</span>
                <div>
                  <h4 className="font-sans font-bold text-xs text-white uppercase">Chrono Regenerator</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Blast fire cooldown decreased by 15%</p>
                </div>
              </div>
              <span className="font-code text-blue-400 text-[10px] font-bold">ACTIVE</span>
            </div>

            <div 
              onClick={() => setActiveCore('shield')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                activeCore === 'shield' ? 'bg-white/5 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-purple-400 text-2xl">security</span>
                <div>
                  <h4 className="font-sans font-bold text-xs text-white uppercase">Sentinel Overload</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Shield absorbs 20% more kinetic energy damage</p>
                </div>
              </div>
              <span className="font-code text-purple-400 text-[10px] font-bold">EQUIP</span>
            </div>

            <div 
              onClick={() => setActiveCore('volt')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                activeCore === 'volt' ? 'bg-white/5 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-indigo-400 text-2xl">monetization_on</span>
                <div>
                  <h4 className="font-sans font-bold text-xs text-white uppercase">Volt Collector Link</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Increases dynamic match credits cache by 20%</p>
                </div>
              </div>
              <span className="font-code text-indigo-400 text-[10px] font-bold">LOCK</span>
            </div>
          </section>
        )}

        {/* CUSTOMIZE Speed Tuning Tab */}
        {activeSubTab === 'CUSTOMIZE' && (
          <section className="glass-panel p-4 rounded-xl space-y-4 select-none">
            <div className="space-y-2">
              <label className="font-code-sm text-xs text-slate-400 block select-none">JETPACK PROJECTILE BEAM COLOR</label>
              <div className="flex gap-3">
                {['cyan', 'magenta', 'lime', 'amber'].map((color) => (
                  <button 
                    key={color}
                    onClick={() => setBeamColor(color)}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
                      beamColor === color ? 'scale-110 border-white shadow-lg' : 'border-transparent'
                    }`}
                    style={{
                      backgroundColor: 
                        color === 'cyan' ? '#3b82f6' : 
                        color === 'magenta' ? '#a855f7' : 
                        color === 'lime' ? '#10b981' : '#6366f1'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1 select-none">
              <div className="flex justify-between items-center text-[10px] font-code text-slate-400">
                <span>PARTICLE TRAIL DENSITY</span>
                <span className="text-blue-400">HIGH (150p)</span>
              </div>
              <div className="h-2 bg-[#05070a] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: '80%' }} />
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 italic font-sans leading-relaxed">
              *Tuning settings directly affect visual tracers, blast flares, and engine thrust trails inside active combat matchmaking arenas.
            </p>
          </section>
        )}
      </div>

    </div>
  );
}
