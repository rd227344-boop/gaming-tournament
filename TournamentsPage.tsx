import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Search,
  Filter,
  ArrowLeft,
  PlusCircle,
  Calendar,
  Users,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Flame,
  Shield,
  Crosshair,
  Target,
  Zap,
  Sword,
  Sparkles,
  RefreshCw,
  AlertCircle,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import { TournamentItem, User } from '../types';
import { COMPETITIVE_GAMES } from '../data/gamesData';

interface TournamentsPageProps {
  tournaments: TournamentItem[];
  isLoading: boolean;
  error: string | null;
  currentUser: User | null;
  initialGameFilter?: string;
  onBackToHome: () => void;
  onOpenCreateTournament: (preselectedGame?: string) => void;
  onGoToMyTournaments?: () => void;
  onViewDetails: (tournament: TournamentItem) => void;
  onOpenJoinTournament: (tournament: TournamentItem) => void;
  onPromptAuth: (actionName: string) => void;
  onRetryFetch?: () => void;
}

export const TournamentsPage: React.FC<TournamentsPageProps> = ({
  tournaments,
  isLoading,
  error,
  currentUser,
  initialGameFilter = 'all',
  onBackToHome,
  onOpenCreateTournament,
  onGoToMyTournaments,
  onViewDetails,
  onOpenJoinTournament,
  onPromptAuth,
  onRetryFetch,
}) => {
  // Game filter state: 'all' or game name (e.g. 'Free Fire', 'BGMI', 'Valorant', etc.)
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>(initialGameFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'registration' | 'live' | 'upcoming'>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  // List of game categories for filter chips
  const gameFilterOptions = useMemo(() => {
    return [
      { id: 'all', label: 'All Games', icon: <Trophy className="w-3.5 h-3.5 text-amber-400" /> },
      { id: 'Free Fire', label: 'Free Fire', icon: <Flame className="w-3.5 h-3.5 text-orange-400" /> },
      { id: 'BGMI', label: 'BGMI', icon: <Shield className="w-3.5 h-3.5 text-emerald-400" /> },
      { id: 'Valorant', label: 'Valorant', icon: <Crosshair className="w-3.5 h-3.5 text-rose-400" /> },
      { id: 'Counter-Strike 2', label: 'CS2', icon: <Target className="w-3.5 h-3.5 text-amber-400" /> },
      { id: 'Apex Legends', label: 'Apex Legends', icon: <Zap className="w-3.5 h-3.5 text-cyan-400" /> },
      { id: 'Call of Duty Mobile', label: 'COD Mobile', icon: <Trophy className="w-3.5 h-3.5 text-yellow-400" /> },
      { id: 'League of Legends', label: 'LoL', icon: <Sword className="w-3.5 h-3.5 text-blue-400" /> },
    ];
  }, []);

  // Helper to match game accurately
  const matchesGame = (tournamentGame: string, filterGame: string): boolean => {
    if (filterGame === 'all') return true;
    const tG = tournamentGame.toLowerCase().trim();
    const fG = filterGame.toLowerCase().trim();

    if (fG === 'counter-strike 2' || fG === 'cs2') {
      return tG.includes('counter-strike') || tG === 'cs2';
    }
    if (fG === 'free fire') {
      return tG.includes('free fire');
    }
    if (fG === 'call of duty mobile' || fG === 'cod mobile') {
      return tG.includes('cod') || tG.includes('duty');
    }
    if (fG === 'bgmi') {
      return tG === 'bgmi' || tG.includes('battlegrounds');
    }
    if (fG === 'league of legends' || fG === 'lol') {
      return tG.includes('league') || tG === 'lol';
    }
    return tG === fG || tG.includes(fG);
  };

  // Compute counts per game filter option
  const getGameCount = (filterId: string): number => {
    if (filterId === 'all') return tournaments.length;
    return tournaments.filter((t) => matchesGame(t.game, filterId)).length;
  };

  // Filtered tournaments based on game, search, status, and region
  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      // 1. Game filter
      if (selectedGameFilter !== 'all' && !matchesGame(t.game, selectedGameFilter)) {
        return false;
      }

      // 2. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesGameName = t.game.toLowerCase().includes(q);
        const matchesFormat = t.format.toLowerCase().includes(q);
        const matchesOrganizer = t.organizerName?.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesGameName && !matchesFormat && !matchesOrganizer && !matchesDesc) {
          return false;
        }
      }

      // 3. Status filter
      if (statusFilter !== 'all' && t.status !== statusFilter) {
        return false;
      }

      // 4. Region filter
      if (regionFilter !== 'all' && t.region !== regionFilter) {
        return false;
      }

      return true;
    });
  }, [tournaments, selectedGameFilter, searchQuery, statusFilter, regionFilter]);

  // Aggregate stats
  const totalPrizePool = useMemo(() => {
    return filteredTournaments.reduce((sum, t) => sum + (t.prizePool || 0), 0);
  }, [filteredTournaments]);

  const totalOpenSlots = useMemo(() => {
    return filteredTournaments.reduce((sum, t) => {
      const open = (t.slotsTotal || 32) - (t.slotsFilled || 0);
      return sum + Math.max(0, open);
    }, 0);
  }, [filteredTournaments]);

  // Reset all active filters
  const handleResetFilters = () => {
    setSelectedGameFilter('all');
    setSearchQuery('');
    setStatusFilter('all');
    setRegionFilter('all');
  };

  const hasActiveFilters =
    selectedGameFilter !== 'all' || searchQuery.trim() !== '' || statusFilter !== 'all' || regionFilter !== 'all';

  return (
    <div className="min-h-screen bg-[#070b14] text-[#e2e8f0] flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. Sticky Top Navigation Bar with Back button and small Create Tournament button */}
      <div className="sticky top-0 z-30 bg-[#070b14]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Back to Home Button & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="tournaments-back-home-btn"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-white text-xs sm:text-sm font-bold uppercase font-['Chakra_Petch'] tracking-wider transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
              <span>Home</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>/</span>
              <span className="text-emerald-400 font-bold font-['Chakra_Petch'] uppercase tracking-wider">
                Explore Tournaments
              </span>
            </div>
          </div>

          {/* Right: Small Create Tournament and My Tournaments buttons in the top corner */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {onGoToMyTournaments && (
              <button
                type="button"
                id="tournaments-page-my-tournaments-btn"
                onClick={onGoToMyTournaments}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-cyan-300 font-bold font-['Chakra_Petch'] uppercase tracking-wider text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
                title="View and edit saved tournament projects"
              >
                <span>My Tournaments</span>
              </button>
            )}

            <button
              type="button"
              id="top-corner-create-tournament-btn"
              onClick={() => {
                if (!currentUser) {
                  onPromptAuth('create a tournament');
                } else {
                  onOpenCreateTournament(selectedGameFilter !== 'all' ? selectedGameFilter : undefined);
                }
              }}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black font-['Chakra_Petch'] uppercase tracking-wider text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95 shrink-0"
              title="Organise a new tournament or scrimmage"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
              <span>Create Tournament</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Hero Header Banner for Tournaments Page */}
      <div className="relative overflow-hidden bg-slate-950 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[250px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-widest mb-3">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Esports Roster</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-['Chakra_Petch'] tracking-tight">
                Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">Tournaments</span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
                Discover verified championship cups, daily community scrims, and automated point tables across Free Fire, BGMI, Valorant, CS2, and more.
              </p>
            </div>

            {/* Quick Summary Badges */}
            <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
              <div className="bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 backdrop-blur-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Total Tournaments</span>
                <span className="text-white font-bold text-base sm:text-lg font-['Chakra_Petch']">
                  {filteredTournaments.length}
                </span>
              </div>
              <div className="bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 backdrop-blur-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Total Prize Pool</span>
                <span className="text-emerald-400 font-bold text-base sm:text-lg font-['Chakra_Petch']">
                  ₹{totalPrizePool.toLocaleString()}
                </span>
              </div>
              <div className="hidden sm:block bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 backdrop-blur-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Open Squad Slots</span>
                <span className="text-amber-400 font-bold text-base sm:text-lg font-['Chakra_Petch']">
                  {totalOpenSlots} Slots
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content: Game Filter Chips & Search/Filters Toolbar */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Game Filter Horizontal Pills */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filter by Competitive Game</span>
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
            {gameFilterOptions.map((opt) => {
              const isSelected = selectedGameFilter === opt.id;
              const count = getGameCount(opt.id);

              return (
                <button
                  key={opt.id}
                  type="button"
                  id={`filter-game-${opt.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedGameFilter(opt.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase font-['Chakra_Petch'] tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className={isSelected ? 'text-black' : ''}>{opt.icon}</span>
                  <span>{opt.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      isSelected ? 'bg-black/20 text-black font-black' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search, Status, and Region Filters Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 mb-8">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="tournaments-search-input"
              placeholder="Search tournaments by title, game, format, or rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-emerald-500 focus:outline-none text-white text-xs sm:text-sm placeholder-slate-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              id="tournaments-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              aria-label="Filter tournaments by status"
              className="w-full px-3.5 py-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-emerald-500 focus:outline-none text-slate-200 text-xs sm:text-sm font-mono cursor-pointer"
            >
              <option value="all">All Match Statuses</option>
              <option value="registration">Registration Open</option>
              <option value="live">Live Matches</option>
              <option value="upcoming">Upcoming Scrims</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="sm:col-span-3">
            <select
              id="tournaments-region-select"
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

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
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

        {/* Error Notification */}
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
              No Tournaments Found
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
              {hasActiveFilters
                ? 'No tournaments match your current search criteria or game filters. Try resetting the filters or choosing another category.'
                : 'No tournaments are currently listed. Be the first organizer to host an esports championship!'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono uppercase"
                >
                  Reset Filters
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    onPromptAuth('host a tournament');
                  } else {
                    onOpenCreateTournament(selectedGameFilter !== 'all' ? selectedGameFilter : undefined);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs font-['Chakra_Petch'] flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Host a Tournament</span>
              </button>
            </div>
          </div>
        )}

        {/* Tournaments Grid */}
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
                  className="group bg-[#0c1322] rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                >
                  {/* Top Gradient Banner */}
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${
                      tournament.bannerGradient || 'from-emerald-500 via-teal-600 to-slate-900'
                    }`}
                  />

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Status, Game & Region Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5">
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
                                ? 'Open'
                                : tournament.status === 'live'
                                ? 'Live'
                                : 'Upcoming'}
                            </span>
                          </span>

                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 font-bold">
                            {tournament.game}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{tournament.region || 'Global'}</span>
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

                      {/* Prize Pool & Entry Fee */}
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

                      {/* Slot Capacity Progress */}
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

                    {/* Action Buttons: View Details & Register Squad */}
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

                      {/* Register Squad Button (Guarded by login protection) */}
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
