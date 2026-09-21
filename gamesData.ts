export interface GameInfo {
  id: string;
  name: string;
  shortName: string;
  developer: string;
  category: string;
  platform: 'Mobile' | 'PC' | 'PC & Console';
  tag: string;
  imageUrl: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  bannerGradient: string;
  description: string;
  formatSummary: string;
  features: string[];
  rules: string[];
}

export const COMPETITIVE_GAMES: GameInfo[] = [
  {
    id: 'free-fire',
    name: 'Free Fire',
    shortName: 'FF MAX',
    developer: 'Garena',
    category: 'Battle Royale',
    platform: 'Mobile',
    tag: 'MAX',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-orange-950/80',
    badgeBorder: 'border-orange-500/40',
    badgeText: 'text-orange-400',
    bannerGradient: 'from-amber-500 via-orange-600 to-red-700',
    description: 'High-octane mobile battle royale and 4v4 Clash Squad action. Compete across Bermuda, Purgatory, and Kalahari using official 12-point ranking rules.',
    formatSummary: '12 Squads Battle Royale / 4v4 Clash Squad',
    features: [
      'Official 12-Point Placement Matrix',
      'Bermuda, Purgatory & Kalahari',
      'Clash Squad 4v4 Custom Rooms',
      'Mobile Only (Anti-Emulator)'
    ],
    rules: [
      '4 players per squad + 1 reserve.',
      'Official FF Points Table: 1st (12 pts), 2nd (9 pts), 3rd (8 pts), 4th (7 pts)...',
      'Emulators & iPads strictly forbidden; mobile devices only.',
      'Room credentials distributed 15 minutes before scheduled match.'
    ]
  },
  {
    id: 'bgmi',
    name: 'BGMI',
    shortName: 'BGMI',
    developer: 'Krafton',
    category: 'Battle Royale',
    platform: 'Mobile',
    tag: 'PRO',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-950/80',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-400',
    bannerGradient: 'from-emerald-500 via-teal-700 to-slate-900',
    description: 'Premier Battlegrounds Mobile India circuit. 16-Squad competitive lobbies across Erangel and Miramar with official BGIS/BMPS 10-point scoring.',
    formatSummary: '16 Squads Battle Royale (6 Matches)',
    features: [
      'Official BGIS 10-Point Scoring Matrix',
      'Erangel, Miramar & Sanhok Rotation',
      'Instant Match MVP & Finish Tracker',
      'Device Verification & Anti-Cheat'
    ],
    rules: [
      '4 main players + 1 substitute per squad.',
      'Official BGIS 10-point system: 1st (10), 2nd (6), 3rd (5), 4th (4), 5th (3), 6th (2), 7th (1), 8th (1).',
      'Anti-cheat recording and screen-share check required for top finalists.',
      'Triggers and rooting/jailbreak strictly prohibited.'
    ]
  },
  {
    id: 'valorant',
    name: 'Valorant',
    shortName: 'VAL',
    developer: 'Riot Games',
    category: 'Tactical FPS',
    platform: 'PC',
    tag: 'MASTERS',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-rose-500 to-red-600',
    badgeBg: 'bg-rose-950/80',
    badgeBorder: 'border-rose-500/40',
    badgeText: 'text-rose-400',
    bannerGradient: 'from-rose-600 via-red-700 to-amber-900',
    description: '5v5 character-based tactical shooter. Precise gunplay and tactical agent abilities across Ascent, Haven, and Bind under MR12 tournament rules.',
    formatSummary: '5v5 Double Elimination (BO3 / BO5)',
    features: [
      'Standard MR12 Spike Plant/Defuse',
      '128-Tick Tournament Lobbies',
      'Riot Vanguard Anti-Cheat Client',
      'Active Map Pool Veto'
    ],
    rules: [
      'Vanguard anti-cheat client must be active throughout all tournament matches.',
      'Group stages Best of 3 (BO3), Grand Finals Best of 5 (BO5).',
      'Tactical timeouts: 2 per team per map (60 seconds each).'
    ]
  },
  {
    id: 'counter-strike-2',
    name: 'Counter-Strike 2',
    shortName: 'CS2',
    developer: 'Valve',
    category: 'Tactical FPS',
    platform: 'PC',
    tag: 'MAJOR',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-amber-600 to-yellow-500',
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-400',
    bannerGradient: 'from-amber-600 via-orange-700 to-slate-900',
    description: 'The definitive competitive FPS showdown. MR12 regulation matches with sub-tick accuracy, Active Duty maps (Mirage, Inferno, Nuke), and bracket seeding.',
    formatSummary: '5v5 MR12 Double Elimination',
    features: [
      'Official Valve MR12 Regulation',
      'Overtime MR3 with $10k Start Cash',
      'Active Duty Map Pool Veto',
      'Dedicated Low-Latency Nodes'
    ],
    rules: [
      'MR12 regulation rounds. Overtime MR3 with $10,000 starting cash.',
      'Map veto conducted 30 minutes before match time on platform bracket.',
      'Proof of Steam identity and VAC-clean status required.'
    ]
  },
  {
    id: 'apex-legends',
    name: 'Apex Legends',
    shortName: 'APEX',
    developer: 'EA / Respawn',
    category: 'Battle Royale',
    platform: 'PC & Console',
    tag: 'ALGS',
    imageUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-cyan-500 to-blue-600',
    badgeBg: 'bg-cyan-950/80',
    badgeBorder: 'border-cyan-500/40',
    badgeText: 'text-cyan-400',
    bannerGradient: 'from-cyan-600 via-teal-700 to-slate-900',
    description: 'High-mobility trio hero battle royale. Compete with ALGS Match Point thresholds and scoring across World’s Edge and Storm Point.',
    formatSummary: 'Trio Battle Royale (6 Matches)',
    features: [
      'ALGS Match Point Format (50 pts)',
      '1 Kill = 1 Tournament Point',
      'World’s Edge & Storm Point',
      'Pro League Scrim Protocols'
    ],
    rules: [
      '3-player squad rosters with up to 1 emergency substitute.',
      '1 kill = 1 tournament point. Match point threshold activated at 50 pts.',
      'POV stream delay minimum 180 seconds mandatory.'
    ]
  },
  {
    id: 'cod-mobile',
    name: 'Call of Duty Mobile',
    shortName: 'CODM',
    developer: 'Activision',
    category: 'FPS / Battle Royale',
    platform: 'Mobile',
    tag: 'CDL',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-yellow-500 to-amber-600',
    badgeBg: 'bg-yellow-950/80',
    badgeBorder: 'border-yellow-500/40',
    badgeText: 'text-yellow-400',
    bannerGradient: 'from-yellow-600 via-amber-700 to-zinc-900',
    description: 'Competitive mobile warfare. Hardpoint, Search & Destroy, and 100-player Battle Royale isolated drops with CDL-standard competitive rulesets.',
    formatSummary: '5v5 Multi-Mode / 25 Squads BR',
    features: [
      'Hardpoint & Search & Destroy Rotation',
      'Restricted Weapon & Perk Bans',
      'Custom Room Verification',
      'Mobile Touch Controls Only'
    ],
    rules: [
      '5 players per squad for Multiplayer, 4 players for BR.',
      'Official CDL banlist applied to weapons, perks, and scorestreaks.',
      'No external controllers or PC emulators permitted.'
    ]
  },
  {
    id: 'league-of-legends',
    name: 'League of Legends',
    shortName: 'LOL',
    developer: 'Riot Games',
    category: 'MOBA',
    platform: 'PC',
    tag: 'WORLDS',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-950/80',
    badgeBorder: 'border-blue-500/40',
    badgeText: 'text-blue-400',
    bannerGradient: 'from-blue-600 via-indigo-800 to-slate-950',
    description: 'Legendary 5v5 MOBA warfare on Summoner’s Rift. Tournament Draft mode with Fearless draft rules and seeded bracket progression.',
    formatSummary: '5v5 Single / Double Elimination BO3',
    features: [
      'Summoner’s Rift Tournament Draft',
      'Fearless Draft Rules in BO3/BO5',
      'Verified Ranked Tier Seedings',
      'Riot Tournament Code Integration'
    ],
    rules: [
      'Tournament Draft mode on current competitive live patch.',
      'All players must meet verified ranked tier eligibility.',
      'Coaches permitted in Discord voice channel during draft phase only.'
    ]
  }
];

export function getGameById(id: string): GameInfo | undefined {
  const clean = id.toLowerCase().trim();
  return COMPETITIVE_GAMES.find(
    (g) => g.id.toLowerCase() === clean || g.name.toLowerCase() === clean
  );
}

export function normalizeGameQuery(gameNameOrId: string): string {
  const found = getGameById(gameNameOrId);
  return found ? found.name : gameNameOrId;
}
