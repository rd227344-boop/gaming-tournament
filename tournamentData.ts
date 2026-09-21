import { Team, MatchFixture, PrizeTier, BracketMatch, TournamentRule, TournamentItem, LeaderboardEntry, User } from '../types';

export interface DemoUserAccount {
  user: User;
  passwordHashOrHint: string;
}

export const DEMO_USERS: DemoUserAccount[] = [
  {
    user: {
      id: 'usr-captain',
      gamerTag: 'Phoenix_Lead',
      email: 'captain@vortex.gg',
      role: 'captain',
      preferredGame: 'Valorant',
      region: 'NA',
      avatarColor: 'from-amber-500 to-red-600',
      teamId: 'team-1',
      teamName: 'Vortex Protocol',
      teamTag: 'VTX',
      discord: 'Phoenix#9921',
      bio: 'Captain & IGL of Vortex Protocol. Radiant #14.'
    },
    passwordHashOrHint: 'password123'
  },
  {
    user: {
      id: 'usr-player',
      gamerTag: 'Acrobat_X',
      email: 'player@apex.gg',
      role: 'player',
      preferredGame: 'Apex Legends',
      region: 'EU',
      avatarColor: 'from-cyan-500 to-blue-600',
      discord: 'Acrobat#1337',
      bio: 'Solo predator duelist looking for tournament squad.'
    },
    passwordHashOrHint: 'password123'
  },
  {
    user: {
      id: 'usr-organizer',
      gamerTag: 'ApexOrganizer',
      email: 'admin@proarena.gg',
      role: 'organizer',
      preferredGame: 'Counter-Strike 2',
      region: 'Global',
      avatarColor: 'from-emerald-500 to-teal-600',
      discord: 'AdminOrg#0001',
      bio: 'Official Esports Tournament Host & Verified Bracket Arbiter.'
    },
    passwordHashOrHint: 'password123'
  }
];

