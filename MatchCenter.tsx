import React, { useState } from 'react';
import { MatchFixture, BracketMatch } from '../types';
import { Radio, Tv, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';

interface MatchCenterProps {
  matches: MatchFixture[];
  bracketData: BracketMatch[];
  onVote: (matchId: string, team: 'teamA' | 'teamB') => void;
}

export const MatchCenter: React.FC<MatchCenterProps> = ({
  matches,
  bracketData,
  onVote,
}) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'bracket'>('matches');
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all');
  const [streamModalOpen, setStreamModalOpen] = useState(false);
  const [currentStreamMatch, setCurrentStreamMatch] = useState<MatchFixture | null>(null);

  const filteredMatches = matches.filter((m) => {
    if (filter === 'live') return m.status === 'live';
    if (filter === 'upcoming') return m.status === 'upcoming';
    return true;
  });

  const handleOpenStream = (match: MatchFixture) => {
    setCurrentStreamMatch(match);
    setStreamModalOpen(true);
  };

  return (
    <section id="matches" className="py-16 border-t border-white/10 bg-[#0b0f19] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Tournament Action Center
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white font-gaming">
              Match Fixtures & <span className="text-emerald-400">Playoffs</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Track live scores, vote in community predictions, and follow the championship bracket path to the Grand Final.
            </p>
          </div>

          {/* Main Tab Toggle */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-lg self-start md:self-auto">
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'matches'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Match Schedule
            </button>
            <button
              onClick={() => setActiveTab('bracket')}
              className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'bracket'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tournament Bracket
            </button>
          </div>
        </div>

        {/* Tab 1: Match Schedule */}
        {activeTab === 'matches' && (
          <div>
            {/* Filter pills */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-colors ${
                  filter === 'all'
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                All Matches ({matches.length})
              </button>
              <button
                onClick={() => setFilter('live')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                  filter === 'live'
                    ? 'bg-red-950/60 text-red-400 border border-red-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Radio className="w-3 h-3 text-red-400 animate-pulse" />
                Live Now ({matches.filter((m) => m.status === 'live').length})
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-colors ${
                  filter === 'upcoming'
                    ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                Upcoming ({matches.filter((m) => m.status === 'upcoming').length})
              </button>
            </div>

            {/* Matches List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {filteredMatches.map((match) => {
                const totalVotes = match.votesA + match.votesB;
                const percentA = totalVotes ? Math.round((match.votesA / totalVotes) * 100) : 50;
                const percentB = 100 - percentA;

                return (
                  <div
                    key={match.id}
                    className="bg-[#111622] border border-white/10 rounded-xl p-5 sm:p-6 relative overflow-hidden group hover:border-slate-700 transition-all shadow-lg"
                  >
                    {/* Top Row: Round & Status */}
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-300 font-gaming uppercase tracking-wide">
                          {match.round}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                          {match.format}
                        </span>
                      </div>

                      {match.status === 'live' ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                            Live Broadcast
                          </span>
                        </div>
                      ) : match.status === 'upcoming' ? (
                        <span className="text-[11px] font-medium text-slate-400">
                          {match.scheduledTime}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Final Score
                        </span>
                      )}
                    </div>

                    {/* Team Versus Row */}
                    <div className="grid grid-cols-11 items-center gap-2 mb-5">
                      {/* Team A */}
                      <div className="col-span-5 flex items-center gap-3">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${match.teamA.logoColor} p-0.5 flex items-center justify-center shrink-0 shadow-md`}
                        >
                          <span className="font-gaming font-extrabold text-white text-xs sm:text-sm">
                            {match.teamA.tag}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm sm:text-base truncate font-gaming">
                              {match.teamA.name}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                              {match.teamA.region}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate">
                            Capt: {match.teamA.captain}
                          </p>
                        </div>
                      </div>

                      {/* Score or VS in the middle */}
                      <div className="col-span-1 text-center">
                        {match.scoreA !== undefined && match.scoreB !== undefined ? (
                          <div className="flex items-center justify-center gap-1 text-base sm:text-lg font-extrabold text-white font-gaming bg-slate-900/90 px-2 py-1 rounded border border-slate-800">
                            <span className={match.scoreA > match.scoreB ? 'text-emerald-400' : 'text-slate-400'}>
                              {match.scoreA}
                            </span>
                            <span className="text-slate-600">:</span>
                            <span className={match.scoreB > match.scoreA ? 'text-emerald-400' : 'text-slate-400'}>
                              {match.scoreB}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-extrabold text-slate-500 font-gaming">
                            VS
                          </span>
                        )}
                      </div>

                      {/* Team B */}
                      <div className="col-span-5 flex items-center justify-end gap-3 text-right">
                        <div className="min-w-0">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                              {match.teamB.region}
                            </span>
                            <span className="font-bold text-white text-sm sm:text-base truncate font-gaming">
                              {match.teamB.name}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate">
                            Capt: {match.teamB.captain}
                          </p>
                        </div>
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${match.teamB.logoColor} p-0.5 flex items-center justify-center shrink-0 shadow-md`}
                        >
                          <span className="font-gaming font-extrabold text-white text-xs sm:text-sm">
                            {match.teamB.tag}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Community Prediction / Voting Meter */}
                    <div className="bg-slate-950/70 rounded-lg p-3 border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="flex items-center gap-1 font-medium">
                          Fan Prediction: <strong className="text-white">{percentA}%</strong> {match.teamA.tag}
                        </span>
                        <span className="font-medium">
                          <strong className="text-white">{percentB}%</strong> {match.teamB.tag}
                        </span>
                      </div>

                      {/* Prediction Bar */}
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex mb-2.5">
                        <div
                          className="bg-cyan-500 h-full transition-all duration-300"
                          style={{ width: `${percentA}%` }}
                        />
                        <div
                          className="bg-emerald-500 h-full transition-all duration-300"
                          style={{ width: `${percentB}%` }}
                        />
                      </div>

                      {/* Vote Buttons */}
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => onVote(match.id, 'teamA')}
                          disabled={match.userVoted !== undefined}
                          className={`flex-1 py-1.5 px-2 rounded text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                            match.userVoted === 'teamA'
                              ? 'bg-cyan-500 text-slate-950'
                              : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {match.userVoted === 'teamA' ? 'Voted' : `Vote ${match.teamA.tag}`}
                        </button>

                        {match.status === 'live' && (
                          <button
                            onClick={() => handleOpenStream(match)}
                            className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors"
                          >
                            <Tv className="w-3 h-3" />
                            Stream
                          </button>
                        )}

                        <button
                          onClick={() => onVote(match.id, 'teamB')}
                          disabled={match.userVoted !== undefined}
                          className={`flex-1 py-1.5 px-2 rounded text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                            match.userVoted === 'teamB'
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {match.userVoted === 'teamB' ? 'Voted' : `Vote ${match.teamB.tag}`}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Playoff Bracket */}
        {activeTab === 'bracket' && (
          <div id="bracket" className="bg-[#111622] border border-white/10 rounded-xl p-6 sm:p-8 overflow-x-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold uppercase font-gaming text-white">
                  Championship Playoffs Bracket
                </h3>
                <p className="text-xs text-slate-400">
                  Best of 3 Quarterfinals & Semifinals • Best of 5 Grand Final
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded" /> Advanced
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded" /> Live Match
                </span>
              </div>
            </div>

            {/* Bracket Columns */}
            <div className="min-w-[760px] grid grid-cols-3 gap-8 relative">
              {/* Column 1: Quarterfinals */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5 font-gaming">
                  <span>Quarterfinals</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </div>
                <div className="space-y-4">
                  {bracketData.slice(0, 4).map((node) => (
                    <div
                      key={node.id}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 font-medium">
                        <span>{node.stage}</span>
                        {node.status === 'live' ? (
                          <span className="text-red-400 font-bold uppercase text-[10px] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                            Live
                          </span>
                        ) : (
                          <span>{node.time}</span>
                        )}
                      </div>

                      {/* Team 1 */}
                      <div
                        className={`flex items-center justify-between py-1.5 px-2 rounded mb-1 ${
                          node.team1.isWinner
                            ? 'bg-emerald-950/40 text-emerald-300 font-semibold border-l-2 border-emerald-500'
                            : 'text-slate-300'
                        }`}
                      >
                        <span className="text-xs font-gaming truncate">{node.team1.name}</span>
                        <span className="text-xs font-mono">{node.team1.score ?? '-'}</span>
                      </div>

                      {/* Team 2 */}
                      <div
                        className={`flex items-center justify-between py-1.5 px-2 rounded ${
                          node.team2.isWinner
                            ? 'bg-emerald-950/40 text-emerald-300 font-semibold border-l-2 border-emerald-500'
                            : 'text-slate-300'
                        }`}
                      >
                        <span className="text-xs font-gaming truncate">{node.team2.name}</span>
                        <span className="text-xs font-mono">{node.team2.score ?? '-'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Semifinals */}
              <div className="flex flex-col justify-around">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5 font-gaming">
                    <span>Semifinals</span>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                  </div>
                  <div className="space-y-12">
                    {bracketData.slice(4, 6).map((node) => (
                      <div
                        key={node.id}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 font-medium">
                          <span>{node.stage}</span>
                          <span>{node.time}</span>
                        </div>

                        <div className="flex items-center justify-between py-1.5 px-2 rounded mb-1 text-slate-300">
                          <span className="text-xs font-gaming truncate">{node.team1.name}</span>
                          <span className="text-xs font-mono">-</span>
                        </div>

                        <div className="flex items-center justify-between py-1.5 px-2 rounded text-slate-300">
                          <span className="text-xs font-gaming truncate">{node.team2.name}</span>
                          <span className="text-xs font-mono">-</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 3: Grand Final */}
              <div className="flex flex-col justify-center">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-1.5 font-gaming">
                    <span>Grand Championship Final</span>
                  </div>
                  <div className="bg-gradient-to-b from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/30 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between text-[11px] text-amber-400 mb-3 font-semibold">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" />
                        Championship Match
                      </span>
                      <span>BO5 • Sun 20:00 UTC</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 px-2.5 rounded bg-slate-900 border border-slate-800 text-slate-200">
                        <span className="text-xs font-bold font-gaming">Winner of Semifinal 1</span>
                        <span className="text-xs font-mono text-slate-500">TBD</span>
                      </div>

                      <div className="text-center text-[10px] font-bold text-amber-500/80 font-gaming">
                        VS
                      </div>

                      <div className="flex items-center justify-between py-2 px-2.5 rounded bg-slate-900 border border-slate-800 text-slate-200">
                        <span className="text-xs font-bold font-gaming">Winner of Semifinal 2</span>
                        <span className="text-xs font-mono text-slate-500">TBD</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800 text-center">
                      <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">
                        Winner Takes $125,000 & World Title
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stream Modal */}
      {streamModalOpen && currentStreamMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111622] border border-white/10 rounded-xl max-w-2xl w-full p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <h4 className="text-base font-bold font-gaming text-white uppercase">
                  Official Match Stream: {currentStreamMatch.teamA.name} vs {currentStreamMatch.teamB.name}
                </h4>
              </div>
              <button
                onClick={() => setStreamModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            {/* Mock Esports Stream Player Canvas */}
            <div className="aspect-video bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                <Radio className="w-3 h-3 animate-pulse" /> LIVE 1080p 60FPS
              </div>
              <div className="absolute top-3 right-3 text-slate-400 text-xs font-mono">
                124,512 Viewers
              </div>

              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3">
                <Tv className="w-8 h-8" />
              </div>
              <h5 className="text-lg font-bold font-gaming text-white uppercase mb-1">
                Map 3: Decider Overtime
              </h5>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                {currentStreamMatch.teamA.name} ({currentStreamMatch.scoreA}) - ({currentStreamMatch.scoreB}) {currentStreamMatch.teamB.name}
              </p>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded bg-slate-800 text-xs text-slate-300 font-mono">
                  Casters: GoldenBoy & Semmler
                </span>
                <span className="px-3 py-1 rounded bg-emerald-950 text-xs text-emerald-300 border border-emerald-500/30">
                  Delay: 0.2s
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setStreamModalOpen(false)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
