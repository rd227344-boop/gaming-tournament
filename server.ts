import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for server
interface ServerUser {
  id: string;
  gamerTag: string;
  email: string;
  role: 'player' | 'captain' | 'organizer';
  preferredGame: string;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM' | 'Global';
  avatarColor: string;
  teamId?: string;
  teamName?: string;
  teamTag?: string;
  discord?: string;
  bio?: string;
}

const users: ServerUser[] = [
  {
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
    bio: 'Captain & IGL of Vortex Protocol.'
  },
  {
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
  {
    id: 'usr-organizer',
    gamerTag: 'ApexOrganizer',
    email: 'admin@proarena.gg',
    role: 'organizer',
    preferredGame: 'Counter-Strike 2',
    region: 'Global',
    avatarColor: 'from-emerald-500 to-teal-600',
    discord: 'AdminOrg#0001',
    bio: 'Official Esports Tournament Host.'
  }
];

interface ServerTournament {
  id: string;
  title: string;
  game: string;
  gameCategory: 'fps' | 'moba' | 'br' | 'sports' | 'fighting';
  bannerGradient: string;
  format: string;
  prizePool: number;
  entryFee: string;
  status: string;
  startDate: string;
  region: string;
  slotsTotal: number;
  slotsFilled: number;
  featured?: boolean;
  description?: string;
  organizerName: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  isSavedProject?: boolean;
  rules?: string[];
  registeredSquadNames?: string[];
  pointTable?: {
    matchTitle: string;
    scoringSystem?: string;
    rows: Array<{
      id: string;
      teamName: string;
      rank: number;
      kills: number;
      placePoints?: number;
      totalPoints?: number;
    }>;
  };
  styleConfig?: any;
}

let tournaments: ServerTournament[] = [
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
    status: 'live',
    startDate: 'Active Now',
    region: 'Global',
    slotsTotal: 64,
    slotsFilled: 64,
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
    description: 'Competitive MR12 showdown for North American CS2 squads. Official Valve active duty map pool, automated overtime with $10,000 starting cash, and dedicated low-latency nodes.',
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
    description: '6-round trio Battle Royale with standard match point format. Teams earn placement points plus 1 point per confirmed squad elimination.',
    organizerName: 'ALGS Circuit Command',
    rules: [
      '3-player squad rosters with up to 1 emergency substitute.',
      '1 kill = 1 tournament point. Match Point threshold at 50 pts.'
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
    description: 'Summoners Rift competitive bracket featuring Tournament Draft mode on current active patch.',
    organizerName: 'EU Masters League',
    rules: [
      'Tournament Draft mode with Fearless draft rules in BO3 deciders.',
      'All players must be Diamond 2 or higher.'
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
    description: 'Fast-paced 3v3 aerial soccar championship. Standard 5-minute regulation, infinite sudden-death overtime.',
    organizerName: 'APAC Soccar Series',
    rules: ['Best of 5 games throughout bracket; Grand Finals Best of 7.'],
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
    description: 'Close-quarters tactical demolition combat under official esports rules: 12 rounds, role swaps after 6 rounds, 4 operator bans.',
    organizerName: 'LATAM Siege League',
    rules: ['Standard 4-operator ban phase (2 Attackers, 2 Defenders).'],
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

let teams = [
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
    description: 'Premier tier-1 Valorant squad competing in Masters & NA Open circuits.',
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
    description: 'Disciplined European CS2 & Apex squad.',
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
    description: 'Reigning APAC Champions.',
    members: [
      { id: 'm-8', gamerTag: 'Kenji99', role: 'Captain', joinedAt: 'May 2026' },
      { id: 'm-9', gamerTag: 'NinjaRecon', role: 'Player', joinedAt: 'May 2026' }
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
    description: 'Aggressive LATAM contender with high duelist combat ratings.',
    members: [
      { id: 'm-11', gamerTag: 'FuegoKing', role: 'Captain', joinedAt: 'June 2026' }
    ]
  }
];

// Auth middleware helper
function getAuthenticatedUser(req: express.Request): ServerUser | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;

  const found = users.find((u) => u.id === token || u.email === token || u.gamerTag === token);
  if (found) return found;

  // Fallback: If token looks like custom user id, synthesize user
  if (token.startsWith('usr-')) {
    return {
      id: token,
      gamerTag: 'Gamer_' + token.slice(-4),
      email: `${token}@gamer.pro`,
      role: 'player',
      preferredGame: 'Valorant',
      region: 'NA',
      avatarColor: 'from-emerald-500 to-teal-600'
    };
  }
  return null;
}

// ----------------- API ROUTES ----------------- //

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AUTH: Sign Up
app.post('/api/auth/signup', (req, res) => {
  const { gamerTag, email, preferredGame, region, role, discord } = req.body;
  if (!gamerTag || !email) {
    return res.status(400).json({ error: 'Gamer Tag and Email are required.' });
  }

  const existing = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() || u.gamerTag.toLowerCase() === gamerTag.toLowerCase()
  );
  if (existing) {
    return res.status(200).json({ user: existing, message: 'Account already exists, logged in.' });
  }

  const newUser: ServerUser = {
    id: 'usr-' + Date.now().toString(36),
    gamerTag: gamerTag.trim(),
    email: email.trim().toLowerCase(),
    role: role || 'player',
    preferredGame: preferredGame || 'Valorant',
    region: region || 'Global',
    avatarColor: 'from-emerald-500 to-teal-600',
    discord: discord || ''
  };

  users.push(newUser);
  res.status(201).json({ user: newUser, token: newUser.id });
});

// AUTH: Login
app.post('/api/auth/login', (req, res) => {
  const { emailOrTag } = req.body;
  if (!emailOrTag) {
    return res.status(400).json({ error: 'Email or Gamer Tag is required.' });
  }

  const clean = emailOrTag.trim().toLowerCase();
  const matched = users.find(
    (u) => u.email.toLowerCase() === clean || u.gamerTag.toLowerCase() === clean
  );

  if (matched) {
    return res.json({ user: matched, token: matched.id });
  }

  // Create active session if not found
  const newUser: ServerUser = {
    id: 'usr-' + Date.now().toString(36),
    gamerTag: clean.includes('@') ? clean.split('@')[0] : clean,
    email: clean.includes('@') ? clean : `${clean}@gamer.pro`,
    role: 'player',
    preferredGame: 'Valorant',
    region: 'NA',
    avatarColor: 'from-emerald-500 to-teal-600'
  };
  users.push(newUser);
  res.json({ user: newUser, token: newUser.id });
});

// AUTH: Current User
app.get('/api/auth/me', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.json({ user: null, isGuest: true });
  }
  res.json({ user, isGuest: false });
});

