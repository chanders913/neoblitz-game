import React, { useState, useEffect, useRef } from 'react';
import { PlayerStats, Skin } from '../types';

interface BattleArenaGameProps {
  playerStats: PlayerStats;
  equippedSkin: Skin;
  onExitArena: (rewards?: { volt: number; gems: number }) => void;
}

// Sound Maker Synthesizer using Web Audio API
const playSound = (type: 'laser' | 'explosion' | 'powerup' | 'hit' | 'victory' | 'dash' | 'shield') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'laser') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'explosion') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(15, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'hit') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'powerup') {
      // Ascending arpeggio sound
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.connect(g2);
      g2.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(500, ctx.currentTime + 0.1);
      o2.type = 'sine';
      o2.frequency.setValueAtTime(700, ctx.currentTime + 0.1);
      o2.frequency.setValueAtTime(1000, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      g2.gain.setValueAtTime(0.06, ctx.currentTime);
      g2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      o2.start();
      o2.stop(ctx.currentTime + 0.3);
    } else if (type === 'dash') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'shield') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'victory') {
      // Triumph fan-fare arpeggio
      const playTone = (freq: number, delayBegin: number, length: number) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, ctx.currentTime + delayBegin);
        g.gain.setValueAtTime(0.05, ctx.currentTime + delayBegin);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + delayBegin + length);
        o.start(ctx.currentTime + delayBegin);
        o.stop(ctx.currentTime + delayBegin + length);
      };
      playTone(440.00, 0, 0.1);     // A4
      playTone(554.37, 0.1, 0.1);   // C#5
      playTone(659.25, 0.2, 0.1);   // E5
      playTone(880.00, 0.3, 0.3);   // A5
    }
  } catch (err) {
    // Sound synthesis blocked or unsupported, fail silently
  }
};

interface Enemy {
  id: string;
  type: 'drone' | 'seeker' | 'heavy' | 'boss';
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  shootTimer: number;
  angle?: number;
  size: number;
}

interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'player' | 'enemy';
  size: number;
  damage: number;
}

interface Powerup {
  id: string;
  type: 'double' | 'triple' | 'shield' | 'rapid' | 'heal' | 'bolt';
  x: number;
  y: number;
  vy: number;
  size: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  decay: number;
}

