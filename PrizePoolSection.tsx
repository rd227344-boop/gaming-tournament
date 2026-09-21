import React from 'react';
import { PrizeTier } from '../types';
import { Trophy, Award, Medal, Check, Gift } from 'lucide-react';

interface PrizePoolSectionProps {
  prizeTiers: PrizeTier[];
}

export const PrizePoolSection: React.FC<PrizePoolSectionProps> = ({ prizeTiers }) => {
  return (
    <section id="prizes" className="py-16 border-t border-white/10 bg-[#090d16] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Championship Stakes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white font-gaming">
            $250,000 <span className="text-amber-400">Prize Pool Distribution</span>
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            All placements in the top 8 receive guaranteed financial payouts, regional circuit points, and commemorative physical honors.
          </p>
        </div>

        {/* Podium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 2nd Place */}
          <div className="md:order-1 bg-[#111622] border border-slate-700/60 rounded-xl p-6 relative flex flex-col justify-between hover:border-slate-500 transition-colors shadow-lg">
            <div className="absolute -top-3 left-6 px-3 py-0.5 rounded bg-slate-800 border border-slate-600 text-slate-300 text-[11px] font-bold uppercase tracking-wider font-gaming">
              Runner Up
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-4 mt-2">
                <Medal className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-white font-gaming uppercase">
                {prizeTiers[1].place}
              </h3>
              <div className="text-3xl font-extrabold text-slate-200 font-gaming mt-1 mb-2">
                {prizeTiers[1].amount}
              </div>
              <p className="text-xs text-slate-400 font-medium mb-5 pb-4 border-b border-slate-800">
                {prizeTiers[1].reward}
              </p>

              <ul className="space-y-2.5">
                {prizeTiers[1].perks.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 1st Place Champion (Elevated) */}
          <div className="md:order-2 bg-gradient-to-b from-amber-500/15 via-[#111622] to-[#111622] border-2 border-amber-500/50 rounded-xl p-6 sm:p-7 relative flex flex-col justify-between md:-translate-y-3 shadow-[0_0_35px_rgba(245,158,11,0.15)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-widest font-gaming shadow-md">
              Grand Champion
            </div>
            <div>
              <div className="w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 mt-2">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white font-gaming uppercase">
                {prizeTiers[0].place}
              </h3>
              <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 font-gaming mt-1 mb-2">
                {prizeTiers[0].amount}
              </div>
              <p className="text-xs text-amber-200/90 font-medium mb-5 pb-4 border-b border-amber-500/20">
                {prizeTiers[0].reward}
              </p>

              <ul className="space-y-3">
                {prizeTiers[0].perks.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-500/20 text-center">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                Direct Invitation: World Championship 2026
              </span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="md:order-3 bg-[#111622] border border-amber-900/40 rounded-xl p-6 relative flex flex-col justify-between hover:border-amber-800/60 transition-colors shadow-lg">
            <div className="absolute -top-3 left-6 px-3 py-0.5 rounded bg-amber-950 border border-amber-800/60 text-amber-400 text-[11px] font-bold uppercase tracking-wider font-gaming">
              3rd Place
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-500 mb-4 mt-2">
                <Award className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white font-gaming uppercase">
                {prizeTiers[2].place}
              </h3>
              <div className="text-3xl font-extrabold text-amber-400/90 font-gaming mt-1 mb-2">
                {prizeTiers[2].amount}
              </div>
              <p className="text-xs text-slate-400 font-medium mb-5 pb-4 border-b border-slate-800">
                {prizeTiers[2].reward}
              </p>

              <ul className="space-y-2.5">
                {prizeTiers[2].perks.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4th-8th Place Banner */}
        <div className="bg-[#111622] border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase font-gaming">
                4th through 8th Placements: $30,000 Guaranteed Pool
              </h4>
              <p className="text-xs text-slate-400">
                Each qualifying squad in the quarterfinal round earns $6,000 USD plus official tournament circuit points.
              </p>
            </div>
          </div>
          <span className="px-4 py-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-emerald-400 shrink-0">
            $6,000 / Squad
          </span>
        </div>
      </div>
    </section>
  );
};