// AUTH: Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

// TOURNAMENTS: List & Filter (Accessible by Guests & Logged-In)
app.get('/api/tournaments', (req, res) => {
  const { search, game, status } = req.query;
  let results = [...tournaments];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.game.toLowerCase().includes(q) ||
        t.format.toLowerCase().includes(q)
    );
  }

  if (game && typeof game === 'string' && game !== 'all') {
    results = results.filter((t) => t.game.toLowerCase() === game.toLowerCase());
  }

  if (status && typeof status === 'string' && status !== 'all') {
    results = results.filter((t) => t.status === status);
  }

  res.json(results);
});

// TOURNAMENTS: Get Single (Accessible by Guests & Logged-In)
app.get('/api/tournaments/:id', (req, res) => {
  const item = tournaments.find((t) => t.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Tournament not found.' });
  }
  res.json(item);
});

// TOURNAMENTS: My Tournaments (RESTRICTED: Logged-in user's own tournaments and saved projects)
app.get('/api/my-tournaments', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({
      error: 'Authentication required: Please log in to access My Tournaments.'
    });
  }

  // Filter tournaments created by this user or hosted by their gamerTag
  const myItems = tournaments.filter(
    (t) =>
      t.createdBy === user.id ||
      (t.organizerName && t.organizerName.toLowerCase() === user.gamerTag.toLowerCase())
  );

  res.json(myItems);
});

