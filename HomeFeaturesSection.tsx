import React from 'react';
import {
  ShieldCheck,
  Calculator,
  KeyRound,
  Users,
  Trophy,
  ArrowRight,
  Gamepad2,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';

interface HomeFeaturesSectionProps {
  onExploreTournaments: () => void;
  onOpenCreateTournament: () => void;
}

export const HomeFeaturesSection: React.FC<HomeFeaturesSectionProps> = ({
  onExploreTournaments,
  onOpenCreateTournament,
}) => {
  const pillars = [
    {
      icon: <Calculator className="w-6 h-6 text-emerald-400" />,
      title: 'Automated Point Tables',
      desc: 'Built-in official scoring matrices for Free Fire (12-point system), BGMI (10-point system), ALGS, and COD Mobile. Generates verified leaderboard graphics instantly without spreadsheets.',
      tag: 'Scoring Engine',
    },
    {
      icon: <KeyRound className="w-6 h-6 text-cyan-400" />,
      title: 'Automated Room Distribution',
      desc: 'Secure room ID and password dispatch directly to authenticated squad captains before match kick-off, eliminating leakages and unauthorized spectators.',
      tag: 'Match Protocol',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      title: 'Verified Anti-Cheat & Fair Play',
      desc: 'Player verification with game UID tagging, roster lock, and dispute resolution systems to maintain strict competitive esports integrity.',
      tag: 'Fair Play',
    },
  ];

  return (
    <section id="platform-features" className="py-16 sm:py-20 bg-[#070b14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built For Esports Organizers & Scrims</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-['Chakra_Petch'] tracking-tight">
            Professional Tournament Infrastructure
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Everything your clan, guild, or organization needs to host competitive battle royale brackets, automated scrims, and verified community cups.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-[#0c1322] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-7 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white font-['Chakra_Petch'] uppercase tracking-wide mb-3 group-hover:text-emerald-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Zap className="w-3.5 h-3.5" />
                <span>Zero Manual Calculation</span>
              </div>
            </div>
          ))}
        </div>

        {/* Professional Call To Action Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1627] to-slate-900 border border-slate-800 p-8 sm:p-12 text-center sm:text-left shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-2">
                Join Over 15,000+ Competitive Squads
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-['Chakra_Petch'] uppercase tracking-wide">
                Ready to Join the Action?
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Step into open registrations, discover upcoming tournaments with verified prize pools, or create your own custom room bracket now.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
              <button
                type="button"
                id="home-cta-explore-tournaments-btn"
                onClick={onExploreTournaments}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black font-['Chakra_Petch'] uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95"
              >
                <Gamepad2 className="w-4 h-4 text-black" />
                <span>Explore Tournaments</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <button
                type="button"
                id="home-cta-create-tournament-btn"
                onClick={onOpenCreateTournament}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-white font-bold font-['Chakra_Petch'] uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Create Tournament</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
