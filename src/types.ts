export type TabType = 'LOBBY' | 'ARMORY' | 'SQUAD' | 'VAULT';

export interface PlayerStats {
  volt: number;
  gems: number;
  name: string;
  rank: number;
  level: number;
  avatar: string;
  equippedSkinId: string;
  dailyProgress: number; // Win ranked matches progress (e.g. 1 out of 3)
  wins: number;
  totalKos: number;
  topSpeed: number;
  distance: number;
}

export interface Skin {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  thumbnail: string;
  characterImage: string;
  orbImage: string;
  owned: boolean;
  costVolt?: number;
  costGems?: number;
}

export interface ChatMessage {
  id: string;
  username: string;
  avatar: string;
  time: string;
  text: string;
  isMe: boolean;
}

export interface Friend {
  username: string;
  avatar: string;
  status: 'IN ARENA' | 'IN LOBBY' | 'OFFLINE';
  statusDetail?: string;
  online: boolean;
}

export interface VaultLevel {
  level: number;
  freeReward: {
    type: 'Volt' | 'Gems' | 'Gear' | 'Skin' | 'Core';
    name: string;
    amount?: number;
    icon?: string;
    img?: string;
  };
  eliteReward: {
    type: 'Volt' | 'Gems' | 'Gear' | 'Skin' | 'Core';
    name: string;
    amount?: number;
    icon?: string;
    img?: string;
  };
  milestone?: boolean;
}
