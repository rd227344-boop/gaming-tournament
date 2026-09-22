import React, { useState, useEffect } from 'react';
import { PointTableStyleConfig, TournamentItem, User } from './types';
import {
  X,
  PlusCircle,
  Shield,
  Flame,
  Table,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  Gamepad2,
  Crosshair,
  Target,
  Zap,
  Sword,
  Sparkles,
  FileText,
  Palette,
  Download,
  FileSpreadsheet,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { COMPETITIVE_GAMES, getGameById } from './gamesData';
import {
  formatKillsForDisplay,
  getDefaultStyleConfig,
  getPlacementPoints,
  sanitizeKillsInput
} from './tournamentUtils';
  import { exportPointTableToCSV, exportPointTableToExcel, exportPointTableToPDF } from './exportUtils';
import { StyleGalleryModal } from './StyleGalleryModal';
import { api } from './api';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onCreateTournament: (tournament: TournamentItem) => void;
  onPromptAuth: (actionName: string) => void;
  initialGame?: string | null;
  initialPurpose?: 'point-table' | 'tournament' | null;
}

type FlowStep = 'select-game' | 'select-purpose' | 'point-table' | 'tournament-form';

interface PointTableRow {
  id: string;
  teamName: string;
  kills: number;
  rank: number;
}

