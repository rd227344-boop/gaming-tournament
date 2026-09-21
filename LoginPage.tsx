import React, { useState } from 'react';
import { LogIn, ArrowLeft, Shield, Swords, Sparkles, AlertCircle, CheckCircle2, User, KeyRound } from 'lucide-react';
import { User as UserType } from '../types';
import { api } from '../services/api';

interface LoginPageProps {
  onSuccess: (user: UserType) => void;
  onGoToSignup: () => void;
  onGoToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onGoToSignup,
  onGoToHome,
}) => {
  const [emailOrTag, setEmailOrTag] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrTag.trim()) {
      setError('Please enter your email address or Gamer Tag.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const user = await api.auth.login(emailOrTag.trim(), password);
      onSuccess(user);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (tag: string, pass: string) => {
    try {
      setLoading(true);
      setError(null);
      const user = await api.auth.login(tag, pass);
      onSuccess(user);
    } catch (err: any) {
      setError(err?.message || 'Quick demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-page-view" className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col justify-between relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header / Navigation Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10 mb-6">
        <button
          id="login-back-to-home-btn"
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

      {/* Main Login Card Container */}
      <div className="max-w-md w-full mx-auto z-10 flex-1 flex flex-col justify-center">
        <div className="bg-[#0b101c]/90 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60">
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3 shadow-inner">
              <LogIn className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch'] text-white tracking-wide">
              Player Authentication
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Sign in to manage tournaments, register squads, and access competitive lobbies.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 font-semibold">
                Email or Gamer Tag
              </label>
              <div className="relative">
                <input
                  id="login-email-input"
                  type="text"
                  value={emailOrTag}
                  onChange={(e) => setEmailOrTag(e.target.value)}
                  placeholder="e.g. Phoenix_Lead or captain@vortex.gg"
                  required
                  className="w-full bg-[#111728] border border-slate-700/80 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Password
                </label>
                <span className="text-xs text-slate-500 hover:text-emerald-400 cursor-pointer">
                  Forgot key?
                </span>
              </div>
              <div className="relative">
                <input
                  id="login-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security password"
                  className="w-full bg-[#111728] border border-slate-700/80 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                />
                <span className="text-xs text-slate-400">Remember on this device</span>
              </label>
              <span className="text-xs font-mono text-emerald-400/80 flex items-center gap-1">
                <Shield className="w-3 h-3" /> 128-bit Encrypted
              </span>
            </div>

            <button
              id="submit-login-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold font-['Chakra_Petch'] text-sm tracking-wider uppercase bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Enter Arena</span>
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Profiles */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> 1-Click Quick Demo Sign In
              </span>
              <span className="text-[10px] text-slate-500">Test pre-configured roles</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('captain@vortex.gg', 'password123')}
                className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-left transition-all group cursor-pointer"
              >
                <div className="text-[11px] font-bold text-slate-200 group-hover:text-emerald-300 truncate">
                  Team Captain
                </div>
                <div className="text-[9px] text-slate-500 truncate">Vortex Protocol</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('player@apex.gg', 'password123')}
                className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 text-left transition-all group cursor-pointer"
              >
                <div className="text-[11px] font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                  Solo Duelist
                </div>
                <div className="text-[9px] text-slate-500 truncate">Acrobat_X</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@proarena.gg', 'password123')}
                className="p-2 rounded-lg bg-white/5 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 text-left transition-all group cursor-pointer"
              >
                <div className="text-[11px] font-bold text-slate-200 group-hover:text-amber-300 truncate">
                  Host Arbiter
                </div>
                <div className="text-[9px] text-slate-500 truncate">ApexOrganizer</div>
              </button>
            </div>
          </div>

          {/* Switch to Signup */}
          <div className="mt-6 text-center text-xs text-slate-400">
            <span>Don't have a tournament account? </span>
            <button
              id="switch-to-signup-btn"
              onClick={onGoToSignup}
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline ml-1 cursor-pointer"
            >
              Sign up for free
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer info */}
      <div className="max-w-md w-full mx-auto text-center mt-6 z-10">
        <p className="text-xs text-slate-500">
          Guests can browse brackets & leaderboards without logging in.
        </p>
      </div>
    </div>
  );
};
