import React from 'react';
import {
  ArrowRight,
  Target,
  Trophy,
  Users,
  Flame,
  Shield,
  Crosshair,
  Zap,
  Sword,
  Sparkles,
  Smartphone,
  Monitor
} from 'lucide-react';
import { COMPETITIVE_GAMES, GameInfo } from '../data/gamesData';
import { TournamentItem } from '../types';

interface GameSelectionSectionProps {
  onSelectGame: (gameId: string) => void;
  tournaments: TournamentItem[];
}

export const GameSelectionSection: React.FC<GameSelectionSectionProps> = ({
  onSelectGame,
  tournaments,
}) => {
  // Compute active tournaments count dynamically from real data
  const getTournamentCount = (gameName: string): number => {
    const clean = gameName.toLowerCase().trim();
    return tournaments.filter((t) => {
      const tGame = t.game.toLowerCase().trim();
      return (
        tGame === clean ||
        (clean === 'counter-strike 2' && (tGame === 'cs2' || tGame.includes('counter-strike'))) ||
        (clean === 'free fire' && tGame.includes('free fire')) ||
        (clean === 'call of duty mobile' && (tGame.includes('cod') || tGame.includes('duty')))
      );
    }).length;
  };

  const getGameIcon = (id: string) => {
    switch (id) {
      case 'free-fire':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'bgmi':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'valorant':
        return <Crosshair className="w-4 h-4 text-rose-400" />;
      case 'counter-strike-2':
        return <Target className="w-4 h-4 text-amber-400" />;
      case 'apex-legends':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'cod-mobile':
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 'league-of-legends':
        return <Sword className="w-4 h-4 text-blue-400" />;
      default:
        return <Target className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <section id="game-selection" className="py-14 sm:py-20 bg-[#070b14] border-t border-b border-slate-800/80 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-widest mb-4 shadow-sm">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Competitive Esports Roster</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-['Chakra_Petch'] tracking-tight leading-tight">
            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">Game Arena</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            Choose a competitive title below to view verified brackets, community scrim rooms, and automated point tables.
          </p>
        </div>

        {/* 7 Large, Professional Gaming Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {COMPETITIVE_GAMES.map((game, idx) => {
            const count = getTournamentCount(game.name);
            const isFeatured = idx < 2; // Free Fire & BGMI highlighted

            return (
              <div
                key={game.id}
                id={`game-card-${game.id}`}
                className={`group relative bg-[#0c1322] rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-2xl hover:-translate-y-1 ${
                  isFeatured
                    ? 'border-slate-700/80 hover:border-emerald-500/80 hover:shadow-emerald-500/10'
                    : 'border-slate-800 hover:border-slate-600 hover:shadow-cyan-500/10'
                }`}
              >
                {/* Top Glowing Gradient Bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${game.accentColor}`} />

                {/* Hero Gaming Image Banner */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                  <img
                    src={game.imageUrl}
                    alt={game.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                    loading="lazy"
                  />
                  {/* Dark gradient overlay for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-[#0c1322]/60 to-transparent" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${game.badgeBg} border ${game.badgeBorder} ${game.badgeText} text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md`}>
                        {getGameIcon(game.id)}
                        <span>{game.category}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                        {game.platform.includes('Mobile') ? (
                          <Smartphone className="w-3 h-3 text-slate-300" />
                        ) : (
                          <Monitor className="w-3 h-3 text-slate-300" />
                        )}
                        <span>{game.platform}</span>
                      </span>
                    </div>

                    <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-black/75 px-2.5 py-1 rounded-lg border border-emerald-500/30 backdrop-blur-md">
                      {count} {count === 1 ? 'Tournament' : 'Tournaments'}
                    </span>
                  </div>

                  {/* Game Name & Publisher Floating Over Bottom of Image */}
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-2xl sm:text-3xl font-black text-white font-['Chakra_Petch'] tracking-wide uppercase group-hover:text-emerald-300 transition-colors">
                        {game.name}
                      </h3>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/15">
                        {game.developer}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-2">
                      {game.description}
                    </p>

                    {/* Key Format Feature Highlights */}
                    <div className="grid grid-cols-2 gap-2 mb-6 text-[11px] text-slate-300">
                      {game.features.slice(0, 2).map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-2 rounded-lg border border-slate-800 truncate"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Primary Explore Action Button */}
                  <button
                    type="button"
                    id={`explore-game-${game.id}-btn`}
                    onClick={() => onSelectGame(game.id)}
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/40 hover:border-emerald-400 font-black uppercase tracking-wider text-xs sm:text-sm font-['Chakra_Petch'] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-emerald-500/20 active:scale-98"
                  >
                    <span>Explore {game.name} Tournaments</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
