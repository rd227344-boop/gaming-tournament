import React, { useState, useEffect } from 'react';
import { TournamentItem, User } from '../types';
import { X, Gamepad2, Trophy, Users, Shield, CheckCircle2, Globe, AlertCircle } from 'lucide-react';

interface JoinTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournaments: TournamentItem[];
  preSelectedTournamentId?: string | null;
  currentUser: User | null;
  onJoinTournament: (tournamentId: string, teamData: { name: string; tag: string; captain: string; discord: string; region: string }) => void;
}

export const JoinTournamentModal: React.FC<JoinTournamentModalProps> = ({
  isOpen,
  onClose,
  tournaments,
  preSelectedTournamentId,
  currentUser,
  onJoinTournament,
}) => {
  const [selectedTournId, setSelectedTournId] = useState<string>('');
  const [teamName, setTeamName] = useState('');
  const [teamTag, setTeamTag] = useState('');
  const [captain, setCaptain] = useState('');
  const [discord, setDiscord] = useState('');
  const [region, setRegion] = useState('NA');
  const [agreedToRules, setAgreedToRules] = useState(true);

  // Pre-fill user data when opened
  useEffect(() => {
    if (currentUser) {
      setCaptain(currentUser.gamerTag);
      if (currentUser.teamName) setTeamName(currentUser.teamName);
      if (currentUser.teamTag) setTeamTag(currentUser.teamTag);
      if (currentUser.discord) setDiscord(currentUser.discord);
      if (currentUser.region && currentUser.region !== 'Global') setRegion(currentUser.region);
    }
  }, [currentUser, isOpen]);

  // Set initial selected tournament
  useEffect(() => {
    if (preSelectedTournamentId) {
      setSelectedTournId(preSelectedTournamentId);
    } else if (tournaments.length > 0 && !selectedTournId) {
      const openTournament = tournaments.find((t) => t.status === 'registration') || tournaments[0];
      setSelectedTournId(openTournament.id);
    }
  }, [preSelectedTournamentId, tournaments, isOpen]);

  if (!isOpen) return null;

  const activeTournament = tournaments.find((t) => t.id === selectedTournId) || tournaments[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !captain.trim() || !teamTag.trim() || !selectedTournId) return;

    onJoinTournament(selectedTournId, {
      name: teamName.trim(),
      tag: teamTag.trim().toUpperCase(),
      captain: captain.trim(),
      discord: discord.trim(),
      region,
    });

    onClose();
  };

  return (
    <div
      id="join-tournament-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="join-tournament-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl my-8 bg-[#0b101c] border border-slate-700/80 rounded-2xl shadow-2xl shadow-emerald-500/10 overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase font-['Chakra_Petch'] tracking-wide">
                  Register Squad for Tournament
                </h3>
                <p className="text-xs text-slate-400">
                  Lock in your squad's slot for the upcoming championship stage
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Target Tournament Selector */}
          <div>
            <label className="block text-slate-300 font-semibold uppercase font-mono tracking-wider mb-1.5">
              Select Target Tournament *
            </label>
            <select
              id="select-join-tournament-id"
              value={selectedTournId}
              onChange={(e) => setSelectedTournId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id} disabled={t.slotsFilled >= t.slotsTotal && t.status !== 'registration'}>
                  [{t.game}] {t.title} — ${t.prizePool.toLocaleString()} ({t.slotsFilled}/{t.slotsTotal} Slots)
                </option>
              ))}
            </select>
          </div>

          {/* Active Tournament Snapshot Card */}
          {activeTournament && (
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase font-mono">
                    {activeTournament.game}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase font-mono">
                    {activeTournament.format}
                  </span>
                </div>
                <p className="text-sm font-bold text-white font-['Chakra_Petch']">
                  {activeTournament.title}
                </p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                  <span>Starts: {activeTournament.startDate}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{activeTournament.entryFee}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 block font-semibold font-mono">
                  Prize Pool
                </span>
                <span className="text-base font-black text-amber-400 font-['Chakra_Petch']">
                  ${activeTournament.prizePool.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400 block font-mono font-bold mt-0.5">
                  {activeTournament.slotsTotal - activeTournament.slotsFilled} slots open
                </span>
              </div>
            </div>
          )}

          {/* Squad Name & Clan Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold uppercase font-mono tracking-wider mb-1.5">
                Squad / Team Name *
              </label>
              <input
                id="join-team-name-input"
                type="text"
                required
                placeholder="e.g. Apex Predators"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold uppercase font-mono tracking-wider mb-1.5">
                Tag (Max 5) *
              </label>
              <input
                id="join-team-tag-input"
                type="text"
                required
                maxLength={5}
                placeholder="APX"
                value={teamTag}
                onChange={(e) => setTeamTag(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm uppercase placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Captain IGN & Discord Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold uppercase font-mono tracking-wider mb-1.5">
                Captain Gamer Tag (IGN) *
              </label>
              <input
                id="join-captain-input"
                type="text"
                required
                placeholder="e.g. Phantom_Lead"
                value={captain}
                onChange={(e) => setCaptain(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold uppercase font-mono tracking-wider mb-1.5">
                Discord Handle / Match Hub
              </label>
              <input
                id="join-discord-input"
                type="text"
                placeholder="captain#1234"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-slate-300 font-semibold uppercase font-mono tracking-wider mb-1.5">
              Squad Home Region
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['NA', 'EU', 'APAC', 'LATAM'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer font-['Chakra_Petch'] ${
                    region === r
                      ? 'bg-emerald-500 text-black shadow'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Agreement */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-2.5">
            <input
              type="checkbox"
              id="rules-check"
              checked={agreedToRules}
              onChange={(e) => setAgreedToRules(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-emerald-500 rounded cursor-pointer"
            />
            <label htmlFor="rules-check" className="text-[11px] text-slate-400 cursor-pointer select-none">
              I certify that our roster meets all eligibility requirements, will connect to verified 128-tick servers, and adhere to official anti-cheat match protocols.
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white uppercase font-semibold text-xs tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!agreedToRules}
              id="submit-join-tournament-btn"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-black font-extrabold uppercase tracking-wider text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer font-['Chakra_Petch'] active:scale-95"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Confirm & Enroll Squad</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
