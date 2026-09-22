import React, { useState } from 'react';
import { UserPlus, ArrowLeft, Swords, Shield, AlertCircle, CheckCircle2, Gamepad2, Globe, Users, Trophy } from 'lucide-react';
import { User as UserType } from '../types';
import { api } from "./api";

interface SignupPageProps {
  onSuccess: (user: UserType) => void;
  onGoToLogin: () => void;
  onGoToHome: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onSuccess,
  onGoToLogin,
  onGoToHome,
}) => {
  const [gamerTag, setGamerTag] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredGame, setPreferredGame] = useState('Valorant');
  const [region, setRegion] = useState<'NA' | 'EU' | 'APAC' | 'LATAM' | 'Global'>('NA');
  const [role, setRole] = useState<'player' | 'captain' | 'organizer'>('player');
  const [discord, setDiscord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gamerTag.trim() || !email.trim()) {
      setError('Gamer Tag and Email are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const user = await api.auth.signup({
        gamerTag: gamerTag.trim(),
        email: email.trim(),
        password,
        preferredGame,
        region,
        role,
        discord: discord.trim(),
      });
      onSuccess(user);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="signup-page-view" className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col justify-between relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[350px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-[600px] h-[300px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Top Header / Navigation Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10 mb-6">
        <button
          id="signup-back-to-home-btn"
          onClick={onGoToHome}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Arena Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Swords className="w-4 h-4 text-black" />
          </div>
          <span className="font-['Chakra_Petch'] font-bold text-white text-base tracking-wider hidden sm:inline">
            PRO ARENA
          </span>
        </div>
      </div>

      {/* Main Signup Card Container */}
      <div className="max-w-xl w-full mx-auto z-10 flex-1 flex flex-col justify-center">
        <div className="bg-[#0b101c]/90 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60">
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-inner">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch'] text-white tracking-wide">
              Create Player Account
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Join the official arena to host custom tournaments, create or join squads, and enter verified brackets.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 font-semibold">
                  Gamer Tag / IGN *
                </label>
                <input
                  id="signup-gamertag-input"
                  type="text"
                  value={gamerTag}
                  onChange={(e) => setGamerTag(e.target.value)}
                  placeholder="e.g. ShadowViper_99"
                  required
                  className="w-full bg-[#111728] border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 font-semibold">
                  Email Address *
                </label>
                <input
                  id="signup-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@gaming.com"
                  required
                  className="w-full bg-[#111728] border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 font-semibold">
                  Security Password
                </label>
                <input
                  id="signup-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password"
                  className="w-full bg-[#111728] border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 font-semibold">
                  Discord Tag (Optional)
                </label>
                <input
                  id="signup-discord-input"
                  type="text"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  placeholder="e.g. Viper#1234"
                  className="w-full bg-[#111728] border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 font-semibold flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" /> Preferred Game
                </label>
                <select
                  id="signup-game-select"
                  value={preferredGame}
                  onChange={(e) => setPreferredGame(e.target.value)}
                  className="w-full bg-[#111728] border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                >
                  <option value="Valorant">Valorant (5v5)</option>
                  <option value="Counter-Strike 2">Counter-Strike 2 (5v5)</option>
                  <option value="Apex Legends">Apex Legends (Trios)</option>
                  <option value="League of Legends">League of Legends (5v5)</option>
                  <option value="Rocket League">Rocket League (3v3)</option>
                  <option value="Rainbow Six Siege">Rainbow Six Siege (5v5)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 font-semibold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" /> Competitive Region
                </label>
                <select
                  id="signup-region-select"
                  value={region}
                  onChange={(e) => setRegion(e.target.value as any)}
                  className="w-full bg-[#111728] border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                >
                  <option value="NA">North America (NA)</option>
                  <option value="EU">Europe (EU)</option>
                  <option value="APAC">Asia-Pacific (APAC)</option>
                  <option value="LATAM">Latin America (LATAM)</option>
                  <option value="Global">Global / All Regions</option>
                </select>
              </div>
            </div>

            {/* Primary Role Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-semibold">
                Select Your Primary Arena Role
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('player')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    role === 'player'
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                      : 'bg-white/5 border-slate-700/60 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4 mb-1 text-cyan-400" />
                  <div className="text-xs font-bold font-['Chakra_Petch']">Solo Player</div>
                  <div className="text-[10px] text-slate-400">Join open teams</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('captain')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    role === 'captain'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                      : 'bg-white/5 border-slate-700/60 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <Users className="w-4 h-4 mb-1 text-emerald-400" />
                  <div className="text-xs font-bold font-['Chakra_Petch']">Team Captain</div>
                  <div className="text-[10px] text-slate-400">Manage squad roster</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('organizer')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    role === 'organizer'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                      : 'bg-white/5 border-slate-700/60 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <Trophy className="w-4 h-4 mb-1 text-amber-400" />
                  <div className="text-xs font-bold font-['Chakra_Petch']">Host Organizer</div>
                  <div className="text-[10px] text-slate-400">Create tournaments</div>
                </button>
              </div>
            </div>

            {/* Privilege Checklist */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Publish and configure custom community tournaments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Found squads or join verified open competitive rosters</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Register squads for cash prize pools and verified 128-tick brackets</span>
              </div>
            </div>

            <button
              id="submit-signup-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold font-['Chakra_Petch'] text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Player Profile...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Free Player Profile</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <button
              id="switch-to-login-btn"
              onClick={onGoToLogin}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline ml-1 cursor-pointer"
            >
              Log in here
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer info */}
      <div className="max-w-md w-full mx-auto text-center mt-6 z-10">
        <p className="text-xs text-slate-500">
          By registering, you agree to our 128-tick fair play anti-cheat regulations.
        </p>
      </div>
    </div>
  );
};
