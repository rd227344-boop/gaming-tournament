import React, { useState } from 'react';
import { TournamentRule } from '../types';
import { ShieldCheck, ChevronDown, ChevronUp, FileText, AlertCircle, HelpCircle } from 'lucide-react';

interface RulesAndFaqProps {
  rules: TournamentRule[];
}

export const RulesAndFaq: React.FC<RulesAndFaqProps> = ({ rules }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the tournament format and bracket structure?',
      a: 'The tournament follows a 64-team Double Elimination bracket. Matches are Best-of-3 (BO3) across all qualification and upper/lower rounds. The Grand Championship Final is a Best-of-5 (BO5) with map advantage given to the Upper Bracket finalist.',
    },
    {
      q: 'How does the anti-cheat verification process work?',
      a: 'All 5 rostered players must install and run the official tournament kernel-level anti-cheat client before queuing. Referees and tournament admins hold real-time inspection access and discord webcam/screen sharing rights.',
    },
    {
      q: 'When do squad registrations close?',
      a: 'Squad registration closes 24 hours prior to Stage 1 kickoff, or immediately once all 64 tournament slots are filled. Rosters lock at the same deadline.',
    },
    {
      q: 'How are prize payouts disbursed to winning teams?',
      a: 'Prize funds are wired to verified team captain bank accounts or designated esports organization entities within 7 business days following the conclusion of the Grand Finals.',
    },
  ];

  return (
    <section id="rules" className="py-16 border-t border-white/10 bg-[#090d16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Rules Section */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Competitive Integrity</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white font-gaming mb-4">
              Tournament <span className="text-emerald-400">Rules</span>
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Every competitor is held to rigorous global standards of fair play and competitive conduct.
            </p>

            <div className="space-y-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-[#111622] border border-white/10 rounded-xl p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white text-sm sm:text-base font-gaming">
                      {rule.title}
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded">
                      {rule.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {rule.details}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                Zero tolerance policy for match fixing, scripting, or unauthorized third-party overlays. Violations result in immediate squad disqualification and a 24-month circuit ban.
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Participant Inquiries</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white font-gaming mb-4">
              Frequently <span className="text-cyan-400">Asked</span>
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Key information for team captains, players, and spectators.
            </p>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="bg-[#111622] border border-white/10 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full py-4 px-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-bold text-sm text-white font-gaming pr-4">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Support Callout */}
            <div className="mt-8 bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white font-gaming">
                    Official 2026 Rulebook PDF
                  </h4>
                  <p className="text-xs text-slate-400">
                    Complete 42-page tournament governance manual
                  </p>
                </div>
              </div>
              <a
                href="#rules"
                onClick={(e) => {
                  e.preventDefault();
                  alert('The complete Official Tournament Rulebook v4.2 (PDF) is accessible to all verified team captains.');
                }}
                className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white uppercase tracking-wider shrink-0 transition-colors"
              >
                View Rules
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