export const INITIAL_TOURNAMENTS: TournamentItem[] = [
  {
    id: 'tourn-ff-1',
    title: 'Free Fire Pro Clash: Grand Arena',
    game: 'Free Fire',
    gameCategory: 'br',
    bannerGradient: 'from-amber-500 via-orange-600 to-red-700',
    format: '12 Squads Battle Royale (6 Matches)',
    prizePool: 100000,
    entryFee: 'Free Entry',
    status: 'registration',
    startDate: 'Oct 05, 2026',
    region: 'India',
    slotsTotal: 48,
    slotsFilled: 36,
    featured: true,
    description: 'Official Free Fire competitive squad tournament. 6 matches across Bermuda, Purgatory, and Kalahari. Official 12-point placement scoring matrix with 1 point per kill.',
    organizerName: 'Esports Federation',
    rules: [
      '4 players per squad + 1 reserve.',
      'Official FF Points Table: 1st (12 pts), 2nd (9 pts), 3rd (8 pts), 4th (7 pts), 5th (6 pts), 6th (5 pts)...',
      'Emulators & iPads strictly forbidden; mobile devices only.',
      'Room ID and password sent 15 mins before match via registered Discord/app.'
    ],
    registeredSquadNames: ['Total Gaming Squad', 'Orangutan Elite', 'TSG Army', 'Blind Esports']
  },
  {
    id: 'tourn-bgmi-1',
    title: 'BGMI Pro Series Masters: Split 1',
    game: 'BGMI',
    gameCategory: 'br',
    bannerGradient: 'from-emerald-500 via-teal-700 to-slate-900',
    format: '16 Squads Battle Royale (6 Matches)',
    prizePool: 150000,
    entryFee: 'Free Entry (Verified)',
    status: 'registration',
    startDate: 'Oct 08, 2026',
    region: 'India',
    slotsTotal: 64,
    slotsFilled: 52,
    featured: true,
    description: 'Battlegrounds Mobile India competitive championship. 6 matches rotating Erangel, Miramar, and Sanhok. Standard 10-point BGIS/BMPS scoring system with 1 finish point per elimination.',
    organizerName: 'Krafton Esports Circuit',
    rules: [
      '4 main players + 1 substitute per squad.',
      'Official BGIS 10-point system: 1st (10), 2nd (6), 3rd (5), 4th (4), 5th (3), 6th (2), 7th (1), 8th (1), 9-16th (0).',
      'Anti-cheat recording and screen-share check required for top 3 squads.',
      'Strict ban on triggers, emulators, and device rooting/jailbreak.'
    ],
    registeredSquadNames: ['Team Soul', 'GodLike Esports', 'Entity Gaming', 'Global Esports']
  },
  {
    id: 'tourn-ff-2',
    title: 'Free Fire 4v4 Clash Squad Rumble',
    game: 'Free Fire',
    gameCategory: 'fps',
    bannerGradient: 'from-red-600 via-rose-700 to-amber-900',
    format: '4v4 Clash Squad Single Elimination',
    prizePool: 40000,
    entryFee: 'Free Entry',
    status: 'registration',
    startDate: 'Oct 12, 2026',
    region: 'India',
    slotsTotal: 32,
    slotsFilled: 22,
    featured: false,
    description: 'High-intensity 4v4 Clash Squad tournament. Best of 7 rounds per match, competitive character skill bans enforced, official custom room settings.',
    organizerName: 'Free Fire Scrims Hub',
    rules: [
      'Squad of 4 players.',
      'Custom room clash squad competitive settings.',
      'No character skill exploits or bug abuse.'
    ],
    registeredSquadNames: ['GodLike FF', 'Vortex Protocol', 'Hydra Tactical']
  },
  {
    id: 'tourn-bgmi-2',
    title: 'BGMI Rising Stars Weekly Scrim',
    game: 'BGMI',
    gameCategory: 'br',
    bannerGradient: 'from-amber-600 via-yellow-600 to-zinc-900',
    format: '16 Squads (4 Custom Rooms)',
    prizePool: 25000,
    entryFee: 'Free Entry',
    status: 'upcoming',
    startDate: 'Oct 15, 2026',
    region: 'India',
    slotsTotal: 32,
    slotsFilled: 18,
    featured: false,
    description: 'Open community scrims for rising Tier-2 and Tier-3 squads. Automated point table publication and MVP recognition.',
    organizerName: 'BGMI Battle Hub',
    rules: [
      '16 Squads per lobby, 4 matches (Erangel, Miramar, Erangel, Sanhok).',
      'Point table published instantly after screenshot verification.',
      'Only players level 35+ eligible.'
    ],
    registeredSquadNames: ['Reckoning Esports', 'Team Insane', 'Revenant']
  },
  {
    id: 'tourn-1',
    title: 'Valorant Champions Clash: Masters',
    game: 'Valorant',
    gameCategory: 'fps',
    bannerGradient: 'from-rose-600 via-red-700 to-amber-900',
    format: '5v5 Double Elimination',
    prizePool: 250000,
    entryFee: 'Free Entry (Verified)',
    status: 'registration',
    startDate: 'Oct 04, 2026',
    region: 'Global',
    slotsTotal: 64,
    slotsFilled: 48,
    featured: true,
    description: 'Premier tier-1 Valorant masters tournament featuring verified pro squads across North America, Europe, and APAC competing on 128-tick private tournament lobbies with kernel anti-cheat verification.',
    organizerName: 'Riot Global Esports Federation',
    rules: [
      'Kernel anti-cheat client must be active throughout all matches.',
      'Group stage matches are Best of 3 (BO3), Grand Finals are Best of 5 (BO5).',
      'Tactical pauses capped at 2 per team per map (60 seconds each).'
    ],
    registeredSquadNames: ['Vortex Protocol', 'Ghost Division', 'Ronin Syndicate', 'Solaris Nova', 'Hydra Tactical', 'Titan Vanguard']
  },
  {
    id: 'tourn-2',
    title: 'Counter-Strike 2 Major Showdown',
    game: 'Counter-Strike 2',
    gameCategory: 'fps',
    bannerGradient: 'from-amber-600 via-orange-700 to-slate-900',
    format: '5v5 Double Elimination',
    prizePool: 150000,
    entryFee: '$25 / Squad',
    status: 'registration',
    startDate: 'Sept 28, 2026',
    region: 'NA',
    slotsTotal: 32,
    slotsFilled: 26,
    featured: true,
    description: 'Competitive MR12 showdown for North American CS2 squads. Official Valve active duty map pool, automated overtime with $10,000 starting cash, and dedicated Chicago/Dallas low-latency nodes.',
    organizerName: 'Valve Major Circuit NA',
    rules: [
      'MR12 regulation rounds. Overtime MR3 with $10,000 start cash.',
      'Active duty map pool veto conducted 30 minutes before match.',
      'Proof of identity and steam trade-URL verification required for payout.'
    ],
    registeredSquadNames: ['Titan Vanguard', 'Apex Phantoms', 'Cyber Samurai', 'Vortex Protocol']
  },
  {
    id: 'tourn-3',
    title: 'Apex Legends Global Cup: Split 2',
    game: 'Apex Legends',
    gameCategory: 'br',
    bannerGradient: 'from-cyan-600 via-teal-700 to-slate-900',
    format: 'Trio Battle Royale (6 Matches)',
    prizePool: 100000,
    entryFee: 'Free Entry',
    status: 'registration',
    startDate: 'Oct 02, 2026',
    region: 'Global',
    slotsTotal: 60,
    slotsFilled: 52,
    featured: false,
    description: '6-round trio Battle Royale with standard match point format. Teams earn placement points plus 1 point per confirmed squad elimination across Storm Point and World’s Edge.',
    organizerName: 'ALGS Circuit Command',
    rules: [
      '3-player squad rosters with up to 1 emergency substitute.',
      '1 kill = 1 tournament point. Match Point threshold at 50 pts.',
      'Live stream delay of at least 180 seconds required for all POV streams.'
    ],
    registeredSquadNames: ['Ghost Division', 'Ronin Syndicate', 'Solaris Nova']
  },
  {
    id: 'tourn-4',
    title: 'League of Legends Rift Invitational',
    game: 'League of Legends',
    gameCategory: 'moba',
    bannerGradient: 'from-blue-600 via-indigo-800 to-slate-950',
    format: '5v5 Single Elimination BO3',
    prizePool: 75000,
    entryFee: 'Free Entry',
    status: 'registration',
    startDate: 'Oct 08, 2026',
    region: 'EU',
    slotsTotal: 32,
    slotsFilled: 19,
    featured: false,
    description: 'Summoners Rift competitive bracket featuring Tournament Draft mode on current active patch. Seeded based on verified seasonal challenger/grandmaster MMR.',
    organizerName: 'EU Masters League',
    rules: [
      'Tournament Draft mode with Fearless draft rules in BO3 deciders.',
      'All players must be Diamond 2 or higher in current or previous split.',
      'Coaches permitted in voice lobby during draft phase only.'
    ],
    registeredSquadNames: ['Hydra Tactical', 'Ghost Division']
  },
  {
    id: 'tourn-5',
    title: 'Rocket League Championship Cup',
    game: 'Rocket League',
    gameCategory: 'sports',
    bannerGradient: 'from-sky-500 via-blue-600 to-cyan-900',
    format: '3v3 Best of 5 Standard',
    prizePool: 35000,
    entryFee: 'Free Entry',
    status: 'upcoming',
    startDate: 'Oct 14, 2026',
    region: 'APAC',
    slotsTotal: 16,
    slotsFilled: 11,
    featured: false,
    description: 'Fast-paced 3v3 aerial soccar championship. Standard 5-minute regulation, infinite sudden-death overtime, DFH Stadium / Champions Field rotation.',
    organizerName: 'APAC Soccar Series',
    rules: [
      'All car presets and esports decals permitted.',
      'Best of 5 games throughout bracket; Grand Finals Best of 7.',
      'Standard server tick rate with Tokyo / Singapore host balancing.'
    ],
    registeredSquadNames: ['Ronin Syndicate', 'Cyber Samurai']
  },
  {
    id: 'tourn-6',
    title: 'Rainbow Six Siege Tactical Circuit',
    game: 'Rainbow Six Siege',
    gameCategory: 'fps',
    bannerGradient: 'from-emerald-600 via-teal-800 to-slate-950',
    format: '5v5 Bomb Scenario',
    prizePool: 50000,
    entryFee: '$15 / Squad',
    status: 'registration',
    startDate: 'Oct 20, 2026',
    region: 'LATAM',
    slotsTotal: 16,
    slotsFilled: 14,
    featured: false,
    description: 'Close-quarters tactical demolition combat under official esports rules: 12 rounds, role swaps after 6 rounds, 4 operator bans, overtime match point.',
    organizerName: 'LATAM Siege League',
    rules: [
      'Standard 4-operator ban phase (2 Attackers, 2 Defenders).',
      'Overtime with round difference of 2 required for victory.',
      'MOSS anti-cheat logs must be uploaded within 15 minutes of match end.'
    ],
    registeredSquadNames: ['Solaris Nova', 'Apex Phantoms']
  },
  {
    id: 'tourn-codm-1',
    title: 'Call of Duty Mobile Masters Championship',
    game: 'Call of Duty Mobile',
    gameCategory: 'fps',
    bannerGradient: 'from-yellow-600 via-amber-700 to-zinc-900',
    format: '5v5 Search & Destroy / Hardpoint',
    prizePool: 80000,
    entryFee: 'Free Entry',
    status: 'registration',
    startDate: 'Oct 18, 2026',
    region: 'India',
    slotsTotal: 32,
    slotsFilled: 24,
    featured: true,
    description: 'Premier Call of Duty Mobile tournament under official CDL rules. Hardpoint, Search & Destroy, and Control rotations on Standoff, Summit, and Raid.',
    organizerName: 'Activision Mobile Circuit',
    rules: [
      '5 active players per squad + 1 designated sub.',
      'Touchscreen mobile devices only (No controllers or emulators).',
      'Official CDL weapon and perk restrictions enforced.'
    ],
    registeredSquadNames: ['GodLike CODM', 'Vitality Mobile', 'Team Mayhem', 'Reckoning CODM']
  },
  {
    id: 'tourn-codm-2',
    title: 'CODM Battle Royale Isolated Squads',
    game: 'Call of Duty Mobile',
    gameCategory: 'br',
    bannerGradient: 'from-amber-600 via-stone-700 to-slate-900',
    format: '25 Squads Battle Royale (4 Matches)',
    prizePool: 45000,
    entryFee: 'Free Entry',
    status: 'upcoming',
    startDate: 'Oct 24, 2026',
    region: 'Global',
    slotsTotal: 25,
    slotsFilled: 15,
    featured: false,
    description: 'Isolated map 100-player Battle Royale scrims. 4 matches with custom room code distribution and automated finish placement points.',
    organizerName: 'CODM Scrims India',
    rules: [
      'Squad of 4 players.',
      'Isolated map, TPP mode.',
      'Points awarded: 1st (15), 2nd (12), 3rd (10) + 1 pt per squad kill.'
    ],
    registeredSquadNames: ['Hydra Mobile', 'Vortex Protocol', 'Blind CODM']
  },
  {
    id: 'tourn-val-2',
    title: 'Valorant Premier Ascent Showdown',
    game: 'Valorant',
    gameCategory: 'fps',
    bannerGradient: 'from-red-600 via-rose-700 to-zinc-900',
    format: '5v5 Single Elimination BO3',
    prizePool: 60000,
    entryFee: 'Free Entry',
    status: 'registration',
    startDate: 'Oct 14, 2026',
    region: 'APAC',
    slotsTotal: 32,
    slotsFilled: 22,
    featured: false,
    description: 'High-rank competitive community tournament on Tokyo / Singapore low-latency servers with map veto and tournament draft rules.',
    organizerName: 'APAC Valorant Open',
    rules: [
      'Immortal 1+ rank required on verified Riot ID.',
      'Active map veto on tournament lobby before match.',
      'Overtime win by 2 rounds standard.'
    ],
    registeredSquadNames: ['Paper Rex Academy', 'Global Esports Val', 'Velocity Gaming']
  },
  {
    id: 'tourn-cs2-2',
    title: 'Counter-Strike 2 Mirage Open Scrims',
    game: 'Counter-Strike 2',
    gameCategory: 'fps',
    bannerGradient: 'from-amber-500 via-yellow-600 to-zinc-900',
    format: '5v5 MR12 Single Bracket',
    prizePool: 50000,
    entryFee: 'Free Entry',
    status: 'upcoming',
    startDate: 'Oct 16, 2026',
    region: 'EU',
    slotsTotal: 16,
    slotsFilled: 10,
    featured: false,
    description: 'Weekly MR12 scrim ladder for verified CS2 teams across Europe and Asia with automated knife round and sub-tick server balancing.',
    organizerName: 'CS2 Scrims Arena',
    rules: [
      '5 players per squad.',
      'MR12 regulation format.',
      'VAC ban within past 365 days results in instant disqualification.'
    ],
    registeredSquadNames: ['Astralis Young', 'ENCE Academy', 'MOUZ NXT']
  },
  {
    id: 'tourn-apex-2',
    title: 'Apex Legends Storm Point Trio Scrims',
    game: 'Apex Legends',
    gameCategory: 'br',
    bannerGradient: 'from-cyan-500 via-blue-600 to-slate-900',
    format: 'Trio Battle Royale (4 Matches)',
    prizePool: 40000,
    entryFee: 'Free Entry',
    status: 'registration',
    startDate: 'Oct 11, 2026',
    region: 'APAC',
    slotsTotal: 20,
    slotsFilled: 16,
    featured: false,
    description: 'Competitive 20-trio custom lobby scrims on Storm Point. Standard ALGS kill multiplier and placement matrix.',
    organizerName: 'Apex Scrims League',
    rules: [
      'Trio of 3 players.',
      'Storm Point 4-match cumulative series.',
      'Placement points: 1st (12), 2nd (9), 3rd (7)... + 1 pt per kill.'
    ],
    registeredSquadNames: ['Fnatic Apex', 'Riddle Order', 'Reject Winnity']
  },
  {
    id: 'tourn-lol-2',
    title: 'League of Legends Clash of Champions',
    game: 'League of Legends',
    gameCategory: 'moba',
    bannerGradient: 'from-indigo-600 via-blue-700 to-slate-950',
    format: '5v5 Tournament Draft BO3',
    prizePool: 65000,
    entryFee: 'Free Entry',
    status: 'upcoming',
    startDate: 'Oct 22, 2026',
    region: 'Global',
    slotsTotal: 32,
    slotsFilled: 18,
    featured: false,
    description: 'Summoners Rift competitive series with Fearless draft rules in BO3. Seeded based on verified seasonal rank.',
    organizerName: 'Riot Community Circuit',
    rules: [
      '5 players + up to 2 substitutes.',
      'Tournament Draft mode with 5 bans per team.',
      'Screenshot of victory screen required upon completion.'
    ],
    registeredSquadNames: ['T1 Challengers', 'Gen.G Global Academy', 'DRX Academy']
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Vortex Protocol',
    tag: 'VTX',
    type: 'squad',
    game: 'Valorant',
    region: 'NA',
    avatarColor: 'from-cyan-500 to-blue-600',
    ratingElo: 2940,
    wins: 28,
    losses: 2,
    winRate: 93.3,
    earnings: '$182,500',
    streak: '8W Streak',
    captainOrPlayer: 'Acrobat_X',
  },
  {
    rank: 2,
    name: 'Ghost Division',
    tag: 'GHOST',
    type: 'squad',
    game: 'CS2',
    region: 'EU',
    avatarColor: 'from-emerald-500 to-teal-600',
    ratingElo: 2895,
    wins: 25,
    losses: 4,
    winRate: 86.2,
    earnings: '$140,000',
    streak: '5W Streak',
    captainOrPlayer: 'SilenZ',
  },
  {
    rank: 3,
    name: 'Ronin Syndicate',
    tag: 'RONIN',
    type: 'squad',
    game: 'Apex Legends',
    region: 'APAC',
    avatarColor: 'from-rose-500 to-red-700',
    ratingElo: 2820,
    wins: 24,
    losses: 5,
    winRate: 82.8,
    earnings: '$118,000',
    streak: '4W Streak',
    captainOrPlayer: 'Kenji99',
  },
  {
    rank: 4,
    name: 'Solaris Nova',
    tag: 'SLR',
    type: 'squad',
    game: 'Valorant',
    region: 'LATAM',
    avatarColor: 'from-amber-500 to-orange-600',
    ratingElo: 2780,
    wins: 22,
    losses: 6,
    winRate: 78.6,
    earnings: '$92,000',
    streak: '3W Streak',
    captainOrPlayer: 'FuegoKing',
  },
  {
    rank: 5,
    name: 'Hydra Tactical',
    tag: 'HYD',
    type: 'squad',
    game: 'CS2',
    region: 'EU',
    avatarColor: 'from-violet-500 to-purple-700',
    ratingElo: 2715,
    wins: 20,
    losses: 7,
    winRate: 74.1,
    earnings: '$74,000',
    streak: '2W Streak',
    captainOrPlayer: 'ViperX',
  },
  {
    rank: 6,
    name: 'Titan Vanguard',
    tag: 'TTN',
    type: 'squad',
    game: 'Valorant',
    region: 'NA',
    avatarColor: 'from-blue-500 to-indigo-600',
    ratingElo: 2680,
    wins: 19,
    losses: 8,
    winRate: 70.4,
    earnings: '$61,000',
    streak: '1W Streak',
    captainOrPlayer: 'Colossus',
  },
];

