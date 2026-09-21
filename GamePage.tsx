import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  Trophy,
  Calendar,
  Users,
  DollarSign,
  Shield,
  PlusCircle,
  Table,
  CheckCircle2,
  ExternalLink,
  Flame,
  Smartphone,
  Monitor,
  AlertCircle,
  RefreshCw,
  Sparkles,
  MapPin
} from 'lucide-react';
import { GameInfo } from '../data/gamesData';
import { TournamentItem, User } from '../types';

interface GamePageProps {
  game: GameInfo;
  tournaments: TournamentItem[];
  isLoading: boolean;
  error: string | null;
  currentUser: User | null;
  onBackToHome: () => void;
  onOpenCreateTournament: (preselectedGame?: string, defaultPurpose?: 'point-table' | 'tournament') => void;
  onViewDetails: (tournament: TournamentItem) => void;
  onOpenJoinTournament: (tournament: TournamentItem) => void;
  onPromptAuth: (actionName: string) => void;
  onRetryFetch?: () => void;
}

export const GamePage: React.FC<GamePageProps> = ({
  game,
  tournaments,
  isLoading,
  error,
  currentUser,
  onBackToHome,
  onOpenCreateTournament,
  onViewDetails,
  onOpenJoinTournament,
  onPromptAuth,
  onRetryFetch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'registration' | 'live' | 'upcoming'>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  // Filter tournaments matching this game
  const gameTournaments = useMemo(() => {
    const cleanGameName = game.name.toLowerCase().trim();
    return tournaments.filter((t) => {
      const tGame = t.game.toLowerCase().trim();
      return (
        tGame === cleanGameName ||
        (cleanGameName === 'counter-strike 2' && (tGame === 'cs2' || tGame.includes('counter-strike'))) ||
        (cleanGameName === 'free fire' && tGame.includes('free fire')) ||
        (cleanGameName === 'call of duty mobile' && (tGame.includes('cod') || tGame.includes('duty'))) ||
        (cleanGameName === 'bgmi' && (tGame === 'bgmi' || tGame.includes('battlegrounds')))
      );
    });
  }, [tournaments, game.name]);

  // Apply search query and filters
  const filteredTournaments = useMemo(() => {
    return gameTournaments.filter((t) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesFormat = t.format.toLowerCase().includes(q);
        const matchesOrganizer = t.organizerName?.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesFormat && !matchesOrganizer && !matchesDesc) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && t.status !== statusFilter) {
        return false;
      }

      // Region filter
      if (regionFilter !== 'all' && t.region !== regionFilter) {
        return false;
      }

      return true;
    });
  }, [gameTournaments, searchQuery, statusFilter, regionFilter]);

  // Unique regions in this game's tournaments
  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    gameTournaments.forEach((t) => {
      if (t.region) set.add(t.region);
    });
    return Array.from(set);
  }, [gameTournaments]);

  // Calculate total prize pool for this game
  const totalPrizePool = useMemo(() => {
    return gameTournaments.reduce((sum, t) => sum + (t.prizePool || 0), 0);
  }, [gameTournaments]);

  return (
    <div className="min-h-screen bg-[#070b14] text-[#e2e8f0] flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. Top Navigation Bar with Back to Home Button */}
      <div className="sticky top-0 z-30 bg-[#070b14]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            id="back-to-home-btn"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-white text-xs sm:text-sm font-black uppercase font-['Chakra_Petch'] tracking-wider transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          {/* Breadcrumb Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="hover:text-slate-200 cursor-pointer" onClick={onBackToHome}>Home</span>
            <span>/</span>
            <span className="text-slate-500">Games</span>
            <span>/</span>
            <span className="text-emerald-400 font-bold font-['Chakra_Petch'] uppercase">{game.name}</span>
          </div>

          {/* Active stats badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{gameTournaments.length} Active Tournaments</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Cinematic Game Header with Hero Banner */}
      <div className="relative overflow-hidden bg-slate-950 border-b border-slate-800">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={game.imageUrl}
            alt={game.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-40 saturate-120"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-[#070b14]/90 to-[#070b14]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent" />
        </div>

        {/* Ambient Top Glow */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${game.accentColor} relative z-10`} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="max-w-3xl">
            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg ${game.badgeBg} border ${game.badgeBorder} ${game.badgeText} text-xs font-mono font-bold uppercase tracking-wider`}>
                <Shield className="w-3.5 h-3.5" />
                <span>{game.category}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-mono">
                {game.platform.includes('Mobile') ? (
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Monitor className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{game.platform}</span>
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 text-xs font-mono uppercase">
                {game.developer}
              </span>
            </div>

            {/* Game Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white font-['Chakra_Petch'] tracking-tight mb-4">
              {game.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Arena</span>
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              {game.description}
            </p>

            {/* Key Feature Badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {game.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-mono"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </span>
              ))}
            </div>

            {/* Required Action Buttons: Create Tournament, Normal Point Table, Organise Tournament */}
            <div className="flex flex-wrap items-center gap-3.5">
              {/* Option 1: Create Tournament */}
              <button
                type="button"
                id="game-page-create-tournament-btn"
                onClick={() => {
                  if (!currentUser) {
                    onPromptAuth(`create a ${game.name} tournament`);
                  } else {
                    onOpenCreateTournament(game.name);
                  }
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black font-['Chakra_Petch'] uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-black" />
                <span>Create Tournament</span>
              </button>

              {/* Option 2: Normal Point Table */}
              <button
                type="button"
                id="game-page-point-table-btn"
                onClick={() => {
                  if (!currentUser) {
                    onPromptAuth(`generate a ${game.name} point table`);
                  } else {
                    onOpenCreateTournament(game.name, 'point-table');
                  }
                }}
                className="px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-amber-300 hover:text-amber-200 font-bold font-['Chakra_Petch'] uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <Table className="w-4 h-4 text-amber-400" />
                <span>Normal Point Table</span>
              </button>

              {/* Option 3: Organise Tournament */}
              <button
                type="button"
                id="game-page-organise-tournament-btn"
                onClick={() => {
                  if (!currentUser) {
                    onPromptAuth(`organise a ${game.name} tournament`);
                  } else {
                    onOpenCreateTournament(game.name, 'tournament');
                  }
                }}
                className="px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-400 text-slate-200 hover:text-white font-bold font-['Chakra_Petch'] uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>Organise Tournament</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tournament Discovery Section for this Game */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Section Header and Search/Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-['Chakra_Petch'] tracking-wide flex items-center gap-2.5">
                <Trophy className="w-6 h-6 text-emerald-400" />
                <span>Available {game.name} Tournaments</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Real-time competitive scrims, verified brackets, and championship cups for {game.name}.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Matching Tournaments</span>
                <span className="text-white font-bold text-sm font-['Chakra_Petch']">{filteredTournaments.length}</span>
              </div>
              <div className="bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Total Prize Pool</span>
                <span className="text-emerald-400 font-bold text-sm font-['Chakra_Petch']">₹{totalPrizePool.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Search and Filters Toolbar */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                id="search-tournaments-input"
                placeholder={`Search ${game.name} tournaments by title, format, or rules...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-emerald-500 focus:outline-none text-white text-xs sm:text-sm placeholder-slate-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                id="filter-status-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                aria-label="Filter tournaments by status"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-emerald-500 focus:outline-none text-slate-200 text-xs sm:text-sm font-mono cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="registration">Registration Open</option>
                <option value="live">Live Matches</option>
                <option value="upcoming">Upcoming Scrims</option>
              </select>
            </div>

            {/* Region Filter */}
            <div className="sm:col-span-3">
              <select
                id="filter-region-select"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                aria-label="Filter tournaments by region"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-emerald-500 focus:outline-none text-slate-200 text-xs sm:text-sm font-mono cursor-pointer"
              >
                <option value="all">All Regions</option>
                <option value="India">India</option>
                <option value="Global">Global</option>
                <option value="NA">North America</option>
                <option value="EU">Europe</option>
                <option value="APAC">Asia Pacific</option>
                <option value="LATAM">Latin America</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 animate-pulse space-y-4"
              >
                <div className="h-5 bg-slate-800 rounded w-1/3" />
                <div className="h-7 bg-slate-800 rounded w-4/5" />
                <div className="h-16 bg-slate-800/60 rounded w-full" />
                <div className="h-10 bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-red-950/30 border border-red-500/40 rounded-2xl p-8 text-center max-w-lg mx-auto my-8">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white font-['Chakra_Petch']">Unable to Load Tournaments</h3>
            <p className="text-xs text-red-300 mt-1 mb-4">{error}</p>
            {onRetryFetch && (
              <button
                type="button"
                onClick={onRetryFetch}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono uppercase"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredTournaments.length === 0 && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-10 sm:p-14 text-center max-w-xl mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Trophy className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-['Chakra_Petch'] uppercase tracking-wide">
              No {game.name} Tournaments Found
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
              {searchQuery || statusFilter !== 'all' || regionFilter !== 'all'
                ? 'No tournaments match your current filters. Try resetting search parameters or selecting all statuses.'
                : `Be the first community leader or organizer to host an official tournament or point table for ${game.name}!`}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              {(searchQuery || statusFilter !== 'all' || regionFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setRegionFilter('all');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono uppercase"
                >
                  Reset Filters
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    onPromptAuth(`host the first ${game.name} tournament`);
                  } else {
                    onOpenCreateTournament(game.name);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs font-['Chakra_Petch'] flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Host First {game.name} Tournament</span>
              </button>
            </div>
          </div>
        )}

        {/* Real Tournament Cards Grid */}
        {!isLoading && !error && filteredTournaments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => {
              const slotsFilled = tournament.slotsFilled || 0;
              const slotsTotal = tournament.slotsTotal || 32;
              const percentFilled = Math.min(100, Math.round((slotsFilled / slotsTotal) * 100));

              return (
                <div
                  key={tournament.id}
                  id={`tournament-card-${tournament.id}`}
                  className="group bg-[#0c1322] rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-2xl"
                >
                  {/* Top Gradient Stripe */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${tournament.bannerGradient || game.accentColor}`} />

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Top Badges: Status & Region */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase ${
                              tournament.status === 'registration'
                                ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                                : tournament.status === 'live'
                                ? 'bg-red-950/80 border border-red-500/40 text-red-400'
                                : 'bg-amber-950/80 border border-amber-500/40 text-amber-400'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                tournament.status === 'registration'
                                  ? 'bg-emerald-400 animate-pulse'
                                  : tournament.status === 'live'
                                  ? 'bg-red-400 animate-ping'
                                  : 'bg-amber-400'
                              }`}
                            />
                            <span>
                              {tournament.status === 'registration'
                                ? 'Registration Open'
                                : tournament.status === 'live'
                                ? 'Matches Live'
                                : 'Upcoming Scrim'}
                            </span>
                          </span>

                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{tournament.region || 'Global'}</span>
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 truncate max-w-[120px]">
                          {tournament.organizerName || 'Verified Org'}
                        </span>
                      </div>

                      {/* Tournament Title */}
                      <h3 className="text-xl font-black text-white font-['Chakra_Petch'] tracking-wide uppercase mb-2 group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {tournament.title}
                      </h3>

                      {/* Format and Schedule */}
                      <div className="space-y-1.5 mb-4 text-xs font-mono text-slate-300">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{tournament.format}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Starts: {tournament.startDate}</span>
                        </div>
                      </div>

                      {/* Prize Pool & Entry Fee Matrix */}
                      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 mb-4 text-xs">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase block">Prize Pool</span>
                          <span className="text-emerald-400 font-bold font-['Chakra_Petch'] text-sm">
                            ₹{tournament.prizePool ? tournament.prizePool.toLocaleString() : 'Community Trophy'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase block">Entry Fee</span>
                          <span className="text-slate-200 font-bold font-['Chakra_Petch'] text-sm">
                            {tournament.entryFee || 'Free Entry'}
                          </span>
                        </div>
                      </div>

                      {/* Slot Capacity Progress Bar */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span>Squad Slots</span>
                          </span>
                          <span className="text-slate-200 font-bold">
                            {slotsFilled} / {slotsTotal} ({percentFilled}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              percentFilled >= 90
                                ? 'bg-red-500'
                                : percentFilled >= 70
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            }`}
                            style={{ width: `${percentFilled}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: View Details & Register */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                      {/* View Details Button (Open to guests without login!) */}
                      <button
                        type="button"
                        id={`view-details-btn-${tournament.id}`}
                        onClick={() => onViewDetails(tournament)}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white font-bold text-xs uppercase font-['Chakra_Petch'] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>

                      {/* Register Squad Button (Guarded by promptAuth) */}
                      <button
                        type="button"
                        id={`register-squad-btn-${tournament.id}`}
                        onClick={() => {
                          if (!currentUser) {
                            onPromptAuth(`register for ${tournament.title}`);
                          } else {
                            onOpenJoinTournament(tournament);
                          }
                        }}
                        className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase font-['Chakra_Petch'] flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                        <span>Register Squad</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
