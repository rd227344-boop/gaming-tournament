import React from 'react';
import { TournamentItem, User } from '../types';
import { Search, Trophy, Calendar, Gamepad2, Info, CheckCircle2, Globe, Swords, Flame, Shield } from 'lucide-react';

interface TournamentCardsSectionProps {
  tournaments: TournamentItem[];
  currentUser: User | null;
  selectedGame: string;
  onSelectGame: (game: string) => void;
  onViewDetails: (tournament: TournamentItem) => void;
  onOpenJoinTournament: (tournament: TournamentItem) => void;
  onPromptAuth: (actionName: string) => void;
}

export const TournamentCardsSection: React.FC<TournamentCardsSectionProps> = ({
  tournaments,
  currentUser,
  selectedGame,
  onSelectGame,
  onViewDetails,
  onOpenJoinTournament,
  onPromptAuth,
}) => {
  const [selectedStatus, setSelectedStatus] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const gameFilterList = [
    'All',
    'Free Fire',
    'BGMI',
    'Valorant',
    'Counter-Strike 2',
    'Apex Legends',
  ];

  const statuses = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Registration Open', value: 'registration' },
    { label: 'Upcoming', value: 'upcoming' },
  ];

  const filteredTournaments = tournaments.filter((t) => {
    const matchesGame =
      selectedGame === 'All' || t.game.toLowerCase() === selectedGame.toLowerCase();
    const matchesStatus =
      selectedStatus === 'All' || t.status === selectedStatus;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.region.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesGame && matchesStatus && matchesSearch;
  });

  const handleRegisterAction = (tournament: TournamentItem) => {
    if (!currentUser) {
      onPromptAuth(`register for ${tournament.title}`);
    } else {
      onOpenJoinTournament(tournament);
    }
  };

  const getStatusBadge = (status: TournamentItem['status']) => {
    switch (status) {
      case 'registration':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold uppercase tracking-wider font-mono">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Registration Open
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-950/90 text-amber-300 border border-amber-500/40 text-[11px] font-semibold uppercase tracking-wider font-mono">
            <Calendar className="w-3 h-3 text-amber-400" />
            Upcoming
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-700 text-[11px] font-semibold uppercase tracking-wider font-mono">
            Active
          </span>
        );
    }
  };

  const getGameIcon = (game: string) => {
    if (game.toLowerCase().includes('free fire')) {
      return <Flame className="w-3.5 h-3.5 text-orange-400 inline mr-1" />;
    }
    if (game.toLowerCase().includes('bgmi')) {
      return <Shield className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />;
    }
    return <Gamepad2 className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />;
  };

  return (
    <section id="tournaments" className="py-14 sm:py-20 bg-[#070b13] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2 font-mono">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Tournament Discovery</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-['Chakra_Petch'] tracking-tight">
                Available <span className="text-emerald-400">Tournaments</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                Browse official brackets and community scrims. Guests can freely inspect all tournament details, schedules, and rules.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
              Showing <strong className="text-emerald-400">{filteredTournaments.length}</strong> brackets
            </span>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-3 sm:p-4 mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 shadow-lg">
          {/* Game filter buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
            {gameFilterList.map((game) => (
              <button
                key={game}
                onClick={() => onSelectGame(game)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer font-['Chakra_Petch'] ${
                  selectedGame.toLowerCase() === game.toLowerCase()
                    ? 'bg-emerald-500 text-black font-extrabold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {game === 'Free Fire' && <Flame className="w-3 h-3 inline mr-1 text-orange-500" />}
                {game === 'BGMI' && <Shield className="w-3 h-3 inline mr-1 text-emerald-400" />}
                {game}
              </button>
            ))}
          </div>

          {/* Status selector & Search input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              id="tournament-status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            >
              {statuses.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-tournaments-input"
                type="text"
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Tournament Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <div
              key={tournament.id}
              id={`tournament-card-${tournament.id}`}
              className="bg-[#0b101d] border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-xl group"
            >
              <div>
                {/* Header Banner Strip */}
                <div
                  className={`h-22 bg-gradient-to-r ${tournament.bannerGradient} p-4 relative flex items-start justify-between`}
                >
                  <div className="absolute inset-0 bg-black/40" />

                  <div className="relative z-10 flex items-center gap-2">
                    {getStatusBadge(tournament.status)}
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-950/80 text-slate-300 border border-white/10 text-[10px] font-semibold uppercase font-mono">
                      <Globe className="w-3 h-3 text-slate-400" />
                      {tournament.region}
                    </span>
                  </div>
                </div>

                {/* Tournament Info Body */}
                <div className="p-5">
                  {/* Game & Format */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center">
                      {getGameIcon(tournament.game)}
                      {tournament.game}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {tournament.format}
                    </span>
                  </div>

                  {/* Tournament Title */}
                  <h3 className="text-lg font-bold text-white mb-2 font-['Chakra_Petch'] line-clamp-1 group-hover:text-emerald-300 transition-colors">
                    {tournament.title}
                  </h3>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Start Date: <strong className="text-slate-200">{tournament.startDate}</strong></span>
                  </div>

                  {/* Prize Pool Display if available */}
                  {tournament.prizePool > 0 ? (
                    <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 block font-mono leading-none">
                            Prize Pool
                          </span>
                          <span className="text-base font-black text-white font-['Chakra_Petch']">
                            {tournament.region === 'India'
                              ? `₹${tournament.prizePool.toLocaleString()} INR`
                              : `$${tournament.prizePool.toLocaleString()} USD`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block font-mono leading-none">
                          Entry
                        </span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {tournament.entryFee}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3 mb-4 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">Rewards</span>
                      <span className="text-emerald-400 font-bold font-mono">Trophy & Verified Title</span>
                    </div>
                  )}

                  {/* Slots Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Enrolled Squads</span>
                      <span>{tournament.slotsFilled} / {tournament.slotsTotal}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.round((tournament.slotsFilled / tournament.slotsTotal) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: View Details & Register */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
                {/* View Details Button (Available to guests without signup) */}
                <button
                  type="button"
                  id={`view-details-${tournament.id}`}
                  onClick={() => onViewDetails(tournament)}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-['Chakra_Petch']"
                >
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Details</span>
                </button>

                {/* Register Squad Button (Prompts auth if guest) */}
                <button
                  type="button"
                  id={`register-btn-${tournament.id}`}
                  onClick={() => handleRegisterAction(tournament)}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer font-['Chakra_Petch'] shadow-sm shadow-emerald-500/20 active:scale-98"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Search/Filter State */}
        {filteredTournaments.length === 0 && (
          <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
            <Gamepad2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-300 font-['Chakra_Petch'] text-base">No tournaments found matching the filters.</p>
            <p className="text-slate-500 text-xs mt-1">Try switching games or clearing your search term.</p>
            <button
              onClick={() => {
                onSelectGame('All');
                setSelectedStatus('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