export const INITIAL_SOLO_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Acrobat_X (MVP)',
    tag: 'VTX',
    type: 'solo',
    game: 'Valorant',
    region: 'NA',
    avatarColor: 'from-cyan-500 to-blue-600',
    ratingElo: 3120,
    wins: 34,
    losses: 3,
    winRate: 91.9,
    earnings: '$45,000',
    streak: '10W Streak',
    captainOrPlayer: 'Duelist / Entry Fragger',
  },
  {
    rank: 2,
    name: 'SilenZ (Clutch Master)',
    tag: 'GHOST',
    type: 'solo',
    game: 'CS2',
    region: 'EU',
    avatarColor: 'from-emerald-500 to-teal-600',
    ratingElo: 3080,
    wins: 31,
    losses: 4,
    winRate: 88.6,
    earnings: '$38,500',
    streak: '7W Streak',
    captainOrPlayer: 'AWPer / Sniper',
  },
  {
    rank: 3,
    name: 'Kenji99 (Precision)',
    tag: 'RONIN',
    type: 'solo',
    game: 'Apex Legends',
    region: 'APAC',
    avatarColor: 'from-rose-500 to-red-700',
    ratingElo: 2990,
    wins: 29,
    losses: 6,
    winRate: 82.9,
    earnings: '$29,000',
    streak: '5W Streak',
    captainOrPlayer: 'IGL / Recon',
  },
  {
    rank: 4,
    name: 'FuegoKing (Flame)',
    tag: 'SLR',
    type: 'solo',
    game: 'Valorant',
    region: 'LATAM',
    avatarColor: 'from-amber-500 to-orange-600',
    ratingElo: 2920,
    wins: 27,
    losses: 7,
    winRate: 79.4,
    earnings: '$22,000',
    streak: '3W Streak',
    captainOrPlayer: 'Controller / Initiator',
  },
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Vortex Protocol',
    tag: 'VTX',
    region: 'NA',
    seed: 1,
    captain: 'Phoenix_Lead',
    logoColor: 'from-cyan-500 to-blue-600',
    wins: 14,
    losses: 2,
    game: 'Valorant',
    openToJoin: true,
    description: 'Premier tier-1 Valorant squad competing in Masters & NA Open circuits. Looking for flex initiator.',
    members: [
      { id: 'm-1', gamerTag: 'Phoenix_Lead', role: 'Captain', joinedAt: 'Aug 2026' },
      { id: 'm-2', gamerTag: 'NeonPulse', role: 'Player', joinedAt: 'Aug 2026' },
      { id: 'm-3', gamerTag: 'ViperX9', role: 'Player', joinedAt: 'Sept 2026' },
      { id: 'm-4', gamerTag: 'OmenShadow', role: 'Player', joinedAt: 'Sept 2026' }
    ]
  },
  {
    id: 'team-2',
    name: 'Ghost Division',
    tag: 'GHOST',
    region: 'EU',
    seed: 2,
    captain: 'SilenZ',
    logoColor: 'from-emerald-500 to-teal-600',
    wins: 13,
    losses: 3,
    game: 'Counter-Strike 2',
    openToJoin: true,
    description: 'Disciplined European CS2 & Apex squad. Tactical utility and pristine retake coordination.',
    members: [
      { id: 'm-5', gamerTag: 'SilenZ', role: 'Captain', joinedAt: 'July 2026' },
      { id: 'm-6', gamerTag: 'FlashBang_Pro', role: 'Player', joinedAt: 'July 2026' },
      { id: 'm-7', gamerTag: 'SmokeScreen', role: 'Player', joinedAt: 'Aug 2026' }
    ]
  },
  {
    id: 'team-3',
    name: 'Ronin Syndicate',
    tag: 'RONIN',
    region: 'APAC',
    seed: 3,
    captain: 'Kenji99',
    logoColor: 'from-rose-500 to-red-700',
    wins: 12,
    losses: 4,
    game: 'Apex Legends',
    openToJoin: false,
    description: 'Reigning APAC Champions. Fast zone rotates, unmatched 3v3 team fighting synergy.',
    members: [
      { id: 'm-8', gamerTag: 'Kenji99', role: 'Captain', joinedAt: 'May 2026' },
      { id: 'm-9', gamerTag: 'NinjaRecon', role: 'Player', joinedAt: 'May 2026' },
      { id: 'm-10', gamerTag: 'BladeMaster', role: 'Player', joinedAt: 'June 2026' }
    ]
  },
  {
    id: 'team-4',
    name: 'Solaris Nova',
    tag: 'SLR',
    region: 'LATAM',
    seed: 4,
    captain: 'FuegoKing',
    logoColor: 'from-amber-500 to-orange-600',
    wins: 11,
    losses: 5,
    game: 'Valorant',
    openToJoin: true,
    description: 'Aggressive LATAM contender with high duelist combat ratings and relentless map pressure.',
    members: [
      { id: 'm-11', gamerTag: 'FuegoKing', role: 'Captain', joinedAt: 'June 2026' },
      { id: 'm-12', gamerTag: 'SolRunner', role: 'Player', joinedAt: 'July 2026' }
    ]
  },
  {
    id: 'team-5',
    name: 'Hydra Tactical',
    tag: 'HYD',
    region: 'EU',
    seed: 5,
    captain: 'ViperX',
    logoColor: 'from-violet-500 to-purple-700',
    wins: 10,
    losses: 6,
    game: 'League of Legends',
    openToJoin: true,
    description: 'Strategic objective-focused roster striving for European Invitational qualification.',
    members: [
      { id: 'm-13', gamerTag: 'ViperX', role: 'Captain', joinedAt: 'Aug 2026' },
      { id: 'm-14', gamerTag: 'BaronStealer', role: 'Player', joinedAt: 'Aug 2026' }
    ]
  },
  {
    id: 'team-6',
    name: 'Titan Vanguard',
    tag: 'TTN',
    region: 'NA',
    seed: 6,
    captain: 'Colossus',
    logoColor: 'from-blue-500 to-indigo-600',
    wins: 9,
    losses: 7,
    game: 'Counter-Strike 2',
    openToJoin: true,
    description: 'North American collegiate veterans moving into professional open division.',
    members: [
      { id: 'm-15', gamerTag: 'Colossus', role: 'Captain', joinedAt: 'July 2026' },
      { id: 'm-16', gamerTag: 'IronShield', role: 'Player', joinedAt: 'July 2026' }
    ]
  },
  {
    id: 'team-7',
    name: 'Cyber Samurai',
    tag: 'CYBR',
    region: 'APAC',
    seed: 7,
    captain: 'KatanaBlade',
    logoColor: 'from-fuchsia-500 to-pink-600',
    wins: 9,
    losses: 7,
    game: 'Rocket League',
    openToJoin: false,
    description: 'Mechanical masters of aerial ball control and lightning ceiling shots.',
    members: [
      { id: 'm-17', gamerTag: 'KatanaBlade', role: 'Captain', joinedAt: 'June 2026' },
      { id: 'm-18', gamerTag: 'SpeedyWheels', role: 'Player', joinedAt: 'June 2026' }
    ]
  },
  {
    id: 'team-8',
    name: 'Apex Phantoms',
    tag: 'APX',
    region: 'LATAM',
    seed: 8,
    captain: 'Spectre7',
    logoColor: 'from-teal-400 to-emerald-600',
    wins: 8,
    losses: 8,
    game: 'Rainbow Six Siege',
    openToJoin: true,
    description: 'Specialized demolition and site retake operators in regional qualifiers.',
    members: [
      { id: 'm-19', gamerTag: 'Spectre7', role: 'Captain', joinedAt: 'Sept 2026' }
    ]
  }
];

