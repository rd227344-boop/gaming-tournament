import React from 'react';
import { Gamepad2, PlusCircle, ArrowRight, UserCheck, Flame, Shield, Sparkles } from 'lucide-react';
import { User } from '../types';

interface HeroSectionProps {
  currentUser: User | null;
  onOpenCreateTournament: () => void;
  onExploreTournaments: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  onOpenCreateTournament,
  onExploreTournaments,
}) => {
  return (
    <section id="hero" className="relative py-14 sm:py-20 md:py-24 overflow-hidden bg-[#070b14] border-b border-slate-800/60">
      {/* Dynamic esports backdrop grid & ambient glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[340px] bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Welcome Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-6 shadow-md backdrop-blur-sm">
          {currentUser ? (
            <>
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Ready for combat, <strong className="text-emerald-400">{currentUser.gamerTag}</strong>
                {currentUser.teamTag && <span className="text-cyan-300 ml-1">[{currentUser.teamTag}]</span>}
              </span>
            </>
          ) : (
            <>
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-300">
                Welcome Gamers • <strong className="text-emerald-400">Battle Royale & Esports Hub</strong>
              </span>
            </>
          )}
        </div>

        {/* Hero Title with impactful typography */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-6 font-['Chakra_Petch'] leading-[1.08]">
          COMPETE. DOMINATE.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">
            CLAIM VICTORY.
          </span>
        </h1>

        {/* Short Platform Description */}
        <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          The all-in-one tournament platform for mobile & PC champions. Explore daily scrims, join verified brackets in{' '}
          <span className="text-amber-400 font-bold">Free Fire</span> &{' '}
          <span className="text-emerald-400 font-bold">BGMI</span>, or host your own custom rooms with automated point tables.
        </p>

        {/* Action Buttons: Explore Tournaments & Create Tournament */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Explore Tournaments Button */}
          <button
            onClick={onExploreTournaments}
            id="hero-explore-tournaments-btn"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black font-['Chakra_Petch'] uppercase tracking-wider text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-95"
          >
            <Gamepad2 className="w-4 h-4 text-black" />
            <span>Explore Tournaments</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          {/* Create Tournament Button */}
          <button
            onClick={onOpenCreateTournament}
            id="hero-create-tournament-btn"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 text-emerald-300 hover:text-white font-bold font-['Chakra_Petch'] uppercase tracking-wider text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Create Tournament</span>
          </button>
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center max-w-3xl mx-auto">
          <div className="px-3 py-2 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Verified Formats</span>
            <span className="text-xs sm:text-sm font-bold text-white font-['Chakra_Petch']">Official Point Matrix</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Supported Titles</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400 font-['Chakra_Petch']">Free Fire & BGMI</span>
          </div>
          <div className="col-span-2 sm:col-span-1 px-3 py-2 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Community & Scrims</span>
            <span className="text-xs sm:text-sm font-bold text-amber-400 font-['Chakra_Petch']">Instant Points Table</span>
          </div>
        </div>
      </div>
    </section>
  );
};
