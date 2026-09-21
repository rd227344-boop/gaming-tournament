import React, { useState } from 'react';
import { Team, User } from '../types';
import { Users, X, Plus, UserPlus, Shield, Globe, Gamepad2, CheckCircle2, AlertCircle, LogIn } from 'lucide-react';
import { api } from '../services/api';

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  currentUser: User | null;
  onTeamCreated: (newTeam: Team) => void;
  onTeamJoined: (updatedTeam: Team) => void;
  onPromptAuth: (actionName: string) => void;
}

export const TeamManagementModal: React.FC<TeamManagementModalProps> = ({
  isOpen,
  onClose,
  teams,
  currentUser,
  onTeamCreated,
  onTeamJoined,
  onPromptAuth,
}) => {
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamTag, setTeamTag] = useState('');
  const [game, setGame] = useState('Valorant');
  const [region, setRegion] = useState<'NA' | 'EU' | 'APAC' | 'LATAM'>('NA');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onPromptAuth('create a team');
      return;
    }

    if (!teamName.trim() || !teamTag.trim()) {
      setError('Team name and Clan Tag are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const created = await api.teams.create(
        {
          name: teamName.trim(),
          tag: teamTag.trim().toUpperCase(),
          region,
          game,
          description: description.trim() || `Competitive ${game} squad.`,
        },
        currentUser
      );
      onTeamCreated(created);
      setIsCreatingTeam(false);
      setTeamName('');
      setTeamTag('');
      setDescription('');
    } catch (err: any) {
      setError(err?.message || 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (targetTeam: Team) => {
    if (!currentUser) {
      onPromptAuth('join a squad roster');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const updated = await api.teams.join(targetTeam.id, currentUser);
      onTeamJoined(updated);
    } catch (err: any) {
      setError(err?.message || 'Failed to join team.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.tag.toLowerCase().includes(q) ||
      (t.game && t.game.toLowerCase().includes(q))
    );
  });

  return (
    <div
      id="teams-management-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="teams-management-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#0a0f1d] border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 my-8 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0c1222] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-['Chakra_Petch']">
                Competitive Squads & Teams
              </h3>
              <p className="text-xs text-slate-400">
                Browse verified esports organizations, recruit free agents, or establish your own squad.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCreatingTeam && (
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    onPromptAuth('create a competitive team');
                  } else {
                    setIsCreatingTeam(true);
                  }
                }}
                className="hidden sm:flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-bold font-['Chakra_Petch'] uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Team
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Guest alert notice if guest */}
        {!currentUser && (
          <div className="px-5 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                You are browsing as a <strong>Guest</strong>. Guests can view rosters and win rates. Log in to create or join squads.
              </span>
            </div>
            <button
              onClick={() => onPromptAuth('create or join squads')}
              className="ml-2 underline font-semibold text-amber-300 hover:text-amber-200 cursor-pointer shrink-0"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Create Team Form (if toggled) */}
        {isCreatingTeam ? (
          <div className="p-5 sm:p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white font-['Chakra_Petch'] uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Establish New Competitive Squad
              </h4>
              <button
                type="button"
                onClick={() => setIsCreatingTeam(false)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                    Squad Name *
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Apex Predators"
                    required
                    className="w-full bg-[#111728] border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                    Clan Tag (2-5 Chars) *
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={teamTag}
                    onChange={(e) => setTeamTag(e.target.value.toUpperCase())}
                    placeholder="e.g. APX"
                    required
                    className="w-full bg-[#111728] border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                    Primary Game
                  </label>
                  <select
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    className="w-full bg-[#111728] border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Valorant">Valorant</option>
                    <option value="Counter-Strike 2">Counter-Strike 2</option>
                    <option value="Apex Legends">Apex Legends</option>
                    <option value="League of Legends">League of Legends</option>
                    <option value="Rocket League">Rocket League</option>
                    <option value="Rainbow Six Siege">Rainbow Six Siege</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                    Region
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as any)}
                    className="w-full bg-[#111728] border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="NA">North America (NA)</option>
                    <option value="EU">Europe (EU)</option>
                    <option value="APAC">Asia-Pacific (APAC)</option>
                    <option value="LATAM">Latin America (LATAM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Team Bio / Recruitment Statement
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your squad goals and open role requirements..."
                  className="w-full bg-[#111728] border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingTeam(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2.5 px-5 rounded-xl text-xs font-bold font-['Chakra_Petch'] uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Creating Squad...' : 'Found Team'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Teams List View */
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
            {/* Search and Mobile Create button */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search squads by name, tag, or game..."
                className="w-full sm:max-w-xs bg-[#111728] border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />

              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    onPromptAuth('create a competitive team');
                  } else {
                    setIsCreatingTeam(true);
                  }
                }}
                className="w-full sm:w-auto sm:hidden flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-bold font-['Chakra_Petch'] uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Team
              </button>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredTeams.map((team) => {
                const isUserInTeam =
                  currentUser &&
                  team.members?.some(
                    (m) => m.gamerTag.toLowerCase() === currentUser.gamerTag.toLowerCase()
                  );

                return (
                  <div
                    key={team.id}
                    className="p-4 rounded-xl bg-[#0e1424] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                  >
                    {/* Top line: Tag, Name, Game */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2 py-0.5 rounded font-mono font-black text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          [{team.tag}]
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3 text-cyan-400" /> {team.region}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-400">{team.wins || 0}W - {team.losses || 0}L</span>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-white font-['Chakra_Petch']">
                        {team.name}
                      </h4>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Gamepad2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{team.game || 'Valorant'}</span>
                        <span className="text-slate-600">•</span>
                        <span>Captain: <strong className="text-slate-300">{team.captain}</strong></span>
                      </div>

                      {team.description && (
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {team.description}
                        </p>
                      )}
                    </div>

                    {/* Members Pill list */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400 font-mono">
                        {team.members?.length || 1} Registered Members
                      </div>

                      {isUserInTeam ? (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Your Squad
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleJoinTeam(team)}
                          disabled={team.openToJoin === false}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold font-['Chakra_Petch'] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                            team.openToJoin !== false
                              ? 'bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/40'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          {team.openToJoin !== false ? 'Join Squad' : 'Roster Full'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