export const INITIAL_MATCHES: MatchFixture[] = [
  {
    id: 'match-1',
    round: 'Quarter-Final 1',
    teamA: INITIAL_TEAMS[0],
    teamB: INITIAL_TEAMS[5],
    scoreA: 2,
    scoreB: 1,
    status: 'live',
    scheduledTime: 'LIVE NOW (Map 3 Decider)',
    format: 'BO3',
    streamUrl: '#live-stream',
    votesA: 342,
    votesB: 189
  },
  {
    id: 'match-2',
    round: 'Quarter-Final 2',
    teamA: INITIAL_TEAMS[1],
    teamB: INITIAL_TEAMS[4],
    scoreA: 0,
    scoreB: 0,
    status: 'upcoming',
    scheduledTime: 'Today at 19:30 UTC',
    format: 'BO3',
    votesA: 280,
    votesB: 245
  },
  {
    id: 'match-3',
    round: 'Quarter-Final 3',
    teamA: INITIAL_TEAMS[2],
    teamB: INITIAL_TEAMS[6],
    scoreA: 0,
    scoreB: 0,
    status: 'upcoming',
    scheduledTime: 'Tomorrow at 16:00 UTC',
    format: 'BO3',
    votesA: 310,
    votesB: 115
  },
  {
    id: 'match-4',
    round: 'Round of 16',
    teamA: INITIAL_TEAMS[3],
    teamB: INITIAL_TEAMS[7],
    scoreA: 2,
    scoreB: 0,
    status: 'completed',
    scheduledTime: 'Yesterday',
    format: 'BO3',
    votesA: 420,
    votesB: 98
  }
];