// TOURNAMENTS: Create or Save Tournament / Point Table (RESTRICTED: Logged-in users only)
app.post('/api/tournaments', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({
      error: 'Access Denied: Guests cannot create or save tournaments. Please log in or sign up.'
    });
  }

  const {
    id: customId,
    title,
    game,
    format,
    prizePool,
    entryFee,
    region,
    slotsTotal,
    description,
    rules,
    pointTable,
    styleConfig,
    isSavedProject,
    status,
    registeredSquadNames
  } = req.body;

  if (!title || !game) {
    return res.status(400).json({ error: 'Tournament title and game title are required.' });
  }

  const newTourn: ServerTournament = {
    id: customId || 'tourn-' + Date.now().toString(36),
    title: title.trim(),
    game: game.trim(),
    gameCategory: (req.body.gameCategory || 'br') as any,
    bannerGradient: req.body.bannerGradient || 'from-indigo-600 via-purple-700 to-slate-950',
    format: format || '12 Squads Battle Royale (6 Matches)',
    prizePool: Number(prizePool) || 0,
    entryFee: entryFee || 'Free Entry',
    status: status || 'registration',
    startDate: req.body.startDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    region: region || 'Global',
    slotsTotal: Number(slotsTotal) || 32,
    slotsFilled: 1,
    featured: false,
    description: description || `Competitive ${game} esports tournament managed by ${user.gamerTag}.`,
    organizerName: user.gamerTag,
    createdBy: user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isSavedProject: isSavedProject !== undefined ? Boolean(isSavedProject) : true,
    rules: rules || ['Standard competitive rules apply.', '128-tick verified servers.'],
    registeredSquadNames: registeredSquadNames || [user.teamName || `${user.gamerTag}'s Squad`],
    pointTable: pointTable || undefined,
    styleConfig: styleConfig || undefined
  };

  // If tournament with this ID already exists, update it instead of duplicating
  const existingIdx = tournaments.findIndex((t) => t.id === newTourn.id);
  if (existingIdx !== -1) {
    const existing = tournaments[existingIdx];
    if (existing.createdBy && existing.createdBy !== user.id && existing.organizerName.toLowerCase() !== user.gamerTag.toLowerCase()) {
      return res.status(403).json({ error: 'You do not have permission to overwrite this tournament.' });
    }
    tournaments[existingIdx] = { ...existing, ...newTourn, updatedAt: new Date().toISOString() };
    return res.json(tournaments[existingIdx]);
  }

  tournaments.unshift(newTourn);
  res.status(201).json(newTourn);
});

// TOURNAMENTS: Update / Edit Tournament (RESTRICTED: Logged-in user ownership verified)
app.put('/api/tournaments/:id', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({
      error: 'Authentication required: Please log in to edit tournaments.'
    });
  }

  const targetId = req.params.id;
  const idx = tournaments.findIndex((t) => t.id === targetId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Tournament not found.' });
  }

  const current = tournaments[idx];
  const isOwner =
    current.createdBy === user.id ||
    current.organizerName?.toLowerCase() === user.gamerTag.toLowerCase() ||
    user.role === 'organizer';

  if (!isOwner) {
    return res.status(403).json({
      error: 'Access Forbidden: You are not authorized to edit this tournament.'
    });
  }

  const {
    title,
    game,
    format,
    prizePool,
    entryFee,
    status,
    region,
    slotsTotal,
    slotsFilled,
    description,
    rules,
    pointTable,
    styleConfig,
    registeredSquadNames
  } = req.body;

  const updated: ServerTournament = {
    ...current,
    title: title !== undefined ? title.trim() : current.title,
    game: game !== undefined ? game.trim() : current.game,
    format: format !== undefined ? format : current.format,
    prizePool: prizePool !== undefined ? Number(prizePool) : current.prizePool,
    entryFee: entryFee !== undefined ? entryFee : current.entryFee,
    status: status !== undefined ? status : current.status,
    region: region !== undefined ? region : current.region,
    slotsTotal: slotsTotal !== undefined ? Number(slotsTotal) : current.slotsTotal,
    slotsFilled: slotsFilled !== undefined ? Number(slotsFilled) : current.slotsFilled,
    description: description !== undefined ? description : current.description,
    rules: rules !== undefined ? rules : current.rules,
    pointTable: pointTable !== undefined ? pointTable : current.pointTable,
    styleConfig: styleConfig !== undefined ? styleConfig : current.styleConfig,
    registeredSquadNames: registeredSquadNames !== undefined ? registeredSquadNames : current.registeredSquadNames,
    updatedAt: new Date().toISOString()
  };

  tournaments[idx] = updated;
  res.json(updated);
});

// TOURNAMENTS: Delete Tournament (RESTRICTED: Logged-in user ownership verified)
app.delete('/api/tournaments/:id', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({
      error: 'Authentication required: Please log in to delete tournaments.'
    });
  }

  const targetId = req.params.id;
  const idx = tournaments.findIndex((t) => t.id === targetId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Tournament not found.' });
  }

  const current = tournaments[idx];
  const isOwner =
    current.createdBy === user.id ||
    current.organizerName?.toLowerCase() === user.gamerTag.toLowerCase() ||
    user.role === 'organizer';

  if (!isOwner) {
    return res.status(403).json({
      error: 'Access Forbidden: You are not authorized to delete this tournament.'
    });
  }

  const [removed] = tournaments.splice(idx, 1);
  res.json({
    success: true,
    message: `Tournament "${removed.title}" deleted successfully.`,
    id: removed.id
  });
});