export default function BattleArenaGame({
  playerStats,
  equippedSkin,
  onExitArena,
}: BattleArenaGameProps) {
  // UI Display state synchronizers (Only updated dynamically to bypass re-render frame loss)
  const [playerHp, setPlayerHp] = useState(100);
  const [playerMaxHp] = useState(100);
  const [playerEnergy, setPlayerEnergy] = useState(100);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [gameWave, setGameWave] = useState(1);
  const [bossHpProgress, setBossHpProgress] = useState<number | null>(null);
  
  // Wave state banners
  const [bannerText, setBannerText] = useState<string | null>('WAVE 1 START!');
  
  // Game abilities status
  const [shieldCooldown, setShieldCooldown] = useState(0);
  const [dashCooldown, setDashCooldown] = useState(0);
  const [autoFireActive, setAutoFireActive] = useState(true);

  // Active status items
  const [activeWeapon, setActiveWeapon] = useState<'NORMAL' | 'DOUBLE_SHOT' | 'TRIPLE_BEAM'>('NORMAL');
  const [isRapidFire, setIsRapidFire] = useState(false);
  const [shieldActiveState, setShieldActiveState] = useState(false);

  // Game End Outcomes
  const [isGameOver, setIsGameOver] = useState(false);
  const [outcome, setOutcome] = useState<'VICTORY' | 'DEFEAT' | null>(null);
  const [deathStats, setDeathStats] = useState({
    levelReached: 1,
    score: 0,
    eliminations: 0,
    vaultXpGained: 10,
    voltsGained: 50,
  });

  // Principal Canvas references
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Game loops physical variables tracked with high refresh rate Refs to achieve pristine 60FPS
  const engineRef = useRef({
    playerHp: 100,
    playerEnergy: 100,
    playerPos: { x: 150, y: 350 },
    isDashing: false,
    dashTargetTimer: 0,
    dashVector: { x: 0, y: 0 },
    shieldActive: false,
    shieldTimer: 0,
    score: 0,
    eliminations: 0,
    level: 1,
    wave: 1,
    enemies: [] as Enemy[],
    projectiles: [] as Projectile[],
    powerups: [] as Powerup[],
    particles: [] as Particle[],
    screenShake: 0,
    
    // Weapon stats limits
    weaponUpgrade: 'NORMAL' as 'NORMAL' | 'DOUBLE_SHOT' | 'TRIPLE_BEAM',
    weaponUpgradeTimer: 0,
    rapidFireTimer: 0,
    lastShootTime: 0,
    shootCooldown: 300, // ms duration between rapid lasers
    
    // Stars particles for visual vertical warp scrolling effect
    scrollStars: [] as Array<{ x: number; y: number; speed: number; size: number }>,
  });

  // Keep Keyboard pressed track values
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Virtual touch indicators
  const joystickRef = useRef<HTMLDivElement>(null);
  const [isDraggingJoystick, setIsDraggingJoystick] = useState(false);
  const [joystickDelta, setJoystickDelta] = useState({ x: 0, y: 0 });

  // 1. Level Wave progression compiler spawner
  const spawnWave = (lvl: number, wv: number) => {
    playSound('victory');
    const engine = engineRef.current;
    engine.enemies = []; // wipe remaining
    
    const banner = wv === 3 ? `LEVEL ${lvl} - WAVE ${wv}: ALERT BOSS SENTINEL!` : `LEVEL ${lvl} - WAVE ${wv}`;
    setBannerText(banner);
    setTimeout(() => setBannerText(null), 2500);

    // Dynamic procedural spawning logic
    if (wv === 1) {
      // Spawn standard tactical glide drones
      const droneCount = 3 + lvl;
      for (let i = 0; i < droneCount; i++) {
        engine.enemies.push({
          id: `enemy-dr-${i}-${Date.now()}`,
          type: 'drone',
          x: 40 + i * (220 / (droneCount - 1 || 1)),
          y: 40 + (i % 2) * 20,
          vx: 1.2 + lvl * 0.2,
          vy: 0,
          hp: 20 + lvl * 10,
          maxHp: 20 + lvl * 10,
          shootTimer: 80 + Math.random() * 100,
          size: 13,
        });
      }
    } else if (wv === 2) {
      // Spawn horizontal shooting mechs plus charging kamikaze Seekers!
      const droneCount = 2 + lvl;
      for (let i = 0; i < droneCount; i++) {
        engine.enemies.push({
          id: `enemy-dr-${i}-${Date.now()}`,
          type: 'drone',
          x: 50 + i * 50,
          y: 50,
          vx: -(1 + lvl * 0.2),
          vy: 0,
          hp: 25 + lvl * 10,
          maxHp: 25 + lvl * 10,
          shootTimer: 60 + Math.random() * 120,
          size: 12,
        });
      }

      // Add Seekers targeting the player!
      const seekerCount = 2 + lvl;
      for (let i = 0; i < seekerCount; i++) {
        engine.enemies.push({
          id: `enemy-sk-${i}-${Date.now()}`,
          type: 'seeker',
          x: Math.random() * 240 + 30,
          y: -20 - i * 35,
          vx: 0,
          vy: 1.8 + lvl * 0.35,
          hp: 12 + lvl * 6,
          maxHp: 12 + lvl * 6,
          shootTimer: 99999, // seek crashes on collision, doesnt shoot
          size: 10,
        });
      }
    } else if (wv === 3) {
      // Boss level Battle! Spawn ultimate defense core sentinels
      engine.enemies.push({
        id: `enemy-boss-${Date.now()}`,
        type: 'boss',
        x: 150,
        y: 80,
        vx: 1.4 + lvl * 0.2,
        vy: 0,
        hp: 120 + lvl * 80,
        maxHp: 120 + lvl * 80,
        shootTimer: 40,
        angle: 0,
        size: 26,
      });

      // Spawn supporting heavy units
      engine.enemies.push({
        id: `enemy-hv-${Date.now()}`,
        type: 'heavy',
        x: 80,
        y: 120,
        vx: 0,
        vy: 0,
        hp: 40 + lvl * 15,
        maxHp: 40 + lvl * 15,
        shootTimer: 100,
        size: 18,
      });
      engine.enemies.push({
        id: `enemy-hv-r-${Date.now()}`,
        type: 'heavy',
        x: 220,
        y: 120,
        vx: 0,
        vy: 0,
        hp: 40 + lvl * 15,
        maxHp: 40 + lvl * 15,
        shootTimer: 150,
        size: 18,
      });
    }
  };

  // Setup initial key handlers and background stars
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Initial stars generator for space travel warp simulation
    const stars = [];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random() * 300,
        y: Math.random() * 420,
        speed: 1 + Math.random() * 3,
        size: 1 + Math.random() * 1.5,
      });
    }
    engineRef.current.scrollStars = stars;

    // Start wave 1
    spawnWave(1, 1);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Cooldown counter running on a slow 1-second interval
  useEffect(() => {
    const timer = setInterval(() => {
      setShieldCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      setDashCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fire laser function (player projectiles)
  const firePlayerLaser = () => {
    const engine = engineRef.current;
    if (isGameOver || engine.playerHp <= 0) return;

    const bulletSpeed = -6;
    const bulletDamage = 10;
    playSound('laser');

    // Handle different weapon upgrade modes
    if (engine.weaponUpgrade === 'NORMAL') {
      engine.projectiles.push({
        id: `proj-p-${Date.now()}-${Math.random()}`,
        x: engine.playerPos.x,
        y: engine.playerPos.y - 12,
        vx: 0,
        vy: bulletSpeed,
        type: 'player',
        size: 3.5,
        damage: bulletDamage,
      });
    } else if (engine.weaponUpgrade === 'DOUBLE_SHOT') {
      engine.projectiles.push({
        id: `proj-p1-${Date.now()}-${Math.random()}`,
        x: engine.playerPos.x - 7,
        y: engine.playerPos.y - 10,
        vx: -0.6,
        vy: bulletSpeed,
        type: 'player',
        size: 3.5,
        damage: bulletDamage,
      });
      engine.projectiles.push({
        id: `proj-p2-${Date.now()}-${Math.random()}`,
        x: engine.playerPos.x + 7,
        y: engine.playerPos.y - 10,
        vx: 0.6,
        vy: bulletSpeed,
        type: 'player',
        size: 3.5,
        damage: bulletDamage,
      });
    } else if (engine.weaponUpgrade === 'TRIPLE_BEAM') {
      engine.projectiles.push({
        id: `proj-p1-${Date.now()}-${Math.random()}`,
        x: engine.playerPos.x,
        y: engine.playerPos.y - 12,
        vx: 0,
        vy: bulletSpeed,
        type: 'player',
        size: 4,
        damage: bulletDamage + 2,
      });
      engine.projectiles.push({
        id: `proj-p2-${Date.now()}-${Math.random()}`,
        x: engine.playerPos.x - 10,
        y: engine.playerPos.y - 8,
        vx: -1.6,
        vy: bulletSpeed + 0.5,
        type: 'player',
        size: 3.5,
        damage: bulletDamage,
      });
      engine.projectiles.push({
        id: `proj-p3-${Date.now()}-${Math.random()}`,
        x: engine.playerPos.x + 10,
        y: engine.playerPos.y - 8,
        vx: 1.6,
        vy: bulletSpeed + 0.5,
        type: 'player',
        size: 3.5,
        damage: bulletDamage,
      });
    }

    // Slightly deplete dynamic energy on manual triggers, auto-regen takes care of it
    engine.playerEnergy = Math.max(0, engine.playerEnergy - 1.5);
    setPlayerEnergy(Math.floor(engine.playerEnergy));
  };

  const handleManualShoot = () => {
    firePlayerLaser();
  };

  const handleTriggerDash = () => {
    if (dashCooldown > 0 || isGameOver) return;
    const engine = engineRef.current;
    
    // Calculate movement vector derived from WASD or Joystick values
    let dx = 0;
    let dy = 0;
    if (keysPressed.current['w'] || keysPressed.current['arrowup']) dy = -1;
    if (keysPressed.current['s'] || keysPressed.current['arrowdown']) dy = 1;
    if (keysPressed.current['a'] || keysPressed.current['arrowleft']) dx = -1;
    if (keysPressed.current['d'] || keysPressed.current['arrowright']) dx = 1;

    if (joystickDelta.x !== 0 || joystickDelta.y !== 0) {
      dx = joystickDelta.x;
      dy = joystickDelta.y;
    }

    // Default dash vector if static is directly forward
    if (dx === 0 && dy === 0) dy = -1;

    const angle = Math.atan2(dy, dx);
    engine.isDashing = true;
    engine.dashTargetTimer = 12; // Dash cycles count duration
    engine.dashVector = {
      x: Math.cos(angle) * 7.5,
      y: Math.sin(angle) * 7.5,
    };

    setDashCooldown(4);
    playSound('dash');

    // Trigger shield blast during dash
    engine.screenShake = 6;
  };

  const handleTriggerShield = () => {
    if (shieldCooldown > 0 || isGameOver) return;
    const engine = engineRef.current;
    engine.shieldActive = true;
    engine.shieldTimer = 140; // Approx 2.3 seconds
    setShieldActiveState(true);
    setShieldCooldown(6);
    playSound('shield');
  };

  // Main high speed physics animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 420;

    let animFrame: number;
    const engine = engineRef.current;

    const runPhysicsLoop = () => {
      if (isGameOver) return;

      // Ensure player state is valid
      if (engine.playerHp <= 0) {
        setIsGameOver(true);
        setOutcome('DEFEAT');
        playSound('hit');
        // Compile earned loot reward calculation
        const voltsWon = Math.floor(engine.score / 6) + 50;
        const xpWon = Math.floor(engine.eliminations * 3) + 10;
        setDeathStats({
          levelReached: engine.level,
          score: engine.score,
          eliminations: engine.eliminations,
          voltsGained: voltsWon,
          vaultXpGained: xpWon,
        });
        return;
      }

      // 1. Screenshake diminish factor decrement
      if (engine.screenShake > 0) {
        engine.screenShake *= 0.88;
        if (engine.screenShake < 0.2) engine.screenShake = 0;
      }

      // 2. Stars vertical scroll loop background
      engine.scrollStars.forEach((star) => {
        star.y += star.speed;
        if (star.y > 420) {
          star.y = 0;
          star.x = Math.random() * 300;
        }
      });

      // 3. Player displacement processing
      let dx = 0;
      let dy = 0;
      let moveSpeed = 2.4;

      if (keysPressed.current['w'] || keysPressed.current['arrowup']) dy -= moveSpeed;
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) dy += moveSpeed;
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) dx -= moveSpeed;
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) dx += moveSpeed;

      // Joystick inputs overrides
      if (joystickDelta.x !== 0 || joystickDelta.y !== 0) {
        dx = (joystickDelta.x / 40) * moveSpeed;
        dy = (joystickDelta.y / 40) * moveSpeed;
      }

      if (engine.isDashing) {
        engine.playerPos.x += engine.dashVector.x;
        engine.playerPos.y += engine.dashVector.y;
        engine.dashTargetTimer--;
        if (engine.dashTargetTimer <= 0) {
          engine.isDashing = false;
        }
      } else {
        engine.playerPos.x += dx;
        engine.playerPos.y += dy;
      }

      // Arena borders restriction check
      engine.playerPos.x = Math.max(14, Math.min(286, engine.playerPos.x));
      engine.playerPos.y = Math.max(160, Math.min(406, engine.playerPos.y));

      // 4. Update core shield bubble durations
      if (engine.shieldActive) {
        engine.shieldTimer--;
        if (engine.shieldTimer <= 0) {
          engine.shieldActive = false;
          setShieldActiveState(false);
        }
      }

      // 5. Upgrade timers degradation ticks
      if (engine.weaponUpgradeTimer > 0) {
        engine.weaponUpgradeTimer--;
        if (engine.weaponUpgradeTimer <= 0) {
          engine.weaponUpgrade = 'NORMAL';
          setActiveWeapon('NORMAL');
        }
      }

      if (engine.rapidFireTimer > 0) {
        engine.rapidFireTimer--;
        if (engine.rapidFireTimer <= 0) {
          setIsRapidFire(false);
          engine.shootCooldown = 300;
        }
      }

      // 6. Rapid/Auto fire mechanics loops
      if (autoFireActive) {
        const now = Date.now();
        if (now - engine.lastShootTime >= engine.shootCooldown) {
          firePlayerLaser();
          engine.lastShootTime = now;
        }
      }

      // Slowly auto-regenerate dynamic laser charges
      engine.playerEnergy = Math.min(100, engine.playerEnergy + 0.15);
      setPlayerEnergy(Math.floor(engine.playerEnergy));

      // 7. Enemy Movements AI processing
      let bossFound: Enemy | null = null;
      engine.enemies.forEach((enemy) => {
        if (enemy.type === 'boss') {
          bossFound = enemy;
          // Boss horizontal hover patterns plus sine waves
          enemy.x += enemy.vx;
          if (enemy.x > 260 || enemy.x < 40) {
            enemy.vx = -enemy.vx;
          }
          enemy.y = 70 + Math.sin(Date.now() / 600) * 15;

          // Advanced Boss weapon system fires targeted spread bullets!
          enemy.shootTimer--;
          if (enemy.shootTimer <= 0) {
            enemy.shootTimer = 45 - engine.level * 3; // fires faster with higher levels
            playSound('hit');

            const nowAngle = enemy.angle || 0;
            // Mode 1: Spiral sprays spiral bullets
            for (let i = 0; i < 4; i++) {
              const bAngle = nowAngle + (i * Math.PI) / 2;
              engine.projectiles.push({
                id: `proj-e-${Date.now()}-${Math.random()}`,
                x: enemy.x,
                y: enemy.y + 10,
                vx: Math.cos(bAngle) * 1.8,
                vy: Math.sin(bAngle) * 1.8 + 0.8,
                type: 'enemy',
                size: 4.5,
                damage: 8,
              });
            }
            enemy.angle = nowAngle + 0.25;
          }
        } else if (enemy.type === 'drone') {
          // Standard horizontal wave gliding
          enemy.x += enemy.vx;
          if (enemy.x < 20 || enemy.x > 280) {
            enemy.vx = -enemy.vx;
            // slide down slightly
            enemy.y = Math.min(enemy.y + 8, 150);
          }

          enemy.shootTimer--;
          if (enemy.shootTimer <= 0) {
            enemy.shootTimer = 110 + Math.random() * 100;
            // Shoot straight laser downwards
            engine.projectiles.push({
              id: `proj-e-${Date.now()}-${Math.random()}`,
              x: enemy.x,
              y: enemy.y + 6,
              vx: 0,
              vy: 2.2 + engine.level * 0.2,
              type: 'enemy',
              size: 4,
              damage: 7,
            });
          }
        } else if (enemy.type === 'seeker') {
          // Rapid kamikaze seeker tracks player horizontally and glides straight down fast
          const targetX = engine.playerPos.x;
          // Smoothly drift towards player horizontal
          const dx = targetX - enemy.x;
          enemy.x += Math.sign(dx) * 0.9;
          enemy.y += enemy.vy;

          // Seeker manual collision with player checked during movement
          const dist = Math.hypot(enemy.x - engine.playerPos.x, enemy.y - engine.playerPos.y);
          if (dist < enemy.size + 10) {
            // Explode on landing!
            enemy.hp = 0; // mark dead
            playSound('explosion');
            engine.screenShake = 12;

            if (engine.shieldActive) {
              engine.score += 50 * engine.level;
              setCurrentScore(engine.score);
            } else {
              engine.playerHp = Math.max(0, engine.playerHp - 18);
              setPlayerHp(engine.playerHp);
            }

            // Spawn explosive residue particles
            for (let p = 0; p < 12; p++) {
              engine.particles.push({
                x: enemy.x,
                y: enemy.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: '#ffb4ab',
                alpha: 1,
                size: 2 + Math.random() * 2,
                decay: 0.02 + Math.random() * 0.02,
              });
            }
          }
        } else if (enemy.type === 'heavy') {
          // Large static batteries shooting Star bursts
          enemy.shootTimer--;
          if (enemy.shootTimer <= 0) {
            enemy.shootTimer = 140 - engine.level * 10;
            playSound('hit');
            // Circular Star blast pattern
            const bulletCount = 6;
            for (let i = 0; i < bulletCount; i++) {
              const angle = (i * Math.PI * 2) / bulletCount;
              engine.projectiles.push({
                id: `proj-e-${Date.now()}-${Math.random()}`,
                x: enemy.x,
                y: enemy.y,
                vx: Math.cos(angle) * 1.5,
                vy: Math.sin(angle) * 1.5,
                type: 'enemy',
                size: 5,
                damage: 10,
              });
            }
          }
        }
      });

      // Filter out Seekers or general dead units that completed kamikaze runs
      engine.enemies = engine.enemies.filter((e) => e.hp > 0 && e.y < 430);

      // Handle Boss HP bar HUD update
      if (bossFound) {
        const b: Enemy = bossFound;
        setBossHpProgress(Math.max(0, b.hp / b.maxHp) * 100);
      } else {
        setBossHpProgress(null);
      }

      // Check wave completion transition checks
      if (engine.enemies.length === 0) {
        if (engine.wave < 3) {
          engine.wave++;
          setGameWave(engine.wave);
          spawnWave(engine.level, engine.wave);
        } else {
          // Level complete! Max level cap or advance level progression
          engine.level++;
          engine.wave = 1;
          setGameLevel(engine.level);
          setGameWave(engine.wave);
          
          // Clear remaining bullet spam on screen clearance
          engine.projectiles = [];
          
          // Spawn extra volt gems as level reward
          engine.score += 500 * (engine.level - 1);
          setCurrentScore(engine.score);
          
          spawnWave(engine.level, engine.wave);
        }
      }

      // 8. Update and check active physical projectiles
      engine.projectiles.forEach((p, pIdx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.type === 'player') {
          // Checks collisions against all enemies
          engine.enemies.forEach((enemy) => {
            const dist = Math.hypot(p.x - enemy.x, p.y - enemy.y);
            if (dist < enemy.size + 4) {
              enemy.hp -= p.damage;
              engine.projectiles.splice(pIdx, 1);
              playSound('hit');

              // Hit spark particles
              for (let i = 0; i < 4; i++) {
                engine.particles.push({
                  x: p.x,
                  y: p.y,
                  vx: (Math.random() - 0.5) * 3,
                  vy: -1 - Math.random() * 2,
                  color: equippedSkin.id === 'crimson-void' ? '#ff24e4' : '#74f5ff',
                  alpha: 0.9,
                  size: 1.5 + Math.random() * 1.5,
                  decay: 0.05,
                });
              }

              // Check if enemy core exploded
              if (enemy.hp <= 0) {
                engine.eliminations++;
                playSound('explosion');
                
                // Add Score points
                const pts = enemy.type === 'boss' ? 1000 : enemy.type === 'heavy' ? 250 : 100;
                engine.score += pts * engine.level;
                setCurrentScore(engine.score);

                // Spawn big beautiful glowing neon explosive particles burst!
                const density = enemy.type === 'boss' ? 45 : enemy.type === 'heavy' ? 25 : 12;
                const pColor = enemy.type === 'boss' ? '#ffd700' : enemy.type === 'heavy' ? '#38bdf8' : '#a78bfa';
                for (let k = 0; k < density; k++) {
                  engine.particles.push({
                    x: enemy.x,
                    y: enemy.y,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,
                    color: pColor,
                    alpha: 1,
                    size: 2 + Math.random() * 3.5,
                    decay: 0.02,
                  });
                }

                // Chance to drop interactive tactical core UPGRADE module loot drift item!
                if (Math.random() < 0.45 || enemy.type === 'boss') {
                  const items: Array<Powerup['type']> = ['double', 'triple', 'shield', 'rapid', 'heal', 'bolt'];
                  const pickedType = items[Math.floor(Math.random() * items.length)];
                  engine.powerups.push({
                    id: `pw-${Date.now()}-${Math.random()}`,
                    type: pickedType,
                    x: enemy.x,
                    y: enemy.y,
                    vy: 1.1,
                    size: 9,
                  });
                }
              }
            }
          });
        } else if (p.type === 'enemy') {
          // Collision against player
          const dist = Math.hypot(p.x - engine.playerPos.x, p.y - engine.playerPos.y);
          if (dist < p.size + 8) {
            engine.projectiles.splice(pIdx, 1);
            playSound('hit');

            if (engine.shieldActive) {
              // Absorbed by Shield, gain dynamic energy recharge
              engine.playerEnergy = Math.min(100, engine.playerEnergy + 10);
              setPlayerEnergy(Math.floor(engine.playerEnergy));
              
              // Shield bubble sparkles sparkles
              for (let i = 0; i < 6; i++) {
                engine.particles.push({
                  x: p.x,
                  y: p.y,
                  vx: (Math.random() - 0.5) * 2,
                  vy: (Math.random() - 0.5) * 2,
                  color: '#38bdf8',
                  alpha: 0.8,
                  size: 1.5,
                  decay: 0.04,
                });
              }
            } else {
              // Deduct genuine player HP, shake screen!
              engine.playerHp = Math.max(0, engine.playerHp - p.damage);
              setPlayerHp(engine.playerHp);
              engine.screenShake = 9;

              // Blood sparks explosion
              for (let i = 0; i < 8; i++) {
                engine.particles.push({
                  x: engine.playerPos.x + (Math.random() - 0.5) * 10,
                  y: engine.playerPos.y + (Math.random() - 0.5) * 10,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  color: '#ef4444',
                  alpha: 1,
                  size: 2,
                  decay: 0.04,
                });
              }
            }
          }
        }
      });

      // Filter outbound off-stage bullets
      engine.projectiles = engine.projectiles.filter((p) => p.y > 0 && p.y < 420 && p.x > 0 && p.x < 300);

      // 9. Process drift powerup collision triggers
      engine.powerups.forEach((pw, pwIdx) => {
        pw.y += pw.vy;

        const dist = Math.hypot(pw.x - engine.playerPos.x, pw.y - engine.playerPos.y);
        if (dist < pw.size + 12) {
          // Trigger item upgrade pickup!
          engine.powerups.splice(pwIdx, 1);
          playSound('powerup');

          // Glow burst pickup sparkles
          for (let s = 0; s < 10; s++) {
            engine.particles.push({
              x: pw.x,
              y: pw.y,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              color: '#10b981',
              alpha: 0.9,
              size: 2,
              decay: 0.03,
            });
          }

          if (pw.type === 'double') {
            engine.weaponUpgrade = 'DOUBLE_SHOT';
            engine.weaponUpgradeTimer = 500; // Approx 8 seconds duration
            setActiveWeapon('DOUBLE_SHOT');
          } else if (pw.type === 'triple') {
            engine.weaponUpgrade = 'TRIPLE_BEAM';
            engine.weaponUpgradeTimer = 500;
            setActiveWeapon('TRIPLE_BEAM');
          } else if (pw.type === 'shield') {
            // Refuel bubble shield right away
            engine.shieldActive = true;
            engine.shieldTimer = 300; // 5 seconds mega protection
            setShieldActiveState(true);
          } else if (pw.type === 'rapid') {
            engine.rapidFireTimer = 450;
            engine.shootCooldown = 110; // Rapid rate fire speeds!
            setIsRapidFire(true);
          } else if (pw.type === 'heal') {
            engine.playerHp = Math.min(100, engine.playerHp + 30);
            setPlayerHp(engine.playerHp);
          } else if (pw.type === 'volt') {
            engine.score += 400;
            setCurrentScore(engine.score);
          }
        }
      });

      // Clean off-stage drops
      engine.powerups = engine.powerups.filter((pw) => pw.y < 420);

      // 10. Decay active visual explosive sparkles
      engine.particles.forEach((part, pIdx) => {
        part.x += part.vx;
        part.y += part.vy;
        part.alpha -= part.decay;
        if (part.alpha <= 0) {
          engine.particles.splice(pIdx, 1);
        }
      });

      // ================== CANVAS DRAW STYLES ==================
      ctx.save();
      // Apply screen shake translates
      if (engine.screenShake > 0) {
        const sx = (Math.random() - 0.5) * engine.screenShake;
        const sy = (Math.random() - 0.5) * engine.screenShake;
        ctx.translate(sx, sy);
      }

      ctx.clearRect(0, 0, 300, 420);

      // Parallax cosmic travels starfield render background
      ctx.fillStyle = '#ffffff';
      engine.scrollStars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + star.speed * 0.2})`;
        ctx.fill();
      });

      // Draw interactive grid lines
      ctx.strokeStyle = '#3b82f612';
      ctx.lineWidth = 1;
      for (let x = 0; x < 300; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 420);
        ctx.stroke();
      }
      for (let y = 0; y < 420; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(300, y);
        ctx.stroke();
      }

      // Render Enemies targets
      engine.enemies.forEach((enemy) => {
        ctx.save();
        if (enemy.type === 'boss') {
          // Drawing boss ship core
          const pulse = Math.sin(Date.now() / 150) * 4;
          ctx.shadowBlur = 18 + pulse;
          ctx.shadowColor = '#ec4899';
          
          // Outer rotating ring shields
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.size + 4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(236, 72, 153, ${0.3 + pulse * 0.05})`;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Main heavy reactor core dome
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 4;
          ctx.fill();
          ctx.stroke();

          // Inside glowing core
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.size - 8, 0, Math.PI * 2);
          ctx.fillStyle = '#fda4af';
          ctx.fill();

          // Draw health mini overhead bar
          ctx.restore();
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(enemy.x - 22, enemy.y - 38, 44, 4);
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(enemy.x - 22, enemy.y - 38, (enemy.hp / enemy.maxHp) * 44, 4);
        } else if (enemy.type === 'heavy') {
          // Large heavy gunner cores
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#0284c7';
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
          ctx.fillStyle = '#0c4a6e';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.fill();
          ctx.stroke();

          // Center design
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#bae6fd';
          ctx.fill();
          ctx.restore();
        } else if (enemy.type === 'seeker') {
          // Fast red spike targets chasing you
          ctx.save();
          ctx.translate(enemy.x, enemy.y);
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ef4444';
          
          // Draw aggressive triangle structure pointing downwards
          ctx.beginPath();
          ctx.moveTo(0, enemy.size);
          ctx.lineTo(-enemy.size, -enemy.size);
          ctx.lineTo(enemy.size, -enemy.size);
          ctx.closePath();
          ctx.fillStyle = '#7f1d1d';
          ctx.strokeStyle = '#f87171';
          ctx.lineWidth = 1.8;
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        } else {
          // Basic tactical glider drones
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#8b5cf6';
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
          ctx.fillStyle = '#3b0764';
          ctx.strokeStyle = '#a78bfa';
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.stroke();

          // Reactor spark inside
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#ddd6fe';
          ctx.fill();
          ctx.restore();
        }
      });

      // Render tactile upgrade drifting crates drops
      engine.powerups.forEach((pw) => {
        ctx.save();
        ctx.translate(pw.x, pw.y);
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#10b981';

        // Draw glowing hexagonal powerup container
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * pw.size;
          const y = Math.sin(angle) * pw.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = '#064e3b';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Overlay text code indicator initials inside
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px "JetBrains Mono",monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let glyph = '⚡';
        if (pw.type === 'double') glyph = 'W2';
        else if (pw.type === 'triple') glyph = 'W3';
        else if (pw.type === 'shield') glyph = '🛡️';
        else if (pw.type === 'rapid') glyph = '🔥';
        else if (pw.type === 'heal') glyph = '❤️';
        else if (pw.type === 'volt') glyph = '⚡';
        ctx.fillText(glyph, 0, 0);
        ctx.restore();
      });

      // Render firing lasers bullets projectiles on screen stage
      engine.projectiles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (p.type === 'player') {
          ctx.fillStyle = equippedSkin.id === 'crimson-void' ? '#ec4899' : '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.shadowColor = ctx.fillStyle;
        } else {
          ctx.fillStyle = '#f87171';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ef4444';
        }
        ctx.fill();
        ctx.restore();
      });

      // Draw particle explosion bits sparks
      engine.particles.forEach((part) => {
        ctx.save();
        ctx.globalAlpha = part.alpha;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
        ctx.fillStyle = part.color;
        ctx.fill();
        ctx.restore();
      });

      // Render Player pilot core orb
      ctx.save();
      // Draw gentle trailing motion ghost outlines when dashing
      if (engine.isDashing) {
        ctx.beginPath();
        ctx.arc(engine.playerPos.x - engine.dashVector.x * 1.5, engine.playerPos.y - engine.dashVector.y * 1.5, 9, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(engine.playerPos.x, engine.playerPos.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fill();

      // Main inner ship capsule representation
      ctx.beginPath();
      ctx.arc(engine.playerPos.x, engine.playerPos.y, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = equippedSkin.id === 'crimson-void' ? '#ec4899' : '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.shadowColor = ctx.fillStyle;
      ctx.fill();

      // Core exhaust fire sparks animations
      if (dx !== 0 || dy !== 0 || Date.now() % 4 === 0) {
        ctx.beginPath();
        ctx.arc(engine.playerPos.x, engine.playerPos.y + 11, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
      }

      ctx.restore();

      // Overlay Bubble defensive barrier shield if active state triggers
      if (engine.shieldActive) {
        ctx.save();
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#10b981';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(engine.playerPos.x, engine.playerPos.y, 20, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(52, 211, 153, 0.08)';
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();

      animFrame = requestAnimationFrame(runPhysicsLoop);
    };

    animFrame = requestAnimationFrame(runPhysicsLoop);
    return () => cancelAnimationFrame(animFrame);
  }, [joystickDelta, autoFireActive, isGameOver, equippedSkin]);

  // Handle virtual drag directions controllers
  const handleJoystickStart = () => {
    setIsDraggingJoystick(true);
  };

  const handleJoystickMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingJoystick) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const pad = joystickRef.current;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    const maxRadius = 40;
    if (dist > maxRadius) {
      setJoystickDelta({
        x: (dx / dist) * maxRadius,
        y: (dy / dist) * maxRadius,
      });
    } else {
      setJoystickDelta({ x: dx, y: dy });
    }
  };

  const handleJoystickEnd = () => {
    setIsDraggingJoystick(false);
    setJoystickDelta({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#05070a] select-none text-slate-100 overflow-hidden p-3 md:p-6"
      onMouseMove={handleJoystickMove}
      onMouseUp={handleJoystickEnd}
      onTouchMove={handleJoystickMove}
      onTouchEnd={handleJoystickEnd}
    >
      {/* Background Cover Overlay Grid with moving warp styling */}
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB4xBvpVn0sGUsJEsSwFyJZV5xEdZXN6_rlYsepKxJoaTEHmJ_oQsf1LZtM0FTQ5IvpR0OYrJg1J5FW50UMpJysJsiT7k8Sdjqg3y0KnMSMP-FuN9CeHu0KwAQFveZnhrgUcg2Zez5EjHy0bYFQH1PRdmn7lMyyfpMubhP9AEZ2eDnza3wTVKsTMF14i5nEq1lY68h1msQFWXeh2Rq7ndgz8qP1RdNCNLL34NSSaCmf3CyTxhScOIXpJ901HN9277PB4LtRr_m2CVE')" }}>
        <div className="absolute inset-0 bg-[#05070a]/90 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-[#05070a]/70"></div>
        <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      </div>

      {/* Realtime Core HUD */}
      <div className="relative z-10 flex justify-between items-center w-full max-w-lg mx-auto mb-2 select-none">
        
        {/* Left Stats Block: Profile + Core Vitality Bars */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-11 h-11 rounded-xl border border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.5)] bg-slate-900/90 overflow-hidden flex items-center justify-center shrink-0">
            <img alt="Player Avatar" src={playerStats.avatar} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none" />
          </div>

          <div className="flex flex-col gap-0.5 text-left select-none leading-none">
            <span className="font-label-caps text-[9px] text-blue-400 font-bold tracking-wider mb-1">
              {playerStats.name}
            </span>
            {/* HP Bar */}
            <div className="h-3 w-28 bg-[#0a0f1d] rounded overflow-hidden border border-blue-500/20 relative">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-200" 
                style={{ width: `${playerHp}%` }} 
              />
              <span className="absolute inset-0 text-[8px] font-code font-bold flex items-center justify-center text-white text-shadow">
                HP {playerHp}/{playerMaxHp}
              </span>
            </div>
          </div>
        </div>

        {/* Center Section: Active Wave Stage Display & Point Scores */}
        <div className="flex flex-col items-center select-none text-center">
          <div className="bg-slate-900/80 border border-blue-500/30 rounded-lg px-2.5 py-1 text-center min-w-[100px] shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <div className="font-headline text-[9px] text-blue-300 font-bold tracking-widest leading-none uppercase select-none">
              SCORE
            </div>
            <div className="font-code text-base font-extrabold text-[#74f5ff] drop-shadow-[0_0_6px_rgba(116,245,255,0.6)] select-none">
              {currentScore.toLocaleString()}
            </div>
          </div>
          <span className="font-code text-[9px] text-slate-400 mt-1 select-none">
            LVL {gameLevel} • WAVE {gameWave}/3
          </span>
        </div>

        {/* Right Stats Block: Weapon Loadout State Info */}
        <div className="flex flex-col items-end gap-1 shrink-0 text-right">
          <div className="bg-slate-950/80 border border-purple-500/20 rounded px-2 py-0.5 leading-none select-none">
            <span className="text-[7.5px] text-purple-400 block tracking-wider uppercase font-bold">WEAPON MOD</span>
            <span className="text-[9px] font-code font-bold text-slate-100 block mt-0.5">
              {activeWeapon.replace('_', ' ')}
            </span>
          </div>
          {isRapidFire && (
            <span className="text-[8px] bg-red-600/25 border border-red-500/30 text-rose-300 px-1.5 py-0.5 rounded font-label-caps font-extrabold animate-pulse">
              🔥 RAPID FIRE ACTIVE
            </span>
          )}
        </div>

      </div>

      {/* Boss Core Vital HP HUD Indicator */}
      {bossHpProgress !== null && (
        <div className="relative z-20 w-full max-w-sm mx-auto mb-2 animate-fade-in select-none">
          <div className="bg-slate-950/90 border border-pink-500/30 rounded-lg p-1.5 shadow-[0_0_15px_rgba(244,63,94,0.15)] text-center leading-tight">
            <div className="flex justify-between items-center text-[8.5px] font-bold text-pink-400 px-1.5 mb-1">
              <span>⚠️ ADVANCED SENTINEL REACTOR CORE</span>
              <span>{Math.floor(bossHpProgress)}% ENERGY</span>
            </div>
            <div className="h-2 w-full bg-[#120005] border border-pink-500/30 rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)] transition-all duration-200"
                style={{ width: `${bossHpProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Main Games Stage Canvas */}
      <div className="flex-1 flex justify-center items-center relative py-1 select-none z-10 w-full">
        <canvas
          ref={canvasRef}
          className="border border-blue-500/20 rounded-2xl bg-slate-950/70 backdrop-blur-sm shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden max-w-full aspect-[300/420]"
          style={{ width: '300px', height: '420px' }}
        />

        {/* Temporary Alert Announcement Level Wave Banners Overlay */}
        {bannerText && (
          <div className="absolute inset-x-0 tracking-wider font-sans font-bold py-3 bg-[#05070a]/90 border-y border-purple-500/40 text-center animate-fade-in z-20 text-glow flex flex-col items-center justify-center select-none shadow-[0_0_20px_rgba(139,92,246,0.25)]">
            <span className="text-[10px] text-purple-300 font-code tracking-widest uppercase">TACTICAL DEPLOYMENT INITIALIZED</span>
            <span className="font-headline text-lg text-white font-extrabold tracking-tight mt-0.5 italic drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
              {bannerText}
            </span>
          </div>
        )}

        {/* Small movement tutorial prompt overlay shown only at low scores */}
        {currentScore < 300 && (
          <div className="absolute bottom-4 text-center select-none pointer-events-none text-slate-400/80 animate-pulse font-code text-[8px] uppercase tracking-wide bg-slate-900/45 px-2.5 py-1 rounded">
            ⌨️ WASD/DRAG JOYSTICK TO MOVE • AUTOSHOOT EQUIPPED
          </div>
        )}
      </div>

      {/* Game Over Screen Dialog Panel widget overlay */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg select-none animate-fade-in">
          <div className="w-full max-w-sm bg-[#05070a]/95 border border-blue-500/50 p-6 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.3)] text-center space-y-4 relative">
            
            {/* Cyber futuristic halo accents inside */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white font-label-caps text-[9px] tracking-widest px-3 py-1 rounded-full font-bold shadow-[0_0_15px_rgba(59,130,246,0.6)] select-none">
              ARENA DEPLOYMENT TERMINATED
            </div>

            <span 
              className="font-headline text-2xl font-black italic tracking-wide block text-glow mt-2 uppercase select-none"
              style={{ color: outcome === 'VICTORY' ? '#10b981' : '#f43f5e' }}
            >
              {outcome === 'VICTORY' ? 'SENTINEL DOMINATED!' : 'DEFENSE CLASHED!'}
            </span>

            <p className="font-sans text-xs text-slate-300 leading-relaxed select-none">
              {outcome === 'VICTORY' 
                ? 'Excellent work Blitzer! All automated orbital reactor nodes have been fully bypassed and neutralized!' 
                : 'Your shield battery fully collapsed from tactical drone bullet hits. Pilot core retrieved back safely.'}
            </p>

            <div className="bg-slate-900/90 border border-white/5 p-4 rounded-xl flex flex-col gap-2 shadow-inner select-none text-left font-code">
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5 text-[11px]">
                <span className="text-slate-400">HIGHEST LEVEL</span>
                <span className="text-white font-bold font-sans">LEVEL {deathStats.levelReached}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5 text-[11px]">
                <span className="text-slate-400">CORE ELIMINATIONS</span>
                <span className="text-[#ffd7f0] font-bold font-sans">{deathStats.eliminations} CORES</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5 text-[11px]">
                <span className="text-slate-400">ARENA POINTS WON</span>
                <span className="text-blue-400 font-bold font-sans">{deathStats.score.toLocaleString()} PTS</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1.5 pt-1 text-center">
                <div className="bg-slate-950 p-2 rounded border border-blue-500/10">
                  <span className="text-[8px] text-slate-500 block">VOLT REWARD</span>
                  <span className="text-amber-400 font-headline font-bold text-xs">+{deathStats.voltsGained} V</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-purple-500/10">
                  <span className="text-[8px] text-slate-500 block">VAULT PROGRESS</span>
                  <span className="text-purple-400 font-headline font-bold text-xs">+{deathStats.vaultXpGained} XP</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onExitArena({ volt: deathStats.voltsGained, gems: Math.floor(deathStats.eliminations / 4) });
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-slate-100 font-label-caps font-bold text-xs uppercase select-none cursor-pointer tracking-wider hover:brightness-110 active:scale-95 duration-100 shadow-[0_4px_15px_rgba(59,130,246,0.3)] block border border-blue-400/30 outline-none leading-none"
            >
              SECURE DEPLOYMENT BACK TO LOBBY
            </button>
          </div>
        </div>
      )}

      {/* Futuristic Bottom Control Console Pane */}
      <div className="relative z-10 flex justify-between items-end w-full pb-4 pointer-events-auto max-w-md mx-auto select-none mt-auto gap-3">
        
        {/* Joystick controller area */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-code text-[7px] text-slate-500 uppercase tracking-widest">DRAG_FLIGHT_DEVIATION</span>
          <div
            ref={joystickRef}
            onMouseDown={handleJoystickStart}
            onTouchStart={handleJoystickStart}
            className="w-24 h-24 md:w-26 md:h-26 rounded-full bg-slate-950/90 border border-blue-500/25 flex items-center justify-center relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] cursor-grab active:cursor-grabbing select-none"
          >
            <div className="absolute inset-2 border border-blue-500/5 rounded-full select-none" />
            <span className="material-symbols-outlined absolute top-1 text-slate-600 text-xs">keyboard_arrow_up</span>
            <span className="material-symbols-outlined absolute bottom-1 text-slate-600 text-xs">keyboard_arrow_down</span>
            <span className="material-symbols-outlined absolute left-1 text-slate-600 text-xs">keyboard_arrow_left</span>
            <span className="material-symbols-outlined absolute right-1 text-slate-600 text-xs">keyboard_arrow_right</span>

            {/* Float virtual thumb knob */}
            <div
              className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-400/70 shadow-[0_0_12px_rgba(59,130,246,0.4)] flex items-center justify-center select-none"
              style={{
                transform: `translate(${joystickDelta.x}px, ${joystickDelta.y}px)`,
                transition: isDraggingJoystick ? 'none' : 'transform 0.15s ease-out',
              }}
            >
              <div className="w-3 h-3 rounded-full bg-blue-400" />
            </div>
          </div>
        </div>

        {/* Action interactive triggers cluster pane */}
        <div className="flex items-end gap-3 select-none flex-1 justify-end">
          
          {/* Action Trigger 1: Refuel bubble shields */}
          <div className="relative flex flex-col items-center gap-1 select-none">
            <span className="font-code text-[7px] text-slate-400 uppercase">SHIELD</span>
            <button
              onClick={handleTriggerShield}
              disabled={shieldCooldown > 0 || shieldActiveState}
              className={`w-11 h-11 rounded-full flex items-center justify-center border select-none cursor-pointer transition-all active:scale-95 duration-70 ${
                shieldCooldown > 0 || shieldActiveState
                  ? 'bg-slate-950 border-white/5 opacity-50'
                  : 'bg-emerald-950/40 border-emerald-500/70 text-emerald-400 hover:bg-emerald-900/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
              }`}
            >
              <span className="material-symbols-outlined text-base">security</span>
              {shieldCooldown > 0 && (
                <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center rounded-full font-code text-[9px] text-white">
                  {shieldCooldown}S
                </div>
              )}
            </button>
          </div>

          {/* Action Trigger 2: Main primary weapon fire trigger, allows manual spamming too */}
          <div className="relative flex flex-col items-center gap-1 select-none">
            <span className="font-code text-[7px] text-pink-400 uppercase font-bold">MANUAL_FIRE</span>
            <button
              onClick={handleManualShoot}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 border border-pink-400 shadow-[0_0_20px_rgba(244,63,94,0.5)] flex items-center justify-center select-none active:scale-90 duration-100 cursor-pointer overflow-hidden leading-none"
            >
              <span className="material-symbols-outlined text-white text-2xl leading-none font-bold">local_fire_department</span>
            </button>
          </div>

          {/* Action Trigger 3: Warp speedy dash */}
          <div className="relative flex flex-col items-center gap-1 select-none">
            <span className="font-code text-[7px] text-slate-400 uppercase">DASH</span>
            <button
              onClick={handleTriggerDash}
              disabled={dashCooldown > 0}
              className={`w-11 h-11 rounded-full flex items-center justify-center border select-none cursor-pointer transition-all active:scale-95 duration-70 ${
                dashCooldown > 0
                  ? 'bg-slate-950 border-white/5 opacity-50'
                  : 'bg-indigo-950/40 border-indigo-500/70 text-indigo-400 hover:bg-indigo-900/40 shadow-[0_0_10px_rgba(99,102,241,0.25)]'
              }`}
            >
              <span className="material-symbols-outlined text-base font-bold">bolt</span>
              {dashCooldown > 0 && (
                <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center rounded-full font-code text-[9px] text-white">
                  {dashCooldown}S
                </div>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Auto-fire enable switch bar at the bottom center */}
      <div className="relative z-10 w-full max-w-xs mx-auto flex items-center justify-between border-t border-white/5 pt-1.5 select-none text-center">
        <span className="font-sans text-[9px] text-slate-400 tracking-wide uppercase">DYNAMIC AUTOMATED LASERS</span>
        <button
          onClick={() => setAutoFireActive((prev) => !prev)}
          className={`px-3 py-1 rounded font-code text-[8px] tracking-widest font-bold border transition-colors ${
            autoFireActive 
              ? 'bg-blue-500/10 border-blue-400 text-blue-300' 
              : 'bg-slate-950 border-slate-700 text-slate-500'
          }`}
        >
          {autoFireActive ? 'SYSTEMS_ONLINE' : 'SYSTEMS_OFFLINE'}
        </button>
      </div>

    </div>
  );
}