export const PRIZE_TIERS: PrizeTier[] = [
  {
    place: '1st Place Champion',
    amount: '$125,000',
    reward: 'Grand Championship Trophy & MVP Ring',
    perks: [
      'Direct seed to World Masters 2026',
      'Exclusive in-game championship weapon skin',
      'Custom gold-plated physical team trophy',
      'Pro player media kit & contract bonuses'
    ],
    highlight: true,
    accent: 'gold'
  },
  {
    place: '2nd Place Runner-Up',
    amount: '$60,000',
    reward: 'Silver Laurels & Regional Masters Slot',
    perks: [
      'Regional Masters qualifying points (+500 pts)',
      'Custom silver commemorative plaques',
      'Official hardware sponsorship package'
    ],
    highlight: false,
    accent: 'silver'
  },
  {
    place: '3rd Place Bronze',
    amount: '$35,000',
    reward: 'Bronze Medallion & Wildcard Entry',
    perks: [
      'Regional Masters qualifying points (+300 pts)',
      'Gear bundle vouchers ($5,000 credit)',
      'Tournament VIP all-access passes'
    ],
    highlight: false,
    accent: 'bronze'
  },
  {
    place: '4th - 8th Place',
    amount: '$30,000 Total',
    reward: '$6,000 per team',
    perks: [
      'Participant digital crests',
      '+150 circuit points per squad'
    ],
    highlight: false,
    accent: 'cyan'
  }
];

