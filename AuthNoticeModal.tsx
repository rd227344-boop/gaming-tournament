import React from 'react';
import { ShieldAlert, LogIn, UserPlus, X, Lock } from 'lucide-react';

interface AuthNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
  onGoToSignup: () => void;
  actionName: string; // e.g. "Create a Tournament", "Register for a Tournament", "Create a Team", "Join a Squad"
}

export const AuthNoticeModal: React.FC<AuthNoticeModalProps> = ({
  isOpen,
  onClose,
  onGoToLogin,
  onGoToSignup,
  actionName,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="auth-notice-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="auth-notice-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#0c121e] border border-amber-500/30 rounded-2xl p-6 md:p-8 shadow-2xl shadow-amber-500/10"
      >
        {/* Close Button */}
        <button
          id="close-auth-notice"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold block">
              Guest Restriction
            </span>
            <h3 className="text-xl font-bold text-white font-['Chakra_Petch']">
              Account Required
            </h3>
          </div>
        </div>

        {/* Description */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-slate-300 leading-relaxed">
            You are currently browsing as a <strong className="text-amber-400">Guest</strong>. Guest users can view tournaments, search schedules, inspect rules, and check leaderboards.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            To <span className="text-white font-semibold">{actionName}</span>, please log in to your account or create a free competitive player profile.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="auth-notice-login-btn"
            onClick={() => {
              onClose();
              onGoToLogin();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            Log In Now
          </button>
          <button
            id="auth-notice-signup-btn"
            onClick={() => {
              onClose();
              onGoToSignup();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-500 text-white transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Create Account
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline cursor-pointer"
          >
            Continue browsing as guest
          </button>
        </div>
      </div>
    </div>
  );
};
