import React, { useState, useEffect, useRef } from 'react';
import { PlayerStats, ChatMessage, Friend } from '../types';
import { SQUAD_FRIENDS, INITIAL_CHAT_MESSAGES, LEADERBOARD_PODIUM, LEADERBOARD_LIST } from '../data';

interface SquadTabProps {
  playerStats: PlayerStats;
  onUpdateStats: (updates: Partial<PlayerStats>) => void;
}

export default function SquadTab({
  playerStats,
}: SquadTabProps) {
  const [activeSquare, setActiveSquare] = useState<'CHAT' | 'LEADERBOARD'>('CHAT');
  const [activeChatTab, setActiveChatTab] = useState<'GLOBAL' | 'SQUAD_LOG'>('GLOBAL');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [friendsList, setFriendsList] = useState<Friend[]>(SQUAD_FRIENDS);
  const [textInput, setTextInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat whenever messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleSendMessage = () => {
    if (!textInput.trim()) return;

    const myMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      username: 'You',
      avatar: playerStats.avatar,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textInput.trim(),
      isMe: true,
    };

    setChatMessages((prev) => [...prev, myMsg]);
    setTextInput('');

    // Trigger funny robot companion reply simulated esports chat!
    setTimeout(() => {
      const npcResponses = [
        "Heck yeah! Transmitting queue codes now, send me the lobby lock.",
        "gg! Setup complete, let's sweep the competitive ladders.",
        "Absolute fire! Crimson orb loadout is locked and loaded.",
        "Need a tank/shield support or high-speed blast drone?",
        "Ready! Let's get that daily dynamic multiplier bonus.",
      ];
      const randomResponse = npcResponses[Math.floor(Math.random() * npcResponses.length)];
      const npcNames = ['NovaFlare', 'Kryo_Gen', 'IronHide'];
      const chosenNpc = npcNames[Math.floor(Math.random() * npcNames.length)];
      const friendData = friendsList.find((f) => f.username === chosenNpc);

      const npcMsg: ChatMessage = {
        id: `msg-npc-${Date.now()}`,
        username: `@${chosenNpc}`,
        avatar: friendData?.avatar || playerStats.avatar,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: randomResponse,
        isMe: false,
      };

      setChatMessages((prev) => [...prev, npcMsg]);
    }, 1500);
  };

  const handleInviteFriend = (friendName: string) => {
    // Update state to simulate join
    setFriendsList((prev) => 
      prev.map((f) => f.username === friendName ? { ...f, status: 'IN LOBBY', statusDetail: 'SQUAD INSTANCE' } : f)
    );
    triggerToast(`TRANSMITTING INVITATION TO @${friendName}... JOINED!`);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full relative z-10 select-none pb-4">
      {/* Toast notifications */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#05070a]/95 backdrop-blur-md border border-blue-500/70 text-blue-300 text-xs font-label-caps tracking-wider py-2 px-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] animate-bounce select-none">
          {toastMessage}
        </div>
      )}

      {/* Roster / Leaderboard Top-Level Toggles */}
      <section className="flex gap-2 w-full mb-3 select-none">
        <button 
          onClick={() => { setActiveSquare('CHAT'); }}
          className={`flex-1 py-2 rounded-xl font-label-caps text-xs tracking-wider uppercase border ${
            activeSquare === 'CHAT' 
              ? 'bg-white/5 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] font-bold' 
              : 'bg-white/5 border-white/5 text-slate-400'
          } cursor-pointer transition-all`}
        >
          COMMS & ROSTER
        </button>
        <button 
          onClick={() => { setActiveSquare('LEADERBOARD'); }}
          className={`flex-1 py-2 rounded-xl font-label-caps text-xs tracking-wider uppercase border ${
            activeSquare === 'LEADERBOARD' 
              ? 'bg-white/5 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] font-bold' 
              : 'bg-white/5 border-white/5 text-slate-400'
          } cursor-pointer transition-all`}
        >
          HALL OF FAME
        </button>
      </section>

      {/* Main Grid View */}
      <div className="flex-1 w-full relative">
        {activeSquare === 'CHAT' ? (
          /* ================= COMMS & ROSTER VIEW ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full h-full min-h-[460px]">
            {/* Left Box: Chat comms and Daily Bonus */}
            <div className="lg:col-span-8 flex flex-col gap-3 min-h-[400px]">
              
              {/* Daily Squad Bonus banner */}
              <section className="glass-card rounded-xl p-3 border-t-2 border-purple-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 relative overflow-hidden group select-none">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/50 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                    <span className="material-symbols-outlined text-purple-400 text-lg select-none">redeem</span>
                  </div>
                  <div>
                    <h2 className="font-sans font-bold text-xs text-purple-300 uppercase select-none">DAILY SQUAD BONUS</h2>
                    <p className="font-sans text-[10px] text-slate-400 select-none">Play matches with friends to increase team multiplier multipliers.</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 w-full md:w-auto relative z-10 select-none text-right">
                  <div className="w-full md:w-28 h-1.5 bg-[#05070a] rounded-full overflow-hidden select-none">
                    <div className="h-full bg-blue-400 w-2/3 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  </div>
                  <span className="font-code text-[9px] text-blue-400">2/3 MATCHES</span>
                </div>
              </section>

              {/* Chat Container */}
              <div className="glass-panel p-3 flex-1 flex flex-col h-[320px]">
                {/* Chat tab titles */}
                <div className="flex gap-4 border-b border-[#3e3e5c]/20 pb-2 mb-2 select-none text-[11px] font-bold">
                  <button 
                    onClick={() => setActiveChatTab('GLOBAL')}
                    className={`font-sans tracking-wide cursor-pointer ${
                      activeChatTab === 'GLOBAL' ? 'text-blue-400 border-b-2 border-blue-500 pb-0.5' : 'text-slate-400'
                    }`}
                  >
                    GLOBAL COMMS
                  </button>
                  <button 
                    onClick={() => setActiveChatTab('SQUAD_LOG')}
                    className={`font-sans tracking-wide cursor-pointer ${
                      activeChatTab === 'SQUAD_LOG' ? 'text-blue-400 border-b-2 border-blue-500 pb-0.5' : 'text-slate-400'
                    }`}
                  >
                    SQUAD LOG
                  </button>
                </div>

                {/* Messages feed */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 h-36">
                  {chatMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex gap-2 items-start ${msg.isMe ? 'flex-row-reverse' : ''}`}
                    >
                      <img 
                        src={msg.avatar} 
                        alt="Avatar" 
                        className={`w-7 h-7 rounded-full object-cover border ${
                          msg.isMe ? 'border-blue-500/40' : 'border-white/10'
                        }`} 
                      />
                      <div className={`rounded-xl p-2.5 max-w-[80%] border flex flex-col ${
                        msg.isMe 
                          ? 'bg-blue-500/5 border-blue-500/30 rounded-tr-none text-right items-end' 
                          : 'bg-[#05070a]/45 border-white/5 rounded-tl-none text-left items-start'
                      }`}>
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] select-none text-slate-440">
                          <span className="font-label-caps font-bold">{msg.username}</span>
                          <span className="opacity-55">{msg.time}</span>
                        </div>
                        <p className="font-sans text-xs text-slate-200 leading-relaxed">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat send text input bar */}
                <div className="relative mt-2 pt-2 border-t border-white/5">
                  <label className="font-code text-[9px] text-blue-400 block mb-0.5 tracking-widest">TRANSMIT_DATA</label>
                  <div className="flex gap-2 items-end">
                    <input 
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                      maxLength={80}
                      className="bg-transparent border-0 border-b-2 border-blue-500 w-full font-sans text-xs text-white focus:ring-0 focus:border-blue-400 px-0 py-1.5 placeholder:text-slate-400/50 transition-colors"
                      placeholder="Type tactical message..."
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:brightness-110 shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95 duration-100 p-2 rounded-lg flex items-center justify-center font-label-caps text-xs shrink-0 cursor-pointer h-8 w-12"
                    >
                      <span className="material-symbols-outlined text-base font-bold">send</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Box: Online Squad friends */}
            <div className="lg:col-span-4 flex flex-col gap-3 h-full">
              <div className="glass-card rounded-xl p-3 flex flex-col h-full">
                <div className="px-2 border-b border-white/5 flex justify-between items-center pb-2 mb-2 select-none">
                  <h3 className="font-sans text-sm text-blue-400 font-bold uppercase select-none">ROSTER LINK</h3>
                  <span className="font-code text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400 select-none">
                    {friendsList.filter((f) => f.online).length} ONLINE
                  </span>
                </div>

                <div className="space-y-1 h-[320px] overflow-y-auto pr-1">
                  {friendsList.map((friend) => (
                    <div 
                      key={friend.username}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/5 transition-all group select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Avatar status indicator */}
                        <div className={`relative w-8 h-8 rounded-full overflow-hidden border ${
                          friend.online ? 'border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] active-ring' : 'border-white/10 grayscale opacity-60'
                        }`}>
                          <img src={friend.avatar} alt={friend.username} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-label-caps text-xs text-slate-300">@{friend.username}</span>
                          <span className={`font-code text-[8px] tracking-wide uppercase ${
                            friend.status === 'IN ARENA' ? 'text-purple-400' : friend.status === 'IN LOBBY' ? 'text-blue-400' : 'text-slate-400'
                          }`}>
                            {friend.status} {friend.statusDetail ? `• ${friend.statusDetail}` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Dynamic Invite Buttons */}
                      {friend.online && friend.status === 'IN LOBBY' && (
                        <button 
                          onClick={() => handleInviteFriend(friend.username)}
                          className="px-2.5 py-1 text-[9px] bg-purple-500/10 border border-purple-500/30 rounded text-purple-300 font-label-caps font-bold hover:bg-purple-500/20 transition-all select-none cursor-pointer"
                        >
                          INVITE
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= LEADERBOARD HALL OF FAME VIEW ================= */
          <div className="flex flex-col gap-3 min-h-[460px] max-h-[500px] overflow-y-auto pr-1 select-none">
            {/* Seasonal Info banner */}
            <div className="glass-card rounded-xl p-3 flex flex-col md:flex-row justify-between items-center gap-2.5 relative overflow-hidden select-none">
              <div className="absolute right-[-10px] top-[-10px] w-32 h-32 bg-purple-900/10 rounded-full blur-2xl pointer-events-none" />
              <div className="text-left">
                <h2 className="font-headline text-lg text-white font-extrabold tracking-wide uppercase leading-none">HALL OF FAME</h2>
                <p className="font-sans text-[10px] text-slate-400 mt-1 select-none">Season 4: Cyber Nexus - Global Blitzers</p>
              </div>
              <div className="bg-[#05070a]/90 border border-blue-500/30 rounded-lg py-1 px-3 flex flex-col items-center justify-center select-none text-center">
                <span className="font-code text-[9px] text-purple-300 select-none">Season Ends In</span>
                <span className="font-headline text-xs text-blue-400 font-extrabold select-none">14D 08H 42M</span>
              </div>
            </div>

            {/* Bento podium */}
            <div className="grid grid-cols-3 gap-3">
              {/* Podium 2 */}
              <div className="glass-card border-t border-slate-400 rounded-xl p-3 flex flex-col items-center text-center justify-center relative select-none transform translate-y-3">
                <span className="absolute top-2 left-2 text-sm font-headline text-slate-400">#2</span>
                <img src={LEADERBOARD_PODIUM[1].avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-400 mb-1 shadow-lg" />
                <h4 className="font-sans text-[11px] font-bold text-white truncate max-w-full select-none">{LEADERBOARD_PODIUM[1].name}</h4>
                <span className="font-code text-[9px] text-blue-400 select-none">{LEADERBOARD_PODIUM[1].score}</span>
              </div>

              {/* Champion 1 */}
              <div className="glass-card rounded-xl p-3 py-4 flex flex-col items-center text-center justify-center relative select-none shadow-[0_0_20px_rgba(59,130,246,0.15)] bg-[#05070a]/80 border-t-4 z-10 border-blue-500">
                <span className="absolute -top-2.5 bg-blue-500 text-[#05070a] font-label-caps text-[8px] px-2 py-0.5 rounded-full font-bold tracking-widest leading-none select-none shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  CHAMP
                </span>
                <span className="absolute top-1 left-2 text-base font-headline text-blue-400">#1</span>
                <img src={LEADERBOARD_PODIUM[0].avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-blue-400 mb-1.5 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                <h4 className="font-headline text-xs text-blue-400 font-extrabold truncate max-w-full select-none">{LEADERBOARD_PODIUM[0].name}</h4>
                <span className="font-code text-[9px] text-purple-300 font-bold select-none">{LEADERBOARD_PODIUM[0].score}</span>
              </div>

              {/* Podium 3 */}
              <div className="glass-card border-t border-purple-600 rounded-xl p-3 flex flex-col items-center text-center justify-center relative select-none transform translate-y-3">
                <span className="absolute top-2 left-2 text-sm font-headline text-purple-400">#3</span>
                <img src={LEADERBOARD_PODIUM[2].avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-purple-600 mb-1 shadow-lg" />
                <h4 className="font-sans text-[11px] font-bold text-white truncate max-w-full select-none">{LEADERBOARD_PODIUM[2].name}</h4>
                <span className="font-code text-[9px] text-blue-400 select-none">{LEADERBOARD_PODIUM[2].score}</span>
              </div>
            </div>

            {/* scrolling levels list */}
            <div className="space-y-1.5 mt-2">
              {LEADERBOARD_LIST.map((runner) => (
                <div 
                  key={runner.name}
                  className="glass-panel border-white/5 border px-3 py-2 flex items-center justify-between hover:bg-white/5 hover:border-white/10 transition-all select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-headline text-sm w-4 text-center text-slate-400">{runner.rank}</span>
                    <img src={runner.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-white/10" />
                    <span className="font-sans text-xs text-slate-200 font-semibold">{runner.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400 font-code text-xs select-none">
                    <span>{runner.score}</span>
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pinned Bottom Blitzer Personal Rank Card */}
            <div className="mt-3 p-3 bg-[#05070a]/95 border-t-2 border-blue-500 rounded-xl flex items-center justify-between shadow-[0_0_25px_rgba(59,130,246,0.12)] select-none">
              <div className="flex items-center gap-3 select-none">
                <div className="flex flex-col items-center justify-center w-10 h-10 bg-[#05070a] rounded-lg border border-blue-500/40 select-none">
                  <span className="font-code text-[8px] text-blue-300 leading-none mb-0.5 font-bold">RANK</span>
                  <span className="font-headline text-base text-blue-400 leading-none font-bold">42</span>
                </div>
                <img src={playerStats.avatar} alt="Me" className="w-8 h-8 rounded-full border border-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                <div className="text-left leading-tight">
                  <span className="font-sans text-xs text-white font-bold block select-none">You</span>
                  <span className="font-code text-[9px] text-slate-400 block select-none">Top 5% • Global Range</span>
                </div>
              </div>
              <div className="text-right leading-tight select-none">
                <div className="flex items-center gap-0.5 text-blue-400 font-sans justify-end font-bold select-none">
                  <span className="font-headline text-base">8,450</span>
                  <span className="material-symbols-outlined text-sm">bolt</span>
                </div>
                <span className="font-code text-[8px] text-slate-400 block mt-0.5 select-none">+120 V to rank up</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