export const BRACKET_DATA: BracketMatch[] = [
  {
    id: 'b-1',
    stage: 'Quarterfinal 1',
    team1: { name: 'Vortex Protocol', tag: 'VTX', score: 2, isWinner: true },
    team2: { name: 'Titan Vanguard', tag: 'TTN', score: 1, isWinner: false },
    status: 'live',
    time: 'Map 3 in progress'
  },
  {
    id: 'b-2',
    stage: 'Quarterfinal 2',
    team1: { name: 'Ghost Division', tag: 'GHOST' },
    team2: { name: 'Hydra Tactical', tag: 'HYD' },
    status: 'scheduled',
    time: 'Today 19:30 UTC'
  },
  {
    id: 'b-3',
    stage: 'Quarterfinal 3',
    team1: { name: 'Ronin Syndicate', tag: 'RONIN' },
    team2: { name: 'Cyber Samurai', tag: 'CYBR' },
    status: 'scheduled',
    time: 'Tomorrow 16:00 UTC'
  },
  {
    id: 'b-4',
    stage: 'Quarterfinal 4',
    team1: { name: 'Solaris Nova', tag: 'SLR', score: 2, isWinner: true },
    team2: { name: 'Apex Phantoms', tag: 'APX', score: 0, isWinner: false },
    status: 'completed',
    time: 'Completed'
  },
  {
    id: 'b-5',
    stage: 'Semifinal 1',
    team1: { name: 'Vortex Protocol', tag: 'VTX' },
    team2: { name: 'TBD (Winner QF2)', tag: 'TBD' },
    status: 'scheduled',
    time: 'Sat 18:00 UTC'
  },
  {
    id: 'b-6',
    stage: 'Semifinal 2',
    team1: { name: 'TBD (Winner QF3)', tag: 'TBD' },
    team2: { name: 'Solaris Nova', tag: 'SLR' },
    status: 'scheduled',
    time: 'Sat 21:00 UTC'
  },
  {
    id: 'b-7',
    stage: 'Grand Final',
    team1: { name: 'TBD (Semifinal 1)', tag: 'TBD' },
    team2: { name: 'TBD (Semifinal 2)', tag: 'TBD' },
    status: 'scheduled',
    time: 'Sun 20:00 UTC (BO5)'
  }
];

export const TOURNAMENT_RULES: TournamentRule[] = [
  {
    id: 'rule-1',
    title: 'Match Format & Map Veto',
    category: 'Gameplay',
    details: 'All group matches are Best of 3 (BO3), with the Grand Final played as Best of 5 (BO5). Standard competitive map ban/pick process will take place 30 minutes prior to match launch in the official tournament lobby.'
  },
  {
    id: 'rule-2',
    title: 'Hardware & Anti-Cheat Protocol',
    category: 'Integrity',
    details: 'All players must run the official kernel-level anti-cheat client. Discord streaming of active monitor displays may be requested by tournament referees at any point during active competition.'
  },
  {
    id: 'rule-3',
    title: 'Roster & Substitutes',
    category: 'Eligibility',
    details: 'Squads must consist of 5 active starting players and up to 2 registered substitutes. Substitute swaps must be submitted to match admins at least 15 minutes before map veto starts.'
  },
  {
    id: 'rule-4',
    title: 'Server Location & Ping Equality',
    category: 'Technical',
    details: 'Dedicated 128-tick tournament servers are provisioned across Central US, Frankfurt, Tokyo, and São Paulo. Server selection is determined by mutual lowest average ping delta.'
  }
];