export const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreateTournament,
  onPromptAuth,
  initialGame,
  initialPurpose,
}) => {
  // Multi-step flow state: 'select-game' -> 'select-purpose' -> ('point-table' | 'tournament-form')
  const [currentStep, setCurrentStep] = useState<FlowStep>('select-game');
  const [selectedGame, setSelectedGame] = useState<string>('Free Fire');
  const [copiedTable, setCopiedTable] = useState(false);

  // Tournament details form state
  const [title, setTitle] = useState('');
  const [format, setFormat] = useState('12 Squads Battle Royale (6 Matches)');
  const [region, setRegion] = useState<'India' | 'Global' | 'NA' | 'EU' | 'APAC' | 'LATAM'>('India');
  const [prizePool, setPrizePool] = useState('50000');
  const [entryFeeType, setEntryFeeType] = useState<'free' | 'paid'>('free');
  const [entryFeeAmount, setEntryFeeAmount] = useState('100');
  const [slotsTotal, setSlotsTotal] = useState(48);
  const [startDate, setStartDate] = useState('Oct 20, 2026');
  const [rulesText, setRulesText] = useState(
    '1. Valid platform account required.\n2. Room credentials distributed 15 minutes prior to match.\n3. Screenshot of end-game scoreboard required for verification.'
  );

  // Point table generator state
  const [matchTitle, setMatchTitle] = useState('Match 1: Bermuda / Erangel');
  const [tableRows, setTableRows] = useState<PointTableRow[]>([
    { id: '1', teamName: 'Team Soul', kills: 8, rank: 1 },
    { id: '2', teamName: 'GodLike Esports', kills: 6, rank: 2 },
    { id: '3', teamName: 'Orangutan Elite', kills: 5, rank: 3 },
    { id: '4', teamName: 'Entity Gaming', kills: 4, rank: 4 },
    { id: '5', teamName: 'Global Esports', kills: 3, rank: 5 },
  ]);
  const [newTeamName, setNewTeamName] = useState('');

  // Style customization state
  const [styleConfig, setStyleConfig] = useState<PointTableStyleConfig>(getDefaultStyleConfig());
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);

  // Download menu & saving state
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Handle initialization based on props
  useEffect(() => {
    if (!isOpen) return;

    if (initialGame) {
      const match = getGameById(initialGame);
      const gameName = match ? match.name : initialGame;
      setSelectedGame(gameName);
      configureDefaultsForGame(gameName);

      if (initialPurpose === 'point-table') {
        setCurrentStep('point-table');
      } else if (initialPurpose === 'tournament') {
        setTitle(`${gameName} Championship Cup`);
        setCurrentStep('tournament-form');
      } else {
        setCurrentStep('select-purpose');
      }
    } else {
      // Default creation flow from header / hero
      setCurrentStep('select-game');
    }
  }, [isOpen, initialGame, initialPurpose]);

  if (!isOpen) return null;

  // Configure sensible defaults based on chosen game
  const configureDefaultsForGame = (gameName: string) => {
    const clean = gameName.toLowerCase();
    if (clean.includes('free fire')) {
      setFormat('12 Squads Battle Royale (6 Matches)');
      setSlotsTotal(48);
      setRegion('India');
      setMatchTitle('Scrims Match 1: Bermuda');
      setRulesText(
        '1. Mobile devices only (No Emulators or iPads).\n2. Room credentials distributed 15 minutes prior to match via registered Discord/app.\n3. Official 12-point ranking matrix applied.'
      );
    } else if (clean.includes('bgmi')) {
      setFormat('16 Squads Battle Royale (6 Matches)');
      setSlotsTotal(64);
      setRegion('India');
      setMatchTitle('BGIS Scrims Match 1: Erangel');
      setRulesText(
        '1. Official BGIS 10-point scoring system (10, 6, 5, 4, 3, 2, 1, 1).\n2. Device screen recording mandatory for top 3 squads.\n3. Triggers & emulators strictly banned.'
      );
    } else if (clean.includes('valorant')) {
      setFormat('5v5 Double Elimination BO3');
      setSlotsTotal(32);
      setRegion('Global');
      setMatchTitle('Playoffs Match: Ascent');
      setRulesText(
        '1. Riot Vanguard anti-cheat client must remain active.\n2. Map veto conducted 30 minutes prior to match on match lobby.\n3. Tactical timeouts: 2 per team per map (60 seconds).'
      );
    } else if (clean.includes('counter-strike') || clean.includes('cs2')) {
      setFormat('5v5 MR12 Single Elimination');
      setSlotsTotal(16);
      setRegion('Global');
      setMatchTitle('Match 1: Mirage MR12');
      setRulesText(
        '1. Official Valve MR12 regulation rounds. Overtime MR3 ($10,000 start cash).\n2. Active Duty map pool veto.\n3. Verified Steam accounts with clean VAC history only.'
      );
    } else if (clean.includes('apex')) {
      setFormat('Trio Battle Royale (6 Matches)');
      setSlotsTotal(60);
      setRegion('Global');
      setMatchTitle('ALGS Match 1: World’s Edge');
      setRulesText(
        '1. 3-player squads. 1 kill = 1 tournament point.\n2. Match Point threshold rule in Grand Finals.\n3. POV stream delay minimum 180 seconds mandatory.'
      );
    } else if (clean.includes('cod') || clean.includes('duty')) {
      setFormat('5v5 Search & Destroy / Hardpoint');
      setSlotsTotal(32);
      setRegion('India');
      setMatchTitle('Hardpoint Match: Standoff');
      setRulesText(
        '1. Touchscreen mobile devices only (No controllers or emulators).\n2. Official CDL weapon and scorestreak restrictions.\n3. In-game screenshot of scoreboard required.'
      );
    } else if (clean.includes('league') || clean.includes('lol')) {
      setFormat('5v5 Tournament Draft BO3');
      setSlotsTotal(16);
      setRegion('Global');
      setMatchTitle('Summoners Rift Series BO3');
      setRulesText(
        '1. Tournament Draft mode on live patch.\n2. Fearless draft rules in BO3 deciders.\n3. Verified seasonal rank eligibility.'
      );
    } else {
      setFormat('Standard Bracket / Lobby');
      setSlotsTotal(32);
    }
  };

  // Reset to initial step when closing
  const handleModalClose = () => {
    setCurrentStep('select-game');
    onClose();
  };

  // Official Placement Points Matrices
  const getPlacementPoints = (rank: number, gameName: string): number => {
    const clean = gameName.toLowerCase();
    if (clean.includes('free fire')) {
      // Free Fire Official 12-point system
      switch (rank) {
        case 1: return 12;
        case 2: return 9;
        case 3: return 8;
        case 4: return 7;
        case 5: return 6;
        case 6: return 5;
        case 7: return 4;
        case 8: return 3;
        case 9: return 2;
        case 10: return 1;
        default: return 0;
      }
    } else if (clean.includes('bgmi')) {
      // BGMI BGIS/BMPS Official 10-point system
      switch (rank) {
        case 1: return 10;
        case 2: return 6;
        case 3: return 5;
        case 4: return 4;
        case 5: return 3;
        case 6: return 2;
        case 7: return 1;
        case 8: return 1;
        default: return 0;
      }
    } else if (clean.includes('apex')) {
      // ALGS matrix
      switch (rank) {
        case 1: return 12;
        case 2: return 9;
        case 3: return 7;
        case 4: return 5;
        case 5: return 4;
        case 6: return 3;
        case 7: return 3;
        case 8: return 2;
        case 9: return 2;
        case 10: return 2;
        case 11:
        case 12:
        case 13:
        case 14:
        case 15: return 1;
        default: return 0;
      }
    } else if (clean.includes('cod') || clean.includes('duty')) {
      // CODM BR matrix
      switch (rank) {
        case 1: return 15;
        case 2: return 12;
        case 3: return 10;
        case 4: return 8;
        case 5: return 6;
        case 6: return 5;
        case 7: return 4;
        case 8: return 3;
        case 9: return 2;
        case 10: return 1;
        default: return 0;
      }
    } else {
      // Default bracket points
      return Math.max(0, 11 - rank);
    }
  };

  // Handle Game Selection -> proceeds to Step 2 (Purpose Selection)
  const handleSelectGame = (gameName: string) => {
    setSelectedGame(gameName);
    configureDefaultsForGame(gameName);
    setCurrentStep('select-purpose');
  };

  // Handle Purpose selection
  const handleSelectPurpose = (purpose: 'point-table' | 'tournament') => {
    if (purpose === 'point-table') {
      setCurrentStep('point-table');
    } else {
      if (!title) {
        setTitle(`${selectedGame} Championship Cup`);
      }
      setCurrentStep('tournament-form');
    }
  };

  // Point Table Helper: Add Team
  const handleAddTeamToTable = () => {
    if (!newTeamName.trim()) return;
    const newRow: PointTableRow = {
      id: `row-${Date.now()}`,
      teamName: newTeamName.trim(),
      kills: 0,
      rank: tableRows.length + 1,
    };
    setTableRows([...tableRows, newRow]);
    setNewTeamName('');
  };

  // Point Table Helper: Remove Team
  const handleRemoveTeam = (id: string) => {
    setTableRows(tableRows.filter((r) => r.id !== id));
  };

  // Point Table Helper: Update row (sanitizes kills leading zeros: 010 -> 10, 005 -> 5, 0 -> 0)
  const handleUpdateRow = (id: string, field: 'kills' | 'rank', val: string | number) => {
    setTableRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (field === 'kills') {
            return { ...r, kills: sanitizeKillsInput(val) };
          } else {
            return { ...r, rank: Math.max(1, parseInt(String(val), 10) || 1) };
          }
        }
        return r;
      })
    );
  };

  // Sort point table by points
  const handleSortPointTable = () => {
    const sorted = [...tableRows].sort((a, b) => {
      const ptsA = getPlacementPoints(a.rank, selectedGame) + a.kills;
      const ptsB = getPlacementPoints(b.rank, selectedGame) + b.kills;
      return ptsB - ptsA;
    });
    const reRanked = sorted.map((row, idx) => ({
      ...row,
      rank: idx + 1
    }));
    setTableRows(reRanked);
  };

  // Explicit "SAVE TOURNAMENT" button action for point table
  const handleSavePointTableAsTournament = async () => {
    if (!currentUser) {
      onPromptAuth('save tournament');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const gameInfo = getGameById(selectedGame);
      const bannerGradient = gameInfo?.bannerGradient || 'from-emerald-500 via-teal-700 to-slate-900';

      const pointTableRows = tableRows.map((r) => {
        const placePts = getPlacementPoints(r.rank, selectedGame);
        return {
          id: r.id,
          teamName: r.teamName,
          rank: r.rank,
          kills: r.kills,
          placePoints: placePts,
          totalPoints: placePts + r.kills
        };
      });

      const tournData: Partial<TournamentItem> & { title: string; game: string } = {
        title: matchTitle.trim() || `${selectedGame} Scrims Standings`,
        game: selectedGame,
        gameCategory: gameInfo?.category.toLowerCase().includes('fps') ? 'fps' : 'br',
        bannerGradient,
        format: format || '12 Squads Battle Royale (6 Matches)',
        prizePool: Number(prizePool) || 0,
        entryFee: entryFeeType === 'free' ? 'Free Entry' : `₹${entryFeeAmount} / Squad`,
        status: 'live',
        startDate,
        region,
        slotsTotal: Number(slotsTotal) || 32,
        slotsFilled: tableRows.length,
        description: `Official point table and match standings for ${selectedGame}. Fair-play verified scoring.`,
        organizerName: currentUser.gamerTag,
        rules: [
          'Official scoring matrix applied.',
          'Fair play rules enforced.',
          'Screenshot proof required for score disputes.'
        ],
        registeredSquadNames: tableRows.map((r) => r.teamName),
        pointTable: {
          matchTitle: matchTitle.trim(),
          scoringSystem: `Official ${selectedGame} Scoring Matrix`,
          rows: pointTableRows
        },
        styleConfig,
        isSavedProject: true
      };

      const saved = await api.tournaments.saveTournament(tournData, currentUser);
      setSaveSuccess('Tournament and Point Table successfully saved to your account!');
      onCreateTournament(saved);

      setTimeout(() => {
        handleModalClose();
      }, 1500);
    } catch (err: any) {
      setSaveError(err?.message || 'Server error: Failed to save tournament. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Point Table Copy to Clipboard
  const handleCopyStandings = () => {
    const sorted = [...tableRows].sort((a, b) => {
      const ptsA = getPlacementPoints(a.rank, selectedGame) + a.kills;
      const ptsB = getPlacementPoints(b.rank, selectedGame) + b.kills;
      return ptsB - ptsA;
    });

    let text = `🏆 ${selectedGame.toUpperCase()} POINT TABLE - ${matchTitle} 🏆\n\n`;
    text += `# | Team Name | Place Pts | Kill Pts | Total Pts\n`;
    text += `----------------------------------------------\n`;
    sorted.forEach((row, idx) => {
      const placePts = getPlacementPoints(row.rank, selectedGame);
      const total = placePts + row.kills;
      text += `${idx + 1}. ${row.teamName.padEnd(16, ' ')} | ${placePts} pts | ${row.kills} kills | ${total} pts\n`;
    });
    text += `\nScoring Matrix: Official ${selectedGame} Scoring. Generated on Gaming Tournament platform.`;

    navigator.clipboard.writeText(text);
    setCopiedTable(true);
    setTimeout(() => setCopiedTable(false), 2500);
  };

  // Tournament Form Submit
  const handleTournamentFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      handleModalClose();
      onPromptAuth('create a tournament');
      return;
    }

    if (!title.trim()) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    const gameInfo = getGameById(selectedGame);
    const bannerGradient = gameInfo?.bannerGradient || 'from-emerald-500 via-teal-700 to-slate-900';

    const parsedRules = rulesText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const pointTableRows = tableRows.map((r) => {
      const placePts = getPlacementPoints(r.rank, selectedGame);
      return {
        id: r.id,
        teamName: r.teamName,
        rank: r.rank,
        kills: r.kills,
        placePoints: placePts,
        totalPoints: placePts + r.kills
      };
    });

    const newTournamentData: Partial<TournamentItem> & { title: string; game: string } = {
      title: title.trim(),
      game: selectedGame,
      gameCategory: gameInfo?.category.toLowerCase().includes('fps') ? 'fps' : 'br',
      bannerGradient,
      format,
      prizePool: Number(prizePool) || 0,
      entryFee: entryFeeType === 'free' ? 'Free Entry' : `₹${entryFeeAmount} / Squad`,
      status: 'registration',
      startDate,
      region,
      slotsTotal: Number(slotsTotal) || 32,
      slotsFilled: 1,
      featured: false,
      description: `${selectedGame} competitive tournament hosted by ${currentUser.gamerTag}. Format: ${format}. Registration is open to verified squads.`,
      organizerName: currentUser.gamerTag,
      rules: parsedRules.length > 0 ? parsedRules : ['Standard competitive esports rules apply.'],
      registeredSquadNames: [currentUser.teamName || `${currentUser.gamerTag}'s Squad`],
      pointTable: {
        matchTitle: matchTitle.trim() || `${title.trim()} Standings`,
        scoringSystem: `Official ${selectedGame} Scoring Matrix`,
        rows: pointTableRows
      },
      styleConfig,
      isSavedProject: true
    };

    try {
      const saved = await api.tournaments.saveTournament(newTournamentData, currentUser);
      setSaveSuccess('Tournament created and saved to your account!');
      onCreateTournament(saved);
      setTimeout(() => {
        handleModalClose();
      }, 1000);
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to save tournament to server.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper icons
  const getGameIcon = (name: string) => {
    const clean = name.toLowerCase();
    if (clean.includes('free fire')) return <Flame className="w-5 h-5 text-orange-400" />;
    if (clean.includes('bgmi')) return <Shield className="w-5 h-5 text-emerald-400" />;
    if (clean.includes('valorant')) return <Crosshair className="w-5 h-5 text-rose-400" />;
    if (clean.includes('counter-strike') || clean.includes('cs2')) return <Target className="w-5 h-5 text-amber-400" />;
    if (clean.includes('apex')) return <Zap className="w-5 h-5 text-cyan-400" />;
    if (clean.includes('cod') || clean.includes('duty')) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (clean.includes('league') || clean.includes('lol')) return <Sword className="w-5 h-5 text-blue-400" />;
    return <Gamepad2 className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0c1322] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-['Chakra_Petch'] tracking-wide">
                {currentStep === 'select-game' && 'Select Esports Title'}
                {currentStep === 'select-purpose' && `Configure ${selectedGame}`}
                {currentStep === 'point-table' && `${selectedGame} Point Table Generator`}
                {currentStep === 'tournament-form' && `Organise ${selectedGame} Tournament`}
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                {currentStep === 'select-game' && 'Step 1 of 3: Choose competitive battleground'}
                {currentStep === 'select-purpose' && 'Step 2 of 3: Select Point Table or Organise Tournament'}
                {currentStep === 'point-table' && 'Step 3: Calculate standings with official scoring matrix'}
                {currentStep === 'tournament-form' && 'Step 3: Specify bracket schedule, slots & prize pool'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleModalClose}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= STEP 1: GAME SELECTION ================= */}
        {currentStep === 'select-game' && (
          <div className="p-5 sm:p-6">
            <div className="text-center max-w-md mx-auto mb-6">
              <h3 className="text-lg font-bold text-white font-['Chakra_Petch'] uppercase tracking-wide">
                Choose Game to Continue
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select your esport title. The form will automatically configure the official scoring matrix and room structure.
              </p>
            </div>

            {/* List of 7 Competitive Games */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {COMPETITIVE_GAMES.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  id={`select-game-${g.id}-btn`}
                  onClick={() => handleSelectGame(g.name)}
                  className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/70 text-left transition-all cursor-pointer group flex items-start gap-3.5 shadow-sm active:scale-98"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getGameIcon(g.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-sm font-black text-white font-['Chakra_Petch'] uppercase truncate group-hover:text-emerald-300">
                        {g.name}
                      </h4>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {g.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {g.formatSummary}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 2: PURPOSE SELECTION ================= */}
        {currentStep === 'select-purpose' && (
          <div className="p-5 sm:p-6">
            {/* Back to Game Selection */}
            <button
              type="button"
              onClick={() => setCurrentStep('select-game')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono mb-4 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Change Game (Current: {selectedGame})</span>
            </button>

            <div className="text-center max-w-md mx-auto mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-[11px] font-mono uppercase mb-2">
                Selected: {selectedGame}
              </span>
              <h3 className="text-xl font-black text-white font-['Chakra_Petch'] uppercase">
                What Would You Like to Do?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Generate an official points table for finished scrims, or publish a full open tournament for squads to register.
              </p>
            </div>

            {/* Option A & Option B Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Normal Point Table */}
              <div
                id="option-normal-point-table"
                onClick={() => handleSelectPurpose('point-table')}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500 transition-all cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-amber-500/10 active:scale-98"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                    <Table className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
                    Option A
                  </span>
                  <h4 className="text-lg font-black text-white font-['Chakra_Petch'] uppercase mb-2">
                    Create Normal Point Table
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Instantly calculate placements, MVP finishes, and kill points with {selectedGame}&apos;s official scoring matrix. Export or copy standings to Discord/WhatsApp.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400 font-['Chakra_Petch'] uppercase">
                  <span>Generate Points Table</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Option B: Organise Tournament */}
              <div
                id="option-organise-tournament"
                onClick={() => handleSelectPurpose('tournament')}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-emerald-500/10 active:scale-98"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                    Option B
                  </span>
                  <h4 className="text-lg font-black text-white font-['Chakra_Petch'] uppercase mb-2">
                    Organise Tournament
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Set up a verified open or invitation-based tournament with prize pools, custom rules, squad slot limits, and live team registration.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400 font-['Chakra_Petch'] uppercase">
                  <span>Setup Tournament Form</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3A: POINT TABLE GENERATOR ================= */}
        {currentStep === 'point-table' && (
          <div className="p-5 sm:p-6 max-h-[580px] overflow-y-auto">
            {/* Header / Sub-nav */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <button
                type="button"
                onClick={() => setCurrentStep('select-purpose')}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                <span>Back to Purpose</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Customize Design Button */}
                <button
                  type="button"
                  onClick={() => setIsStyleModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Customize Design</span>
                </button>

                {/* Download Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-400 text-xs font-mono text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download</span>
                  </button>

                  {isDownloadMenuOpen && (
                    <div className="absolute right-0 mt-1 w-44 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-30 p-1 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDownloadMenuOpen(false);
                          exportPointTableToPDF(
                            matchTitle || `${selectedGame} Tournament`,
                            selectedGame,
                            matchTitle,
                            tableRows.map((r) => ({
                              ...r,
                              placePoints: getPlacementPoints(r.rank, selectedGame),
                              totalPoints: getPlacementPoints(r.rank, selectedGame) + r.kills
                            })),
                            styleConfig
                          );
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-rose-400" />
                        <span>Download PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDownloadMenuOpen(false);
                          exportPointTableToExcel(
                            matchTitle || `${selectedGame} Tournament`,
                            selectedGame,
                            matchTitle,
                            tableRows.map((r) => ({
                              ...r,
                              placePoints: getPlacementPoints(r.rank, selectedGame),
                              totalPoints: getPlacementPoints(r.rank, selectedGame) + r.kills
                            }))
                          );
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Download Excel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDownloadMenuOpen(false);
                          exportPointTableToCSV(
                            matchTitle || `${selectedGame} Tournament`,
                            selectedGame,
                            matchTitle,
                            tableRows.map((r) => ({
                              ...r,
                              placePoints: getPlacementPoints(r.rank, selectedGame),
                              totalPoints: getPlacementPoints(r.rank, selectedGame) + r.kills
                            }))
                          );
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                        <span>Download CSV</span>
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-xs font-mono text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded-md">
                  {selectedGame} Scoring
                </span>
              </div>
            </div>

            {/* Error or Success feedback banners */}
            {saveError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-2 text-rose-300 text-xs font-mono">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}
            {saveSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center gap-2 text-emerald-300 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveSuccess}</span>
              </div>
            )}

            {/* Match Label Input & Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Match Title / Scrim Round Label
                </label>
                <input
                  type="text"
                  value={matchTitle}
                  onChange={(e) => setMatchTitle(e.target.value)}
                  placeholder="e.g. Scrims Match 1: Bermuda / Erangel"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleSortPointTable}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-xs font-bold text-amber-300 font-['Chakra_Petch'] uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Auto-Sort by Points</span>
                </button>
              </div>
            </div>

            {/* Quick Add Squad Form */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTeamToTable()}
                placeholder="Enter squad / player name to add..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTeamToTable}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs font-['Chakra_Petch'] flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Squad</span>
              </button>
            </div>

            {/* Table Matrix with live style config */}
            <div
              className={`rounded-xl border ${styleConfig.borderColor} overflow-hidden mb-5 transition-all shadow-xl`}
              style={{
                backgroundColor: '#0a0f1d',
                backgroundImage: styleConfig.customBgImage
                  ? `linear-gradient(rgba(10, 15, 29, 0.88), rgba(10, 15, 29, 0.92)), url(${styleConfig.customBgImage})`
                  : undefined,
                backgroundSize: 'cover'
              }}
            >
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/90 border-b border-slate-800 text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Squad Name</th>
                    <th className="py-2.5 px-3 text-center">Place Pts</th>
                    <th className="py-2.5 px-3 text-center">Kills (1 pt/ea)</th>
                    <th className="py-2.5 px-3 text-center">Total Pts</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tableRows.map((row) => {
                    const placePts = getPlacementPoints(row.rank, selectedGame);
                    const totalPts = placePts + row.kills;

                    return (
                      <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={row.rank}
                            onChange={(e) => handleUpdateRow(row.id, 'rank', e.target.value)}
                            className="w-12 px-1.5 py-1 rounded bg-slate-950 border border-slate-800 text-center text-white font-bold text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-white">
                          {row.teamName}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">
                          {placePts}
                        </td>
                        {/* Kills input with bug fix: strips leading zeros (010 -> 10, 005 -> 5, 0 -> 0) */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={formatKillsForDisplay(row.kills)}
                            onChange={(e) => handleUpdateRow(row.id, 'kills', e.target.value)}
                            className="w-16 px-1.5 py-1 rounded bg-slate-950 border border-slate-800 text-center text-amber-300 font-bold text-xs focus:border-amber-400 focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center font-black text-white text-sm font-['Chakra_Petch']">
                          {totalPts}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveTeam(row.id)}
                            className="text-slate-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                            title="Remove team"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Point Table Footer Action with Clearly Visible "SAVE TOURNAMENT" Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">
                Total Teams: {tableRows.length} • Kill Multiplier: 1 pt / elimination
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  id="copy-point-table-btn"
                  onClick={handleCopyStandings}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-bold uppercase text-xs font-['Chakra_Petch'] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedTable ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedTable ? 'Copied' : 'Copy Text'}</span>
                </button>

                {/* Primary SAVE TOURNAMENT Button */}
                <button
                  type="button"
                  id="save-tournament-action-btn"
                  disabled={isSaving}
                  onClick={handleSavePointTableAsTournament}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black uppercase text-xs font-['Chakra_Petch'] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isSaving ? 'Saving...' : 'Save Tournament'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3B: ORGANISATION / TOURNAMENT FORM ================= */}
        {currentStep === 'tournament-form' && (
          <form onSubmit={handleTournamentFormSubmit} className="p-5 sm:p-6 max-h-[580px] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setCurrentStep('select-purpose')}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                <span>Back to Purpose</span>
              </button>

              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-md">
                Title: {selectedGame}
              </span>
            </div>

            {/* Tournament Title */}
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Tournament Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g. ${selectedGame} Pro Championship Cup`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Format & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Format / Lobby Mode
                </label>
                <input
                  type="text"
                  required
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  placeholder="e.g. 12 Squads Battle Royale (6 Matches)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Server Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                >
                  <option value="India">India</option>
                  <option value="Global">Global</option>
                  <option value="NA">North America</option>
                  <option value="EU">Europe</option>
                  <option value="APAC">Asia Pacific</option>
                  <option value="LATAM">Latin America</option>
                </select>
              </div>
            </div>

            {/* Prize Pool & Total Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Prize Pool (INR ₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={prizePool}
                  onChange={(e) => setPrizePool(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Squad Slot Limit
                </label>
                <input
                  type="number"
                  min="4"
                  max="128"
                  value={slotsTotal}
                  onChange={(e) => setSlotsTotal(parseInt(e.target.value) || 32)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Entry Fee & Schedule Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Entry Fee
                </label>
                <div className="flex gap-2">
                  <select
                    value={entryFeeType}
                    onChange={(e) => setEntryFeeType(e.target.value as any)}
                    className="w-1/2 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="free">Free Entry</option>
                    <option value="paid">Paid (₹)</option>
                  </select>
                  {entryFeeType === 'paid' && (
                    <input
                      type="number"
                      min="10"
                      value={entryFeeAmount}
                      onChange={(e) => setEntryFeeAmount(e.target.value)}
                      placeholder="₹ Amount"
                      className="w-1/2 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Tournament Start Date
                </label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="e.g. Oct 28, 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Rules Text */}
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Tournament Rules & Guidelines
              </label>
              <textarea
                rows={3}
                value={rulesText}
                onChange={(e) => setRulesText(e.target.value)}
                placeholder="List tournament rules line by line..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 space-y-2">
              {saveError && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-2 text-rose-300 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center gap-2 text-emerald-300 text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                id="submit-create-tournament-btn"
                disabled={isSaving}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black uppercase text-xs sm:text-sm font-['Chakra_Petch'] tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25 active:scale-98 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <PlusCircle className="w-4 h-4 text-black" />}
                <span>{isSaving ? 'Publishing & Saving...' : `Publish & Save ${selectedGame} Tournament`}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Style Gallery Modal for Customizing Point Table */}
      <StyleGalleryModal
        isOpen={isStyleModalOpen}
        onClose={() => setIsStyleModalOpen(false)}
        currentStyle={styleConfig}
        onApplyStyle={(newStyle: PointTableStyleConfig) => setStyleConfig(newStyle)}
      />
    </div>
  );
};