// TOURNAMENTS: Register / Join (RESTRICTED: Logged-in users only, Guests cannot register)
app.post('/api/tournaments/:id/join', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({
      error: 'Access Denied: Guests cannot register for tournaments. Please log in or sign up with your squad.'
    });
  }

  const tourn = tournaments.find((t) => t.id === req.params.id);
  if (!tourn) {
    return res.status(404).json({ error: 'Tournament not found.' });
  }

  if (tourn.slotsFilled >= tourn.slotsTotal) {
    return res.status(400).json({ error: 'Tournament bracket is already full.' });
  }

  const squadName = req.body.squadName || user.teamName || `${user.gamerTag}'s Squad`;
  tourn.slotsFilled = Math.min(tourn.slotsTotal, tourn.slotsFilled + 1);

  if (!tourn.registeredSquadNames) tourn.registeredSquadNames = [];
  if (!tourn.registeredSquadNames.includes(squadName)) {
    tourn.registeredSquadNames.push(squadName);
  }

  res.json(tourn);
});

// TEAMS: List (Accessible by Guests)
app.get('/api/teams', (req, res) => {
  res.json(teams);
});

// TEAMS: Create (RESTRICTED: Logged-in users only, Guests cannot create)
app.post('/api/teams', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({
      error: 'Access Denied: Guests cannot create teams. Please log in or sign up to establish a squad.'
    });
  }

  const { name, tag, region, game, description } = req.body;
  if (!name || !tag) {
    return res.status(400).json({ error: 'Squad Name and Tag are required.' });
  }

  const newTeam = {
    id: 'team-' + Date.now().toString(36),
    name: name.trim(),
    tag: tag.trim().toUpperCase(),
    region: region || 'NA',
    game: game || 'Valorant',
    description: description || `Competitive ${game} squad established by ${user.gamerTag}.`,
    captain: user.gamerTag,
    logoColor: 'from-emerald-500 to-teal-600',
    seed: teams.length + 1,
    openToJoin: true,
    wins: 0,
    losses: 0,
    members: [
      {
        id: 'tm-' + Date.now().toString(36),
        gamerTag: user.gamerTag,
        role: 'Captain' as const,
        joinedAt: 'Just now'
      }
    ]
  };

  teams.unshift(newTeam);

  // Update user with team info
  user.teamId = newTeam.id;
  user.teamName = newTeam.name;
  user.teamTag = newTeam.tag;
  user.role = 'captain';

  res.status(201).json(newTeam);
});

// TEAMS: Join (RESTRICTED: Logged-in users only, Guests cannot join)
app.post('/api/teams/:id/join', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({
      error: 'Access Denied: Guests cannot join teams. Please log in or sign up first.'
    });
  }

  const team = teams.find((t) => t.id === req.params.id);
  if (!team) {
    return res.status(404).json({ error: 'Team not found.' });
  }

  const existingMember = team.members.find(
    (m) => m.gamerTag.toLowerCase() === user.gamerTag.toLowerCase()
  );
  if (existingMember) {
    return res.status(400).json({ error: 'You are already registered on this team roster.' });
  }

  team.members.push({
    id: 'tm-' + Date.now().toString(36),
    gamerTag: user.gamerTag,
    role: 'Player',
    joinedAt: 'Just now'
  });

  user.teamId = team.id;
  user.teamName = team.name;
  user.teamTag = team.tag;

  res.json(team);
});

// LEADERBOARD: Standings (Accessible by Guests & Logged-In)
app.get('/api/leaderboard', (req, res) => {
  res.json({
    squads: [
      { rank: 1, name: 'Vortex Protocol', tag: 'VTX', elo: 3240, wins: 14, losses: 2, earnings: '$120,000' },
      { rank: 2, name: 'Ghost Division', tag: 'GHOST', elo: 3180, wins: 13, losses: 3, earnings: '$85,000' },
      { rank: 3, name: 'Ronin Syndicate', tag: 'RONIN', elo: 3050, wins: 12, losses: 4, earnings: '$64,000' },
      { rank: 4, name: 'Solaris Nova', tag: 'SLR', elo: 2980, wins: 11, losses: 5, earnings: '$42,000' }
    ]
  });
});

// ----------------- VITE MIDDLEWARE SETUP ----------------- //

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gaming Tournament Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
