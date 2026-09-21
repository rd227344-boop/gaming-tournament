import React from 'react';
import { Swords, Mail, MessageSquare, Shield, HelpCircle, Trophy, Flame } from 'lucide-react';

interface FooterProps {
  onGoHome?: () => void;
  onGoToTournaments?: () => void;
  onOpenCreateTournament?: () => void;
  onSelectGame?: (gameId: string) => void;
  onFilterFreeFire?: () => void;
  onFilterBGMI?: () => void;
  onGoToLogin?: () => void;
  onGoToSignup?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onGoHome,
  onGoToTournaments,
  onOpenCreateTournament,
  onSelectGame,
  onFilterFreeFire,
  onFilterBGMI,
  onGoToLogin,
  onGoToSignup,
}) => {
  return (
    <footer className="border-t border-slate-800 bg-[#060911] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: About Platform */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-black font-bold shadow-md shadow-emerald-500/20">
                <Swords className="w-4 h-4" />
              </div>
              <span className="text-base font-black uppercase text-white font-['Chakra_Petch']">
                Gaming <span className="text-emerald-400">Tournament</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Competitive esports tournament and scrim hosting platform. Dedicated brackets and official point matrix calculators for Free Fire, BGMI, Valorant, CS2, Apex Legends, COD Mobile, and League of Legends.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Anti-Cheat & Fair Play Verified</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs font-['Chakra_Petch'] tracking-wider mb-3">
              Competitive Titles
            </h4>
            <ul className="space-y-2 font-['Chakra_Petch'] text-xs font-medium">
              <li>
                <button
                  onClick={() => (onSelectGame ? onSelectGame('free-fire') : onFilterFreeFire?.())}
                  className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Free Fire Tournaments</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => (onSelectGame ? onSelectGame('bgmi') : onFilterBGMI?.())}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>BGMI Championships</span>
                </button>
              </li>
              {onSelectGame && (
                <>
                  <li>
                    <button
                      onClick={() => onSelectGame('valorant')}
                      className="hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      Valorant Masters
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onSelectGame('counter-strike-2')}
                      className="hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      Counter-Strike 2
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onSelectGame('cod-mobile')}
                      className="hover:text-yellow-400 transition-colors cursor-pointer"
                    >
                      Call of Duty Mobile
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3: Useful Resources & Account */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs font-['Chakra_Petch'] tracking-wider mb-3">
              Player Hub & Account
            </h4>
            <ul className="space-y-2 font-['Chakra_Petch'] text-xs font-medium">
              {onGoToLogin && (
                <li>
                  <button
                    onClick={onGoToLogin}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Player Login
                  </button>
                </li>
              )}
              {onGoToSignup && (
                <li>
                  <button
                    onClick={onGoToSignup}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Create Squad Account
                  </button>
                </li>
              )}
              <li className="text-slate-400">
                Official Placement Scoring Matrix
              </li>
              <li className="text-slate-400">
                Tournament Organizer Guidelines
              </li>
              <li className="text-slate-400">
                Anti-Cheat Policy & Emulators Ban
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Community Support */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs font-['Chakra_Petch'] tracking-wider mb-3">
              Contact & Support
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Have questions or need assistance with custom room credentials? Get in touch with our team.
            </p>
            <div className="space-y-2.5 font-mono text-[11px]">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>support@gamingtournament.gg</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Discord: discord.gg/gamingtournament</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Fair Play Arbiters: 24/7 Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Gaming Tournament Arena. All rights reserved.</p>
          <p className="font-mono">
            Free Fire is a trademark of Garena • BGMI is a trademark of Krafton.
          </p>
        </div>
      </div>
    </footer>
  );
};
