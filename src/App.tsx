import React, { useState, useEffect } from 'react';
import { TabType, PlayerStats, Skin } from './types';
import { INITIAL_PLAYER_STATS, SKINS_CATALOG } from './data';
import DashboardHeader from './components/DashboardHeader';
import UserProfileModal from './components/UserProfileModal';
import LobbyTab from './components/LobbyTab';
import ArmoryTab from './components/ArmoryTab';
import SquadTab from './components/SquadTab';
import VaultTab from './components/VaultTab';
import BattleArenaGame from './components/BattleArenaGame';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('LOBBY');
  const [playerStats, setPlayerStats] = useState<PlayerStats>(INITIAL_PLAYER_STATS);
  const [skins, setSkins] = useState<Skin[]>(SKINS_CATALOG);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isInArena, setIsInArena] = useState(false);

  // Load state from local storage on startup
  useEffect(() => {
    const cachedStats = localStorage.getItem('neoblitz_stats_cache');
    const cachedSkins = localStorage.getItem('neoblitz_skins_cache');
    if (cachedStats) {
      try {
        setPlayerStats(JSON.parse(cachedStats));
      } catch (e) {
        console.error("Failed to parse cached stats", e);
      }
    }
    if (cachedSkins) {
      try {
        setSkins(JSON.parse(cachedSkins));
      } catch (e) {
        console.error("Failed to parse cached skins", e);
      }
    }
  }, []);

  // Save state back to local storage whenever a metric changes
  const updateStatsAndPersist = (updates: Partial<PlayerStats>) => {
    setPlayerStats((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('neoblitz_stats_cache', JSON.stringify(next));
      return next;
    });
  };

  const equipSkinAndPersist = (skinId: string) => {
    updateStatsAndPersist({ equippedSkinId: skinId });
  };

  const buySkinAndPersist = (skinId: string, costVolt?: number, costGems?: number) => {
    setSkins((prevSkins) => {
      const nextSkins = prevSkins.map((s) => s.id === skinId ? { ...s, owned: true } : s);
      localStorage.setItem('neoblitz_skins_cache', JSON.stringify(nextSkins));
      return nextSkins;
    });

    const dedVolt = costVolt ? playerStats.volt - costVolt : playerStats.volt;
    const dedGems = costGems ? playerStats.gems - costGems : playerStats.gems;
    
    updateStatsAndPersist({
      volt: dedVolt,
      gems: dedGems,
      equippedSkinId: skinId, // Auto equip purchased skin
    });
  };

  // Launch battle arena match
  const handleLaunchArena = () => {
    setIsInArena(true);
  };

  // Exit arena match and apply dynamic rewards
  const handleExitArena = (rewards?: { volt: number; gems: number }) => {
    setIsInArena(false);
    if (rewards) {
      // Adding rewards
      const newVolt = playerStats.volt + rewards.volt;
      const newGems = playerStats.gems + rewards.gems;
      const nextProgress = playerStats.dailyProgress >= 3 ? 3 : playerStats.dailyProgress + 1;
      const newWins = playerStats.wins + 1;
      const newKos = playerStats.totalKos + Math.floor(Math.random() * 5) + 3;

      updateStatsAndPersist({
        volt: newVolt,
        gems: newGems,
        dailyProgress: nextProgress,
        wins: newWins,
        totalKos: newKos,
      });
    }
  };

  const activeSkin = skins.find((s) => s.id === playerStats.equippedSkinId) || skins[0];

  // If player inside arena match, bypass standard layout in favor of gameplay canvas
  if (isInArena) {
    return (
      <BattleArenaGame 
        playerStats={playerStats}
        equippedSkin={activeSkin}
        onExitArena={handleExitArena}
      />
    );
  }

  return (
    <div className="min-h-screen text-slate-200 flex flex-col relative w-full overflow-x-hidden select-none bg-[#05070a] cyber-grid">
      
      {/* Background radial atmosphere */}
      <div className="ambient-bg" />

      {/* Persistence Global Header */}
      <DashboardHeader 
        playerStats={playerStats}
        equippedSkin={activeSkin}
        onAvatarClick={() => setIsProfileOpen(true)}
      />

      {/* Main Container Sandbox */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-20 pb-24 md:pb-8 flex flex-col items-center justify-center">
        {activeTab === 'LOBBY' && (
          <LobbyTab 
            playerStats={playerStats}
            onLaunchArena={handleLaunchArena}
            onUpdateStats={updateStatsAndPersist}
          />
        )}
        {activeTab === 'ARMORY' && (
          <ArmoryTab 
            playerStats={playerStats}
            skins={skins}
            onEquipSkin={equipSkinAndPersist}
            onBuySkin={buySkinAndPersist}
          />
        )}
        {activeTab === 'SQUAD' && (
          <SquadTab 
            playerStats={playerStats}
            onUpdateStats={updateStatsAndPersist}
          />
        )}
        {activeTab === 'VAULT' && (
          <VaultTab 
            playerStats={playerStats}
            onUpdateStats={updateStatsAndPersist}
          />
        )}
      </main>

      {/* Tab Navigation Menu Bar */}
      <nav 
        className="bg-[#05070A]/85 backdrop-blur-md fixed bottom-0 left-0 w-full z-30 transition-all select-none border-t border-white/10 shadow-[0_-5px_25px_rgba(59,130,246,0.12)] rounded-t-3xl flex justify-around items-center px-4 pb-4 pt-2"
        id="app-bottom-nav"
      >
        {/* LOBBY TAB */}
        <button 
          onClick={() => { setActiveTab('LOBBY'); }}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'LOBBY'
              ? 'text-blue-400 font-bold scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="font-label-caps text-[10px] mt-0.5 font-bold">LOBBY</span>
        </button>

        {/* ARMORY TAB */}
        <button 
          onClick={() => { setActiveTab('ARMORY'); }}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'ARMORY'
              ? 'text-blue-400 font-bold scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">swords</span>
          <span className="font-label-caps text-[10px] mt-0.5 font-bold">ARMORY</span>
        </button>

        {/* SQUAD TAB */}
        <button 
          onClick={() => { setActiveTab('SQUAD'); }}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'SQUAD'
              ? 'text-blue-400 font-bold scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">group</span>
          <span className="font-label-caps text-[10px] mt-0.5 font-bold">SQUAD</span>
        </button>

        {/* VAULT TAB */}
        <button 
          onClick={() => { setActiveTab('VAULT'); }}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'VAULT'
              ? 'text-blue-400 font-bold scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">shopping_cart</span>
          <span className="font-label-caps text-[10px] mt-0.5 font-bold">VAULT</span>
        </button>
      </nav>

      {/* Sliding User Profile Customizer Backdrop */}
      <UserProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        playerStats={playerStats}
        equippedSkin={activeSkin}
        onUpdateStats={updateStatsAndPersist}
      />
    </div>
  );
}
