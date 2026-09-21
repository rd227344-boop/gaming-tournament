import React, { useState } from 'react';
import { Swords, Menu, X, LogIn, UserPlus, LogOut, PlusCircle, Trophy, FolderKanban } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onGoHome: () => void;
  onGoToTournaments: () => void;
  onGoToMyTournaments: () => void;
  onOpenCreateTournament: () => void;
  onGoToLogin: () => void;
  onGoToSignup: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onGoHome,
  onGoToTournaments,
  onGoToMyTournaments,
  onOpenCreateTournament,
  onGoToLogin,
  onGoToSignup,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b14]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* 1. Website Logo */}
          <button
            onClick={onGoHome}
            id="nav-logo-btn"
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-black font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-wider text-white uppercase font-['Chakra_Petch']">
                Gaming <span className="text-emerald-400">Tournament</span>
              </span>
              <p className="text-[10px] text-slate-400 hidden sm:block font-mono tracking-wide">
                Esports Hub • Free Fire & BGMI
              </p>
            </div>
          </button>

          {/* 2. Desktop Navigation Items: Home, Tournaments, Create Tournament */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            <button
              onClick={onGoHome}
              id="nav-link-home"
              className="px-3.5 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-['Chakra_Petch'] cursor-pointer"
            >
              Home
            </button>

            <button
              onClick={onGoToTournaments}
              id="nav-link-tournaments"
              className="px-3.5 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-['Chakra_Petch'] cursor-pointer flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Tournaments</span>
            </button>

            <button
              onClick={onGoToMyTournaments}
              id="nav-link-my-tournaments"
              className="px-3.5 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-['Chakra_Petch'] cursor-pointer flex items-center gap-1.5"
            >
              <FolderKanban className="w-4 h-4 text-cyan-400" />
              <span>My Tournaments</span>
            </button>

            <button
              onClick={onOpenCreateTournament}
              id="nav-link-create-tournament"
              className="px-3.5 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-300 hover:text-white hover:bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 rounded-xl transition-all font-['Chakra_Petch'] cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Create Tournament</span>
            </button>
          </nav>

          {/* 3. Auth Actions: Login & Signup (or user profile & Logout) */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${currentUser.avatarColor || 'from-emerald-500 to-teal-600'} flex items-center justify-center text-xs font-black text-black font-['Chakra_Petch']`}>
                    {currentUser.gamerTag.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-white font-['Chakra_Petch'] block leading-tight">
                      {currentUser.gamerTag}
                      {currentUser.teamTag && (
                        <span className="ml-1 text-[10px] text-cyan-300 font-mono">
                          [{currentUser.teamTag}]
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  id="nav-logout-btn"
                  className="p-2.5 text-slate-400 hover:text-rose-400 rounded-xl bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-colors cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={onGoToLogin}
                  id="nav-login-btn"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer font-['Chakra_Petch']"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-400" />
                  <span>Login</span>
                </button>

                <button
                  onClick={onGoToSignup}
                  id="nav-signup-btn"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer font-['Chakra_Petch']"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Signup</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            {!currentUser && (
              <button
                onClick={onGoToLogin}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase font-['Chakra_Petch']"
              >
                Login
              </button>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden border-b border-slate-800 bg-[#080c16]/98 px-4 pt-3 pb-5 space-y-2 shadow-2xl">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onGoHome();
            }}
            className="w-full text-left px-3 py-2 text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-white rounded-lg hover:bg-white/5 font-['Chakra_Petch']"
          >
            Home
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onGoToTournaments();
            }}
            className="w-full text-left px-3 py-2 text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-white rounded-lg hover:bg-white/5 font-['Chakra_Petch'] flex items-center gap-2"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Tournaments
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onGoToMyTournaments();
            }}
            className="w-full text-left px-3 py-2 text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-white rounded-lg hover:bg-white/5 font-['Chakra_Petch'] flex items-center gap-2"
          >
            <FolderKanban className="w-4 h-4 text-cyan-400" />
            My Tournaments
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCreateTournament();
            }}
            className="w-full text-left px-3 py-2 text-sm font-bold uppercase tracking-wider text-emerald-300 hover:text-white rounded-lg bg-emerald-500/10 border border-emerald-500/30 font-['Chakra_Petch'] flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            Create Tournament
          </button>

          {currentUser ? (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${currentUser.avatarColor || 'from-emerald-500 to-teal-600'} flex items-center justify-center text-xs font-black text-black`}>
                  {currentUser.gamerTag.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-['Chakra_Petch']">
                    {currentUser.gamerTag}
                    {currentUser.teamTag && (
                      <span className="ml-1 text-[10px] text-cyan-300">[{currentUser.teamTag}]</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono capitalize">
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGoToLogin();
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 font-['Chakra_Petch']"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                Login
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGoToSignup();
                }}
                className="py-2.5 px-3 rounded-xl bg-emerald-500 text-black font-extrabold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 font-['Chakra_Petch']"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Signup
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
