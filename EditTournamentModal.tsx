import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Download,
  Palette,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Shield,
  Trophy,
  Loader2
} from 'lucide-react';
import { PointTableStyleConfig, PointTableRowData, TournamentItem, User } from './types';
import {
  formatKillsForDisplay,
  getPlacementPoints,
  sanitizeKillsInput,
  getDefaultStyleConfig
} from './tournamentUtils';
import { exportPointTableToCSV, exportPointTableToExcel, exportPointTableToPDF } from './exportUtils';
import { StyleGalleryModal } from './StyleGalleryModal';
import { COMPETITIVE_GAMES } from './gamesData';


interface EditTournamentModalProps {
  isOpen: boolean;
  tournament: TournamentItem | null;
  onClose: () => void;
  currentUser: User | null;
  onSaveChanges: (updated: TournamentItem) => Promise<void>;
}

export const EditTournamentModal: React.FC<EditTournamentModalProps> = ({
  isOpen,
  tournament,
  onClose,
  currentUser,
  onSaveChanges,
}) => {
  // Tabs: 'point-table' | 'details'
  const [activeTab, setActiveTab] = useState<'point-table' | 'details'>('point-table');

  // Tournament general fields
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('Free Fire');
  const [format, setFormat] = useState('');
  const [status, setStatus] = useState<'registration' | 'live' | 'upcoming' | 'completed'>('registration');
  const [region, setRegion] = useState<'India' | 'Global' | 'NA' | 'EU' | 'APAC' | 'LATAM'>('India');
  const [prizePool, setPrizePool] = useState<number>(0);
  const [entryFee, setEntryFee] = useState('Free Entry');
  const [description, setDescription] = useState('');

  // Point table state
  const [matchTitle, setMatchTitle] = useState('Match 1');
  const [rows, setRows] = useState<PointTableRowData[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [customPlacementMode, setCustomPlacementMode] = useState(false);

  // Style state
  const [styleConfig, setStyleConfig] = useState<PointTableStyleConfig>(getDefaultStyleConfig());
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);

  // Download menu
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !tournament) return;

    setTitle(tournament.title || '');
    setGame(tournament.game || 'Free Fire');
    setFormat(tournament.format || '12 Squads Battle Royale (6 Matches)');
    setStatus(tournament.status || 'registration');
    setRegion((tournament.region as any) || 'India');
    setPrizePool(tournament.prizePool || 0);
    setEntryFee(tournament.entryFee || 'Free Entry');
    setDescription(tournament.description || '');

    // Setup Point Table
    if (tournament.pointTable && Array.isArray(tournament.pointTable.rows) && tournament.pointTable.rows.length > 0) {
      setMatchTitle(tournament.pointTable.matchTitle || 'Match 1');
      setRows(
        tournament.pointTable.rows.map((r, idx) => ({
          ...r,
          rank: r.rank || idx + 1,
          kills: sanitizeKillsInput(r.kills),
          placePoints: r.placePoints !== undefined ? r.placePoints : getPlacementPoints(r.rank || idx + 1, tournament.game)
        }))
      );
    } else {
      // Default teams from registeredSquadNames or sample
      const squadNames = tournament.registeredSquadNames && tournament.registeredSquadNames.length > 0
        ? tournament.registeredSquadNames
        : ['Team Soul', 'GodLike Esports', 'Orangutan Elite', 'Entity Gaming'];

      setMatchTitle('Match 1: Bermuda / Erangel');
      setRows(
        squadNames.map((name, idx) => ({
          id: `row-${idx + 1}`,
          teamName: name,
          rank: idx + 1,
          kills: 0,
          placePoints: getPlacementPoints(idx + 1, tournament.game)
        }))
      );
    }

    // Setup Style
    if (tournament.styleConfig) {
      setStyleConfig(tournament.styleConfig);
    } else {
      setStyleConfig(getDefaultStyleConfig());
    }

    setErrorMessage(null);
    setSuccessMessage(null);
  }, [isOpen, tournament]);

  if (!isOpen || !tournament) return null;

  // Handle kills change with automatic leading zero cleanup ('010' -> 10, '005' -> 5, '0' -> 0)
  const handleKillsChange = (rowId: string, rawVal: string) => {
    const sanitized = sanitizeKillsInput(rawVal);
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === rowId) {
          const placePts = r.placePoints !== undefined ? r.placePoints : getPlacementPoints(r.rank, game);
          return {
            ...r,
            kills: sanitized,
            totalPoints: placePts + sanitized
          };
        }
        return r;
      })
    );
  };

  // Handle place points change (manual override)
  const handlePlacePointsChange = (rowId: string, rawVal: string) => {
    const val = Math.max(0, parseInt(rawVal, 10) || 0);
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === rowId) {
          return {
            ...r,
            placePoints: val,
            totalPoints: val + r.kills
          };
        }
        return r;
      })
    );
  };

  // Handle rank change
  const handleRankChange = (rowId: string, rawVal: string) => {
    const val = Math.max(1, parseInt(rawVal, 10) || 1);
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === rowId) {
          const newPlacePts = customPlacementMode && r.placePoints !== undefined
            ? r.placePoints
            : getPlacementPoints(val, game);
          return {
            ...r,
            rank: val,
            placePoints: newPlacePts,
            totalPoints: newPlacePts + r.kills
          };
        }
        return r;
      })
    );
  };

  // Add team
  const handleAddTeam = () => {
    if (!newTeamName.trim()) return;
    const newRank = rows.length + 1;
    const placePts = getPlacementPoints(newRank, game);
    const newRow: PointTableRowData = {
      id: `row-${Date.now()}`,
      teamName: newTeamName.trim(),
      rank: newRank,
      kills: 0,
      placePoints: placePts,
      totalPoints: placePts
    };
    setRows([...rows, newRow]);
    setNewTeamName('');
  };

  // Remove team
  const handleRemoveTeam = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  // Sort by total points
  const handleSortStandings = () => {
    const sorted = [...rows].sort((a, b) => {
      const ptsA = (a.placePoints ?? getPlacementPoints(a.rank, game)) + a.kills;
      const ptsB = (b.placePoints ?? getPlacementPoints(b.rank, game)) + b.kills;
      return ptsB - ptsA;
    });
    // reassign sequential ranks
    const reRanked = sorted.map((row, idx) => {
      const newRank = idx + 1;
      const newPlacePts = customPlacementMode && row.placePoints !== undefined
        ? row.placePoints
        : getPlacementPoints(newRank, game);
      return {
        ...row,
        rank: newRank,
        placePoints: newPlacePts,
        totalPoints: newPlacePts + row.kills
      };
    });
    setRows(reRanked);
  };

  // Handle Save
  const handleSave = async () => {
    if (!title.trim()) {
      setErrorMessage('Tournament title cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Calculate totalPoints for all rows
      const finalizedRows: PointTableRowData[] = rows.map((r) => {
        const placePts = r.placePoints !== undefined ? r.placePoints : getPlacementPoints(r.rank, game);
        return {
          ...r,
          placePoints: placePts,
          totalPoints: placePts + r.kills
        };
      });

      const updatedData: TournamentItem = {
        ...tournament,
        title: title.trim(),
        game: game.trim(),
        format,
        status,
        region,
        prizePool: Number(prizePool) || 0,
        entryFee,
        description,
        registeredSquadNames: finalizedRows.map((r) => r.teamName),
        pointTable: {
          matchTitle: matchTitle.trim(),
          scoringSystem: `Official ${game} Matrix`,
          rows: finalizedRows
        },
        styleConfig
      };

      await onSaveChanges(updatedData);
      setSuccessMessage('Changes saved successfully to your account!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase font-['Chakra_Petch'] tracking-wide flex items-center gap-2">
                Edit Tournament & Point Table
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Manager
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono truncate max-w-md">
                Updating: <strong className="text-white">{tournament.title}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar & Tabs */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-800/60 bg-slate-900/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('point-table')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase font-['Chakra_Petch'] transition-all ${
                activeTab === 'point-table'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Point Table & Scores
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase font-['Chakra_Petch'] transition-all ${
                activeTab === 'details'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Tournament Info
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Customize Design / Change Style Button */}
            <button
              type="button"
              onClick={() => setIsStyleModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customize Design</span>
            </button>

            {/* Download Button with Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-400 text-xs font-mono text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download</span>
              </button>

              {isDownloadOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-30 p-1 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDownloadOpen(false);
                      exportPointTableToPDF(title || tournament.title, game, matchTitle, rows, styleConfig);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDownloadOpen(false);
                      exportPointTableToExcel(title || tournament.title, game, matchTitle, rows);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download Excel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDownloadOpen(false);
                      exportPointTableToCSV(title || tournament.title, game, matchTitle, rows);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download CSV</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback banners */}
        {errorMessage && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-2 text-rose-300 text-xs font-mono">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center gap-2 text-emerald-300 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'point-table' ? (
            <div>
              {/* Top point table controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                    Match Title / Round Label
                  </label>
                  <input
                    type="text"
                    value={matchTitle}
                    onChange={(e) => setMatchTitle(e.target.value)}
                    placeholder="e.g. Scrims Match 1: Bermuda"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-end justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleSortStandings}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-xs font-bold text-amber-300 font-['Chakra_Petch'] uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Auto-Sort by Points</span>
                  </button>

                  <label className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={customPlacementMode}
                      onChange={(e) => setCustomPlacementMode(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span>Custom Placement Edit</span>
                  </label>
                </div>
              </div>

              {/* Quick Add Squad */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
                  placeholder="Enter squad / player name to add..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTeam}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs font-['Chakra_Petch'] flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Team</span>
                </button>
              </div>

              {/* Point Table Matrix */}
              <div
                className={`rounded-xl border ${styleConfig.borderColor} overflow-hidden shadow-lg mb-2`}
                style={{
                  backgroundColor: '#0a0f1d',
                  backgroundImage: styleConfig.customBgImage
                    ? `linear-gradient(rgba(10, 15, 29, 0.88), rgba(10, 15, 29, 0.92)), url(${styleConfig.customBgImage})`
                    : undefined,
                  backgroundSize: 'cover'
                }}
              >
                <div className="overflow-x-auto">
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
                      {rows.map((row) => {
                        const placePts = row.placePoints !== unde
