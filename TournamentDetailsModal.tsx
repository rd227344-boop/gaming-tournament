import React, { useState } from 'react';
import { TournamentItem, User } from '../types';
import {
  X,
  Trophy,
  Calendar,
  Users,
  ShieldCheck,
  Globe,
  DollarSign,
  AlertCircle,
  LogIn,
  CheckCircle2,
  Share2,
  FileText,
  Swords
} from 'lucide-react';

interface TournamentDetailsModalProps {
  tournament: TournamentItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onRegisterClick: (tournament: TournamentItem) => void;
  onPromptAuth: () => void;
}

export const TournamentDetailsModal: React.FC<TournamentDetailsModalProps> = ({
  tournament,
  isOpen,
  onClose,
  currentUser,
  onRegisterClick,
  onPromptAuth,
}) => {
  const [activeTab, setActiveTab] = useState<
  'overview' | 'rules' | 'squads' | 'prizes' | 'pointTable'
>('overview');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !tournament) return null;

  const isFull = tournament.slotsFilled >= tournament.slotsTotal;
  const isRegistered =
    currentUser?.teamName &&
    tournament.registeredSquadNames?.includes(currentUser.teamName);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="tournament-details-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="tournament-details-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#0a0f1d] border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 my-8"
      >
        {/* Banner Header with Gradient */}
        <div className={`relative p-6 sm:p-8 bg-gradient-to-r ${tournament.bannerGradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
          
          {/* Top Controls */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                {tournament.game}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-slate-200 text-xs font-mono font-bold flex items-center gap-1">
                <Globe className="w-3 h-3 text-cyan-400" /> {tournament.region}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-lg bg-black/50 hover:bg-black/70 border border-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copy Tournament Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg bg-black/50 hover:bg-black/70 border border-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {copied && (
            <div className="relative z-10 text-xs font-mono text-emerald-300 bg-black/70 px-3 py-1 rounded-md inline-block mb-2">
              Link copied to clipboard!
            </div>
          )}

          {/* Title & Stats */}
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black font-['Chakra_Petch'] text-white tracking-wide leading-tight">
              {tournament.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
              <span>Hosted by <strong className="text-white">{tournament.organizerName || 'Pro Arena Circuit'}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{tournament.entryFee}</span>
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="relative z-10 grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/15">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-300">Prize Purse</div>
              <div className="text-base sm:text-lg font-black font-['Chakra_Petch'] text-amber-300">
                ${tournament.prizePool.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-300">Format</div>
              <div className="text-xs sm:text-sm font-bold text-white truncate">
                {tournament.format}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-300">Slots Filled</div>
              <div className="text-xs sm:text-sm font-bold text-cyan-300">
                {tournament.slotsFilled} / {tournament.slotsTotal} Squads
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-[#070b13] px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold font-['Chakra_Petch'] uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold font-['Chakra_Petch'] uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'rules'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Rules & Integrity
          </button>
          <button
            onClick={() => setActiveTab('squads')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold font-['Chakra_Petch'] uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'squads'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Squads ({tournament.registeredSquadNames?.length || tournament.slotsFilled})
          </button>
          <button
            onClick={() => setActiveTab('prizes')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold font-['Chakra_Petch'] uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'prizes'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Prizes
          </button>
        <button
          onClick={() => setActiveTab('pointTable')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold font-['Chakra_Petch'] uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === 'pointTable'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Point Table
        </button>
      </div>

      {/* Tab Content Body */}

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 max-h-[50vh] overflow-y-auto space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Tournament Brief
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {tournament.description ||
                    `Official competitive tournament for ${tournament.game} players. Compete against top regional rosters on dedicated 128-tick verified game nodes with anti-cheat telemetry.`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2 text-emerald-400 mb-1 text-xs font-bold uppercase font-['Chakra_Petch']">
                    <ShieldCheck className="w-4 h-4" /> Server & Anti-Cheat
                  </div>
                  <p className="text-xs text-slate-300">
                    Kernel-level anti-cheat active. 128-tick private esports tournament lobbies with low-latency routing.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2 text-cyan-400 mb-1 text-xs font-bold uppercase font-['Chakra_Petch']">
                    <Calendar className="w-4 h-4" /> Launch Date & Time
                  </div>
                  <p className="text-xs text-slate-300">
                    Starts on <strong className="text-white">{tournament.startDate}</strong>. Check-in opens 45 minutes prior to map draft.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Official Rulebook & Requirements
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {(tournament.rules && tournament.rules.length > 0
                  ? tournament.rules
                  : [
                      'Group matches are Best of 3 (BO3); Grand Finals are Best of 5 (BO5).',
                      'Anti-cheat client must be active and synchronized throughout all tournament games.',
                      'Tactical pauses are capped at 2 per squad per map (60 seconds each).',
                      'Substitute swaps must be registered at least 15 minutes before map veto starts.',
                      'Unsportsmanlike conduct or match-fixing results in instant permanent disqualification.'
                    ]
                ).map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'squads' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Registered Competitor Squads
                </h4>
                <span className="text-xs font-mono text-cyan-400">
                  {tournament.slotsFilled} / {tournament.slotsTotal} Slots
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(tournament.registeredSquadNames && tournament.registeredSquadNames.length > 0
                  ? tournament.registeredSquadNames
                  : ['Vortex Protocol', 'Ghost Division', 'Ronin Syndicate', 'Solaris Nova']
                ).map((squad, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.03] border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500/30 to-emerald-500/30 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-white">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-bold text-slate-200">{squad}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'prizes' && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Guaranteed Prize Purse Distribution
              </h4>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-white">1st Place Champion</div>
                      <div className="text-[10px] text-amber-300">60% of Prize Purse + Championship Trophy</div>
                    </div>
                  </div>
                  <div className="text-sm font-black text-amber-400 font-['Chakra_Petch']">
                    ${Math.round(tournament.prizePool * 0.6).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-5 h-5 text-slate-300" />
                    <div>
                      <div className="text-xs font-bold text-white">2nd Place Runner-Up</div>
                      <div className="text-[10px] text-slate-400">25% of Prize Purse</div>
                    </div>
                  </div>
                  <div className="text-sm font-black text-slate-300 font-['Chakra_Petch']">
                    ${Math.round(tournament.prizePool * 0.25).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="text-xs font-bold text-white">3rd Place Bronze</div>
                      <div className="text-[10px] text-slate-400">15% of Prize Purse</div>
                    </div>
                  </div>
                  <div className="text-sm font-black text-amber-600 font-['Chakra_Petch']">
                    ${Math.round(tournament.prizePool * 0.15).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
                  {activeTab === 'pointTable' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                    Point Table
                  </h4>

                  <p className="text-xs text-slate-400 mt-1">
                    {tournament.pointTable?.matchTitle || 'Tournament Standings'}
                  </p>
                </div>

                <Trophy className="w-5 h-5 text-amber-400" />
              </div>

              {tournament.pointTable?.rows &&
              tournament.pointTable.rows.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-700">
                  <table className="w-full min-w-[620px] text-sm">
                    <thead className="bg-slate-900">
                      <tr className="text-xs uppercase tracking-wider text-slate-400">
                        <th className="px-3 py-3 text-left">Rank</th>
                        <th className="px-3 py-3 text-left">Team</th>
                        <th className="px-3 py-3 text-center">Place</th>
                        <th className="px-3 py-3 text-center">Kills</th>
                        <th className="px-3 py-3 text-center">Total</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-800">
                      {tournament.pointTable.rows.map((row, index) => {
                        const placePoints = row.placePoints ?? 0;
                        const totalPoints =
                          row.totalPoints ?? placePoints + row.kills;

                        return (
                          <tr
                            key={row.id || index}
                            className="bg-white/[0.02] hover:bg-white/[0.05]"
                          >
                            <td className="px-3 py-3 font-bold text-cyan-400">
                              #{row.rank}
                            </td>

                            <td className="px-3 py-3 font-semibold text-white">
                              {row.teamName}
                            </td>

                            <td className="px-3 py-3 text-center text-slate-300">
                              {placePoints}
                            </td>

                            <td className="px-3 py-3 text-center text-slate-300">
                              {row.kills}
                            </td>

                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex min-w-12 justify-center rounded-lg bg-emerald-500/10 px-2 py-1 font-black text-emerald-400">
                                {totalPoints}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-700 bg-white/[0.02] p-8 text-center">
                  <Trophy className="mx-auto mb-3 h-8 w-8 text-slate-600" />

                  <p className="text-sm font-semibold text-slate-300">
                    Point Table Not Available
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    No saved point table has been added to this tournament yet.
                  </p>
                </div>
              )}
            </div>
          )}
          )}
        </div>

        {/* Footer Registration / Permission Controls */}
        <div className="p-4 sm:p-6 bg-[#070b13] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {currentUser ? (
            <>
              <div className="text-xs text-slate-400 text-center sm:text-left">
                Logged in as <strong className="text-white">{currentUser.gamerTag}</strong>
                {currentUser.teamName && (
                  <span> • Squad: <strong className="text-cyan-400">[{currentUser.teamTag}] {currentUser.teamName}</strong></span>
                )}
              </div>

              {isRegistered ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" /> Squad Registered
                </div>
              ) : (
                <button
                  id="modal-register-squad-btn"
                  type="button"
                  disabled={isFull}
                  onClick={() => {
                    onClose();
                    onRegisterClick(tournament);
                  }}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl font-bold font-['Chakra_Petch'] text-sm tracking-wider uppercase bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Swords className="w-4 h-4" />
                  <span>{isFull ? 'Tournament Full' : 'Register My Squad'}</span>
                </button>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl text-center sm:text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Guests cannot register. Log in to enroll your squad.</span>
              </div>

              <button
                id="modal-guest-login-prompt-btn"
                type="button"
                onClick={() => {
                  onClose();
                  onPromptAuth();
                }}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl font-bold font-['Chakra_Petch'] text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In to Register</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
