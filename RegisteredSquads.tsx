import React, { useState } from 'react';
import { Team, User } from '../types';
import { Users, Search, Shield, Trophy, AlertCircle } from 'lucide-react';

interface RegisteredSquadsProps {
  teams: Team[];
  currentUser: User | null;
  onOpenRegister: () => void;
  onPromptAuth: (actionName: string) => void;
}

export const RegisteredSquads: React.FC<RegisteredSquadsProps> = ({
  teams,
  currentUser,
  onOpenRegister,
  onPromptAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.captain.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = selectedRegion === 'ALL' || team.region === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  const handleRegisterClick = () => {
    if (!currentUser) {
      onPromptAuth('register a squad');
    } else {
      onOpenRegister();
    }
  };

  return (
    <section id="squads" className="py-16 border-t border-slate-800 bg-[#070b13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2 font-mono">
              <Users className="w-3.5 h-3.5" />
              <span>Championship Roster Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-['Chakra_Petch']">
              Registered <span className="text-emerald-400">Squads</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Explore participating teams, global seeding, and battle records across verified circuits.
            </p>
          </div>

          <button
            id="squads-signup-btn"
            onClick={handleRegisterClick}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold uppercase text-xs tracking-wider flex items-center gap-2 transition-colors cursor-pointer font-['Chakra_Petch']"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Sign Up Squad</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {['ALL', 'NA', 'EU', 'APAC', 'LATAM'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-['Chakra_Petch'] ${
                  selectedRegion === reg
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {reg === 'ALL' ? 'All Regions' : reg}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-squads-input"
              type="text"
              placeholder="Search team or captain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Squad Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="bg-[#0b101c] border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${team.logoColor} flex items-center justify-center font-['Chakra_Petch'] font-black text-white text-base shadow-md group-hover:scale-105 transition-transform`}
                >
                  {team.tag}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {team.region}
                  </span>
                  {team.seed && (
                    <span className="text-[10px] font-mono text-slate-400">
                      Seed #{team.seed}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-white text-base font-['Chakra_Petch'] mb-1 group-hover:text-emerald-400 transition-colors truncate">
                {team.name}
              </h3>
              <p className="text-xs text-slate-400 truncate mb-4">
                Captain: <span className="text-slate-300 font-medium">{team.captain}</span>
              </p>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Record</span>
                <span className="font-mono text-slate-300 font-semibold">
                  {team.wins ?? 0}W - {team.losses ?? 0}L
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <div className="text-center py-12 bg-slate-950/40 rounded-xl border border-slate-800">
            <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No squads found matching your search.</p>
          </div>
        )}
      </div>
    </section>
  );
};
