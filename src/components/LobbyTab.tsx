import React, { useState, useEffect } from 'react';
import { PlayerStats } from '../types';

interface LobbyTabProps {
  playerStats: PlayerStats;
  onLaunchArena: () => void;
  onUpdateStats: (updates: Partial<PlayerStats>) => void;
}

export default function LobbyTab({
  playerStats,
  onLaunchArena,
}: LobbyTabProps) {
  const [region, setRegion] = useState('na');
  const [matchmakingState, setMatchmakingState] = useState<'IDLE' | 'SEARCHING' | 'FOUND'>('IDLE');
  const [queueTimer, setQueueTimer] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [activeSlide, setActiveSlide] = useState(0);

  // Queue timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (matchmakingState === 'SEARCHING') {
      interval = setInterval(() => {
        setQueueTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setQueueTimer(0);
    }
    return () => clearInterval(interval);
  }, [matchmakingState]);

  // Handle auto find match after 5 seconds
  useEffect(() => {
    if (matchmakingState === 'SEARCHING' && queueTimer >= 5) {
      setMatchmakingState('FOUND');
    }
  }, [queueTimer, matchmakingState]);

  // Match found deployment countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (matchmakingState === 'FOUND') {
      setCountdown(3);
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [matchmakingState]);

  // Handle countdown completion to enter combat
  useEffect(() => {
    if (matchmakingState === 'FOUND' && countdown <= 0) {
      setMatchmakingState('IDLE');
      onLaunchArena(); // Start combat!
    }
  }, [countdown, matchmakingState, onLaunchArena]);

  const toggleSearch = () => {
    if (matchmakingState === 'IDLE') {
      setMatchmakingState('SEARCHING');
    } else if (matchmakingState === 'SEARCHING') {
      setMatchmakingState('IDLE');
    }
  };

  const getRegionName = () => {
    switch (region) {
      case 'na': return 'NA EAST';
      case 'eu': return 'EU CENTRAL';
      case 'ap': return 'AP TOKYO';
      default: return 'NA EAST';
    }
  };

  return (
    <div className="flex-1 select-none flex flex-col justify-center items-center py-4 w-full relative z-10">
      {/* Decorative ambient beams */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Grid Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch relative z-10 max-w-6xl">
        
        {/* Left Side: Daily Challenges & Leaderboard (Hidden on mobile or beautifully bento-aligned in columns) */}
        <aside className="col-span-1 lg:col-span-3 flex flex-col gap-4 justify-between h-auto">
          {/* Bento: Daily Pulse */}
          <div className="glass-panel border-t-2 border-blue-500 rounded-xl p-4 hover:shadow-[0_0_35px_rgba(59,130,246,0.15)] transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans text-sm tracking-wide text-blue-400 font-bold uppercase select-none">Daily Pulse</h3>
              <span className="material-symbols-outlined text-blue-400 text-base select-none">bolt</span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-[#05070a]/45 p-3 rounded-lg border border-white/5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                <span className="font-sans text-xs text-slate-200 select-none">Win 3 Ranked Matches</span>
                <div className="w-full bg-[#020306] h-1.5 rounded-full overflow-hidden select-none">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-500" 
                    style={{ width: playerStats.dailyProgress >= 3 ? '100%' : `${(playerStats.dailyProgress / 3) * 100}%` }}
                  />
                </div>
                <span className="font-code text-[10px] text-slate-400 text-right block select-none">
                  {playerStats.dailyProgress}/3
                </span>
              </div>
            </div>
          </div>

          {/* Bento: Leaderboard preview */}
          <div className="glass-panel border-t-2 border-purple-500 rounded-xl p-4 hover:shadow-[0_0_35px_rgba(139,92,246,0.15)] transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans text-sm tracking-wide text-purple-400 font-bold uppercase select-none">Global Top</h3>
              <span className="material-symbols-outlined text-purple-400 text-base select-none">leaderboard</span>
            </div>
            
            <div className="space-y-2 flex flex-col text-xs select-none">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-purple-400 w-4 text-center">1</span>
                  <span className="font-sans text-slate-200">NeonKnight</span>
                </div>
                <span className="font-code text-blue-400">9450 V</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-slate-400 w-4 text-center">2</span>
                  <span className="font-sans text-slate-200">CyberGhost</span>
                </div>
                <span className="font-code text-blue-400">9200 V</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-slate-400/70 w-4 text-center">3</span>
                  <span className="font-sans text-slate-200">Kryo_Master</span>
                </div>
                <span className="font-code text-blue-400">8910 V</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Matchmaking Core Actions */}
        <section className="col-span-1 lg:col-span-5 flex flex-col items-center justify-center p-2 relative h-full">
          {/* Status Online Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4 select-none">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="font-label-caps text-[10px] md:text-xs text-slate-200 uppercase tracking-widest leading-none">
              <span className="text-blue-400 font-bold">42,891</span> BLITZERS ONLINE
            </span>
          </div>

          {/* Primary Action Card */}
          <div className="glass-panel border-t-4 border-blue-500 p-6 md:p-10 w-full rounded-[32px] hover:shadow-[0_0_50px_rgba(59,130,246,0.2)] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300">
            {/* Cyber Grid element nested */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 to-transparent select-none pointer-events-none" />
            
            <h2 className="font-headline text-3xl md:text-4xl text-white font-extrabold italic tracking-tighter mb-8 text-center uppercase relative z-10 leading-none select-none">
              ENTER THE<br />
              <span className="text-blue-400 font-extrabold">ARENA</span>
            </h2>

            {/* Simulated Matchmaking Buttons */}
            {matchmakingState === 'IDLE' && (
              <button 
                onClick={toggleSearch}
                className="relative z-10 w-full max-w-xs py-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-headline text-base font-extrabold uppercase tracking-widest hover:brightness-110 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 border border-white/15 select-none cursor-pointer"
              >
                FIND MATCH
              </button>
            )}

            {matchmakingState === 'SEARCHING' && (
              <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  <span className="material-symbols-outlined text-blue-400 animate-pulse">sync</span>
                </div>
                <div className="text-center">
                  <span className="font-headline text-sm text-blue-300 italic tracking-wider block">SEARCHING QUEUE</span>
                  <span className="font-label-caps text-xs text-white block mt-1">
                    ELAPSED: 00:0{queueTimer}
                  </span>
                </div>
                <button 
                  onClick={toggleSearch}
                  className="mt-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-900/10 text-purple-300 font-label-caps text-[10px] tracking-wider uppercase hover:bg-purple-900/30 transition-all select-none cursor-pointer"
                >
                  CANCEL MATCH
                </button>
              </div>
            )}

            {matchmakingState === 'FOUND' && (
              <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-3 animate-bounce select-none">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(59,130,246,0.7)]">
                  <span className="material-symbols-outlined text-[#05070a] text-3xl font-bold">check_circle</span>
                </div>
                <div className="text-center">
                  <span className="font-headline text-sm text-blue-400 italic tracking-wider block">MATCH FOUND!</span>
                  <span className="font-label-caps text-purple-300 text-xs font-bold block mt-1">
                    DEPLOYING IN {countdown}...
                  </span>
                </div>
              </div>
            )}

            {/* Region Selector dropdown */}
            <div className="mt-8 flex items-center gap-2 text-slate-400 font-code-sm text-xs uppercase relative z-10 select-none">
              <span className="material-symbols-outlined text-[15px] text-blue-400 leading-none">globe</span>
              <span>REGION:</span>
              <div className="relative inline-flex items-center">
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="bg-transparent border-0 border-b-2 border-blue-500/30 text-white font-sans font-bold py-0.5 pb-1 focus:outline-none focus:border-blue-500 cursor-pointer pl-1 pr-6 hover:border-blue-400 transition-colors appearance-none text-xs"
                >
                  <option className="bg-[#05070a]" value="na">NORTH AMERICA</option>
                  <option className="bg-[#05070a]" value="eu">EUROPE CENTRAL</option>
                  <option className="bg-[#05070a]" value="ap">ASIA PACIFIC</option>
                </select>
                <span className="material-symbols-outlined text-[13px] absolute right-0 pointer-events-none text-blue-400">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Rotating Game Modes */}
        <section className="col-span-1 lg:col-span-4 flex flex-col w-full">
          <div className="flex justify-between items-end mb-3 select-none">
            <h3 className="font-label-caps text-xs text-blue-400 uppercase tracking-widest border-b border-blue-500/30 pb-0.5 select-none font-bold">
              ROTATING PLAYLISTS
            </h3>
            <div className="flex gap-1">
              <button 
                onClick={() => setActiveSlide(activeSlide === 0 ? 1 : 0)}
                className="w-6 h-6 rounded-full glass-panel flex items-center justify-center hover:bg-blue-500/10 transition-colors text-white select-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm leading-none">chevron_left</span>
              </button>
              <button 
                onClick={() => setActiveSlide(activeSlide === 1 ? 0 : 1)}
                className="w-6 h-6 rounded-full glass-panel flex items-center justify-center hover:bg-blue-500/10 transition-colors text-white select-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Mode Card 1: Gravity Race */}
            {activeSlide === 0 ? (
              <div 
                onClick={toggleSearch}
                className="glass-panel relative h-36 rounded-xl overflow-hidden group cursor-pointer border-t-2 border-purple-500 hover:border-purple-400 transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.08)] hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]"
              >
                <img 
                  alt="Gravity Race Mode" 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-105 group-hover:scale-100" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEC1TNdgb1uoy6uvqisr0bpiFPxeChT0l9jgQEie81ojxFEo98U1gRMy2LBAd_L9q751ZulqGV6qk0oKMvFcm2nb2rWd6V26pjUksyp72CVNDjuGCFcNmIo0H6I8o3OCtAr-NmxzgJiV0QvnWcBzrFKZ2ZW3HrErv-KImvLDYfrSr7gH6NgximPpWNEJK2SKBDOcROaDOufCIE1En4X79Re1zU46RbVjoEc89l7NHVV781ZiBsUM45ootba50B87swzHoNezV77QQ" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a]/90 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3 w-full">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="inline-block px-2 py-0.5 mb-1 rounded text-[9px] font-label-caps bg-purple-600 text-purple-100 font-bold tracking-wider">HOT</span>
                      <h4 className="font-headline text-sm text-white uppercase italic leading-none">Gravity Race</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">High velocity orbital dodge match</p>
                    </div>
                    <span className="material-symbols-outlined text-purple-400 text-xl opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 select-none">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Mode Card 2: Team Blast */
              <div 
                onClick={toggleSearch}
                className="glass-panel relative h-36 rounded-xl overflow-hidden group cursor-pointer border-t-2 border-blue-500 hover:border-blue-400 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.08)] hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]"
              >
                <img 
                  alt="Team Blast Mode" 
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-55 transition-opacity duration-500 scale-105 group-hover:scale-100" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFdk_lt8XYBgaU6_kAdGI7h3xzQgcwCQbpTsEMC8wXYcxUCUvJ_IHmw_gyNZRi0TEj9yP7zXslrBBE6SNQTr1uPm6x3qJjsjDapq6o1TMVXYA7Afg0ZYGJ0HksIc5Vt6FMvlKeW9CL21T9Chukrf2TaJf8Guri_74i5IsK7yPFfYiSS2komerVWK37pR-J0ZaavgrAGmcW18rPTe_S86qraibwZsTLDKU-De5wKiMHxmAsjAdPaBwgAUrVgFCGH3AToelVNN4rwr0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a]/90 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3 w-full">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="inline-block px-2 py-0.5 mb-1 rounded text-[9px] font-label-caps border border-blue-500/40 text-blue-400 uppercase font-bold tracking-wider">RANKED</span>
                      <h4 className="font-headline text-sm text-white uppercase italic leading-none">Team Blast</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Tactical coordination payload crash</p>
                    </div>
                    <span className="material-symbols-outlined text-blue-400 text-xl opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 select-none">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
