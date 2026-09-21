export interface User {
  id: string;
  gamerTag: string;
  email: string;
  role: 'player' | 'captain' | 'organizer';
  preferredGame: string;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM' | 'Global' | 'India';
  avatarColor: string;
  teamId?: string;
  teamName?: string;
  teamTag?: string;
  discord?: string;
  bio?: string;
}

export interface TeamMember {
  id: string;
  gamerTag: string;
  role: 'Captain' | 'Player' | 'Substitute';
  joinedAt: string;
  avatarColor?: string;
}

export interface PointTableRowData {
  id: string;
  teamName: string;
  rank: number;
  kills: number;
  placePoints?: number;
  totalPoints?: number;
}

export interface PointTableData {
  matchTitle: string;
  scoringSystem?: string;
  rows: PointTableRowData[];
}

export type TableStyleTheme =
  | 'titanium-dark'
  | 'neon-strike'
  | 'crimson-warlord'
  | 'champion-gold'
  | 'circuit-emerald'
  | 'vanguard-amethyst'
  | 'custom-gallery';

export interface PointTableStyleConfig {
  themeId: TableStyleTheme;
  name: string;
  primaryColor: string;
  accentColor: string;
  headerBg: string;
  rowBg: string;
  borderColor: string;
  customBgImage?: string;
  fontStyle?: 'chakra' | 'mono' | 'sans';
}

export interface TournamentItem {
  id: string;
  title: string;
  game: string;
  gameCategory: 'fps' | 'moba' | 'br' | 'sports' | 'fighting';
  bannerGradient: string;
  format: string; // e.g. "5v5 Double Elimination"
  prizePool: number;
  entryFee: string; // e.g. "Free Entry" or "$20 / Squad"
  status: 'registration' | 'live' | 'upcoming' | 'completed';
  startDate: string;
  region: 'Global' | 'NA' | 'EU' | 'APAC' | 'LATAM' | 'India';
  slotsTotal: number;
  slotsFilled: number;
  featured?: boolean;
  description?: string;
  organizerName?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  isSavedProject?: boolean;
  rules?: string[];
  registeredSquadNames?: string[];
  pointTable?: PointTableData;
  styleConfig?: PointTableStyleConfig;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  tag: string;
  type: 'squad' | 'solo';
  game: string;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM' | 'Global';
  avatarColor: string;
  ratingElo: number;
  wins: number;
  losses: number;
  winRate: number; // percentage
  earnings: string;
  streak: string; // e.g. "6W Streak"
  captainOrPlayer: string;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM';
  seed?: number;
  captain: string;
  logoColor: string;
  avatarIcon?: string;
  wins?: number;
  losses?: number;
  game?: string;
  members?: TeamMember[];
  openToJoin?: boolean;
  description?: string;
}

export interface MatchFixture {
  id: string;
  round: string;
  teamA: Team;
  teamB: Team;
  scoreA?: number;
  scoreB?: number;
  status: 'live' | 'upcoming' | 'completed';
  scheduledTime: string;
  format: 'BO1' | 'BO3' | 'BO5';
  streamUrl?: string;
  votesA: number;
  votesB: number;
  userVoted?: 'teamA' | 'teamB';
}

export interface PrizeTier {
  place: string;
  amount: string;
  reward: string;
  perks: string[];
  highlight?: boolean;
  accent: 'gold' | 'silver' | 'bronze' | 'cyan';
}

export interface BracketMatch {
  id: string;
  stage: string;
  team1: { name: string; tag: string; score?: number; isWinner?: boolean };
  team2: { name: string; tag: string; score?: number; isWinner?: boolean };
  status: 'completed' | 'live' | 'scheduled';
  time: string;
}

export interface TournamentRule {
  id: string;
  title: string;
  category: string;
  details: string;
}
