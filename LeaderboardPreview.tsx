import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Flame, TrendingUp, Users, User, Globe, ArrowUpRight, Shield } from 'lucide-react';

interface LeaderboardPreviewProps {
  squadLeaderboard: LeaderboardEntry[];
  soloLeaderboard: LeaderboardEntry[];
  onSelectTeam?: (teamTag: string) => void;
}

export const LeaderboardPreview: React.FC<LeaderboardPreviewProps> = ({
  squadLeaderboard,
  soloLeaderboard,
}) => {
  const [activeTab, setActiveTab] = useState<'squad' | 'solo'>('squad');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const currentList = activeTab === 'squad' ? squadLeaderboard : soloLeaderboard;
  const filteredList = currentList.filter(
    (item) => selectedRegion === 'All' || item.region === selectedRegion
  );

  const topThree = filteredList.slice(0, 3);
  const remainingList = filteredList.slice(3);

  const regions = ['All', 'NA', 'EU', 'APAC', 'LATAM'];

  return (
    <section id="leaderboard" className="py-16 sm:py-20 relative bg-[#090d16] border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Trophy className="w-3.5 h-3.5" />
              <span>Season Rankings & ELO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white font-gaming">
              Leaderboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400">Preview</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Live competitive standings based on match victories, tournament prize earnings, and verified 128-tick ladder ELO.
            </p>
          </div>

          {/* Tab Switcher & Region Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Squad vs Solo Switch */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
              <button
                onClick={() => setActiveTab('squad')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  activeTab === 'squad'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Top Squads
              </button>
              <button
                onClick={() => setActiveTab('solo')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  activeTab === 'solo'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                MVP Solo
              </button>
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                    selectedRegion === r
                      ? 'bg-slate-800 text-amber-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {topThree.map((item, idx) => {
            const podiumTheme =
              item.rank === 1
                ? {
                    border: 'border-amber-500/50 hover:border-amber-400',
                    bg: 'bg-gradient-to-b from-amber-500/10 via-slate-900 to-[#0d121e]',
                    badge: 'bg-amber-500 text-slate-950 font-black',
                    titleColor: 'text-amber-300',
                    glow: 'shadow-[0_0_25px_rgba(245,158,11,0.15)]',
                    rankLabel: '1st Place Champion',
                  }
                : item.rank === 2
                ? {
                    border: 'border-slate-400/40 hover:border-slate-300',
                    bg: 'bg-gradient-to-b from-slate-400/10 via-slate-900 to-[#0d121e]',
                    badge: 'bg-slate-300 text-slate-950 font-black',
                    titleColor: 'text-slate-200',
                    glow: 'shadow-[0_0_20px_rgba(203,213,225,0.1)]',
                    rankLabel: '2nd Place Runner-Up',
                  }
                : {
                    border: 'border-amber-700/40 hover:border-amber-600',
                    bg: 'bg-gradient-to-b from-amber-700/10 via-slate-900 to-[#0d121e]',
                    badge: 'bg-amber-700 text-white font-black',
                    titleColor: 'text-amber-400',
                    glow: 'shadow-[0_0_20px_rgba(180,83,9,0.1)]',
                    rankLabel: '3rd Place Contender',
                  };

            return (
              <div
                key={item.name}
                className={`relative rounded-2xl border ${podiumTheme.border} ${podiumTheme.bg} ${podiumTheme.glow} p-6 flex flex-col justify-between transition-all`}
              >
                <div>
                  {/* Top Bar with Medal & Rank */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs uppercase tracking-widest ${podiumTheme.badge}`}>
                      #{item.rank} • {podiumTheme.rankLabel}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{item.region}</span>
                    </div>
                  </div>

                  {/* Team Profile */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.avatarColor} flex items-center justify-center text-white font-extrabold text-sm shadow-md`}>
                      {item.tag}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold font-gaming ${podiumTheme.titleColor}`}>
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="text-emerald-400 font-semibold">{item.game}</span>
                        <span>•</span>
                        <span>{item.captainOrPlayer}</span>
                      </p>
                    </div>
                  </div>

                  {/* Key Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/80 border border-slate-800 rounded-xl p-3 mb-4">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 font-semibold block">
                        ELO Rating
                      </span>
                      <span className="text-sm font-bold text-white font-gaming">
                        {item.ratingElo}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 font-semibold block">
                        Win Rate
                      </span>
                      <span className="text-sm font-bold text-emerald-400 font-gaming">
                        {item.winRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 font-semibold block">
                        Earnings
                      </span>
                      <span className="text-sm font-bold text-amber-400 font-gaming">
                        {item.earnings}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Streak and Record */}
                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>{item.streak}</span>
                  </div>
                  <span className="text-slate-400 font-mono">
                    {item.wins}W - {item.losses}L
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leaderboard Table Preview */}
        <div className="bg-[#0d121e] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-3.5 px-4 text-center w-16">Rank</th>
                  <th className="py-3.5 px-4">{activeTab === 'squad' ? 'Squad / Roster' : 'Player / Handle'}</th>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Region</th>
                  <th className="py-3.5 px-4">Record</th>
                  <th className="py-3.5 px-4">Win Rate</th>
                  <th className="py-3.5 px-4 text-right">Rating (ELO)</th>
                  <th className="py-3.5 px-4 text-right">Prize Won</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredList.map((entry) => (
                  <tr
                    key={entry.name}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Rank Badge */}
                    <td className="py-3 px-4 text-center font-bold font-gaming">
                      {entry.rank === 1 ? (
                        <span className="inline-flex w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 items-center justify-center text-xs">
                          1
                        </span>
                      ) : entry.rank === 2 ? (
                        <span className="inline-flex w-7 h-7 rounded-full bg-slate-300/20 text-slate-300 border border-slate-300/40 items-center justify-center text-xs">
                          2
                        </span>
                      ) : entry.rank === 3 ? (
                        <span className="inline-flex w-7 h-7 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/40 items-center justify-center text-xs">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono">#{entry.rank}</span>
                      )}
                    </td>

                    {/* Squad / Player Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${entry.avatarColor} flex items-center justify-center text-white font-bold text-[10px] shadow`}>
                          {entry.tag}
                        </div>
                        <div>
                          <span className="font-bold text-white group-hover:text-emerald-300 transition-colors block">
                            {entry.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {entry.captainOrPlayer}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Game */}
                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {entry.game}
                    </td>

                    {/* Region */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
                        {entry.region}
                      </span>
                    </td>

                    {/* Record & Streak */}
                    <td className="py-3 px-4 font-mono text-slate-300">
                      <span>{entry.wins}W - {entry.losses}L</span>
                      <span className="ml-2 text-[10px] text-amber-400 font-semibold bg-amber-950/60 px-1.5 py-0.5 rounded">
                        {entry.streak}
                      </span>
                    </td>

                    {/* Win Rate */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-emerald-400 h-full rounded-full"
                            style={{ width: `${entry.winRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-200">
                          {entry.winRate}%
                        </span>
                      </div>
                    </td>

                    {/* ELO Rating */}
                    <td className="py-3 px-4 text-right font-gaming font-extrabold text-white text-base">
                      {entry.ratingElo}
                    </td>

                    {/* Prize Won */}
                    <td className="py-3 px-4 text-right font-gaming font-bold text-amber-400">
                      {entry.earnings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-950/90 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Leaderboard updates in real-time after verified match completion. Top 8 squads qualify for Championship playoffs.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
