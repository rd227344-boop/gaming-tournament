import React, { useState } from 'react';
import { X, Shield, CheckCircle, ArrowRight, Trophy } from 'lucide-react';
import { Team } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterTeam: (team: Omit<Team, 'id' | 'wins' | 'losses'>) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterTeam,
}) => {
  const [teamName, setTeamName] = useState('');
  const [tag, setTag] = useState('');
  const [captain, setCaptain] = useState('');
  const [discord, setDiscord] = useState('');
  const [region, setRegion] = useState<'NA' | 'EU' | 'APAC' | 'LATAM'>('NA');
  const [agreed, setAgreed] = useState(false);
  const [submittedTeam, setSubmittedTeam] = useState<Omit<Team, 'id' | 'wins' | 'losses'> | null>(null);

  if (!isOpen) return null;

  const gradientOptions = [
    'from-emerald-500 to-teal-600',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-rose-500 to-red-600',
    'from-amber-500 to-orange-600',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !tag || !captain || !agreed) return;

    const randomGradient = gradientOptions[Math.floor(Math.random() * gradientOptions.length)];
    const newTeamData = {
      name: teamName.trim(),
      tag: tag.trim().toUpperCase(),
      captain: captain.trim(),
      region,
      logoColor: randomGradient,
    };

    onRegisterTeam(newTeamData);
    setSubmittedTeam(newTeamData);
  };

  const handleResetAndClose = () => {
    setSubmittedTeam(null);
    setTeamName('');
    setTag('');
    setCaptain('');
    setDiscord('');
    setAgreed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#111622] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl my-8">
        {/* Close button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submittedTeam ? (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase font-gaming text-white">
                  Squad Registration
                </h3>
                <p className="text-xs text-slate-400">
                  Qualifiers Season 4 • Official Tournament Entry
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Squad / Team Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Vanguard"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Clan Tag (3-5 chars) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="e.g. APX"
                    value={tag}
                    onChange={(e) => setTag(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-600 focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Regional Server *
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as 'NA' | 'EU' | 'APAC' | 'LATAM')}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="NA">North America (NA)</option>
                    <option value="EU">Europe (EU)</option>
                    <option value="APAC">Asia-Pacific (APAC)</option>
                    <option value="LATAM">Latin America (LATAM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Captain In-Game Tag (IGN) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nightstalker#NA1"
                  value={captain}
                  onChange={(e) => setCaptain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Captain Discord ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. nightstalker_pro"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-400 leading-tight">
                    I confirm all 5 players agree to the tournament fair-play guidelines, hardware verification, and official anti-cheat requirements.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!agreed}
                className="w-full py-3.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] mt-6"
              >
                <span>Confirm & Lock In Squad</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <CheckCircle className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-bold font-gaming uppercase text-white mb-2">
              Squad Confirmed!
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto mb-6">
              Welcome to the arena. Your squad has been successfully registered into the official tournament roster.
            </p>

            {/* Generated Team Card */}
            <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 text-left max-w-sm mx-auto mb-6 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${submittedTeam.logoColor} flex items-center justify-center font-gaming font-extrabold text-white text-base shadow-md`}
                >
                  {submittedTeam.tag}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-gaming text-base">
                      {submittedTeam.name}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                      {submittedTeam.region}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Captain: {submittedTeam.captain}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Entry Status:</span>
                <span className="text-emerald-400 font-bold uppercase tracking-wider font-gaming">
                  Verified Seed
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase text-xs tracking-wider"
              >
                Back to Tournament Hub
              </button>
              <a
                href="#squads"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                View in Roster
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
