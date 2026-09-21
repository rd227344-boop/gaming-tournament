import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Download,
  Calendar,
  Layers,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Gamepad2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { TournamentItem, User } from '../types';
import { exportPointTableToCSV, exportPointTableToExcel, exportPointTableToPDF } from '../utils/exportUtils';
import { api } from '../services/api';
import { EditTournamentModal } from './EditTournamentModal';

interface MyTournamentsPageProps {
  currentUser: User | null;
  onOpenCreate?: () => void;
  onOpenCreateTournament?: (preselectedGame?: string) => void;
  onViewTournament?: (tournament: TournamentItem) => void;
  onViewDetails?: (tournament: TournamentItem) => void;
  onEditTournament?: (tournament: TournamentItem) => void;
  onOpenAuth?: () => void;
  onPromptAuth?: (actionName: string) => void;
  onBackToTournaments?: () => void;
  onTournamentUpdated?: (updated: TournamentItem) => void;
}

export const MyTournamentsPage: React.FC<MyTournamentsPageProps> = ({
  currentUser,
  onOpenCreate,
  onOpenCreateTournament,
  onViewTournament,
  onViewDetails,
  onEditTournament,
  onOpenAuth,
  onPromptAuth,
  onBackToTournaments,
  onTournamentUpdated,
}) => {
  const handleOpenCreateClick = () => {
    if (onOpenCreateTournament) {
      onOpenCreateTournament();
    } else if (onOpenCreate) {
      onOpenCreate();
    }
  };

  const handleViewTournamentClick = (tourn: TournamentItem) => {
    if (onViewDetails) {
      onViewDetails(tourn);
    } else if (onViewTournament) {
      onViewTournament(tourn);
    }
  };

  const handleAuthClick = () => {
    if (onPromptAuth) {
      onPromptAuth('manage your saved tournaments');
    } else if (onOpenAuth) {
      onOpenAuth();
    }
  };
  const [tournaments, setTournaments] = useState<TournamentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'registration' | 'live' | 'upcoming' | 'completed'>('all');

  // Editing tournament modal state
  const [editingTournament, setEditingTournament] = useState<TournamentItem | null>(null);

  // Handle saving edits from EditTournamentModal
  const handleSaveEdit = async (updated: TournamentItem) => {
    if (!currentUser) return;
    const saved = await api.tournaments.saveTournament(updated, currentUser);
    setTournaments((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
    onTournamentUpdated?.(saved);
    setNotification({
      type: 'success',
      message: `Tournament "${saved.title}" updated successfully.`
    });
    setEditingTournament(null);
  };

  // Deletion confirmation modal
  const [deletingTournament, setDeletingTournament] = useState<TournamentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Download menu active dropdown id
  const [activeDownloadId, setActiveDownloadId] = useState<string | null>(null);

  const fetchUserTournaments = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await api.tournaments.getMyTournaments(currentUser);
      setTournaments(data);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to load your tournaments from the server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserTournaments();
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingTournament || !currentUser) return;
    setIsDeleting(true);

    try {
      await api.tournaments.delete(deletingTournament.id, currentUser);
      setTournaments((prev) => prev.filter((t) => t.id !== deletingTournament.id));
      setNotification({
        type: 'success',
        message: `Tournament "${deletingTournament.title}" was permanently deleted.`
      });
      setDeletingTournament(null);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err?.message || 'Failed to delete tournament.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // If user is not logged in, prompt authentication
  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase font-['Chakra_Petch'] tracking-wide mb-2">
            My Tournaments
          </h2>
          <p className="text-sm text-slate-400 font-mono mb-6 leading-relaxed">
            Please log in or create an account to view and manage your custom tournaments, point tables, and saved scrim projects.
          </p>
          <button
            onClick={onOpenAuth}
            id="my-tournaments-login-btn"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black uppercase text-sm font-['Chakra_Petch'] shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            Log In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  // Filtered list
  const filteredTournaments = tournaments.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.game.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {onBackToTournaments && (
                <button
                  type="button"
                  onClick={onBackToTournaments}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer mr-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>All Tournaments</span>
                </button>
              )}
              <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Organizer Management Console</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase font-['Chakra_Petch'] tracking-tight">
              My Tournaments & Projects
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
              Manage, edit point tables, adjust score matrices, and export official standings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchUserTournaments}
              title="Refresh list"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onOpenCreate}
              id="my-tournaments-create-btn"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black uppercase text-xs font-['Chakra_Petch'] flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Tournament</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between text-xs font-mono ${
              notification.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/70 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Total Saved</span>
            <span className="text-2xl font-black text-white font-['Chakra_Petch']">
              {tournaments.length}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] font-mono text-emerald-400 uppercase block">Live / Active</span>
            <span className="text-2xl font-black text-emerald-400 font-['Chakra_Petch']">
              {tournaments.filter((t) => t.status === 'live').length}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] font-mono text-amber-400 uppercase block">Registrations</span>
            <span className="text-2xl font-black text-amber-400 font-['Chakra_Petch']">
              {tournaments.filter((t) => t.status === 'registration').length}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] font-mono text-cyan-400 uppercase block">Point Tables</span>
            <span className="text-2xl font-black text-cyan-400 font-['Chakra_Petch']">
              {tournaments.filter((t) => t.pointTable && t.pointTable.rows?.length > 0).length}
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or game..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'registration', 'live', 'upcoming', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {errorMessage && (
          <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800 text-center mb-8">
            <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <p className="text-sm text-rose-300 font-mono mb-4">{errorMessage}</p>
            <button
              onClick={fetchUserTournaments}
              className="px-4 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white text-xs font-mono cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Loading your tournament projects...
            </p>
          </div>
        ) : filteredTournaments.length === 0 ? (
          /* Empty State */
          <div className="p-10 sm:p-16 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white uppercase font-['Chakra_Petch'] mb-2">
              No Saved Tournaments Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-md mx-auto mb-6 leading-relaxed">
              {searchQuery || statusFilter !== 'all'
                ? 'No tournaments match your current search filters. Try clearing the query or filters.'
                : 'You have not created or saved any tournament projects yet. Start by generating an official point table or hosting a new squad cup.'}
            </p>
            <button
              onClick={onOpenCreate}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black uppercase text-xs font-['Chakra_Petch'] inline-flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Your First Tournament</span>
            </button>
          </div>
        ) : (
          /* Tournaments Grid / List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTournaments.map((tourn) => {
              const rowsCount = tourn.pointTable?.rows?.length || tourn.registeredSquadNames?.length || 0;
              const formattedDate = tourn.createdAt
                ? new Date(tourn.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : tourn.startDate || 'Recent';

              return (
                <div
                  key={tourn.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-black/40 group relative"
                >
                  {/* Top tags */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-500/20">
                        {tourn.game}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                          tourn.status === 'live'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : tourn.status === 'registration'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {tourn.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white uppercase font-['Chakra_Petch'] group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
                      {tourn.title}
                    </h3>

                    <p className="text-xs text-slate-400 font-mono line-clamp-2 mb-4 leading-relaxed">
                      {tourn.description || `${tourn.format} • ${tourn.region} region.`}
                    </p>

                    {/* Metadata summary */}
                    <div className="grid grid-cols-2 gap-2 py-2.5 px-3 rounded-xl bg-slate-950/70 border border-slate-800/60 mb-4 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-500 block">Teams / Rows</span>
                        <span className="text-slate-200 font-bold">{rowsCount} Squads</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Created / Date</span>
                        <span className="text-slate-200 font-bold">{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-1.5">
                    {/* View */}
                    <button
                      type="button"
                      onClick={() => onViewTournament(tourn)}
                      className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="View Tournament Standings"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span className="hidden sm:inline">View</span>
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onEditTournament) {
                          onEditTournament(tourn);
                        } else {
                          setEditingTournament(tourn);
                        }
                      }}
                      className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Edit Tournament & Point Table"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    {/* Download Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDownloadId(activeDownloadId === tourn.id ? null : tourn.id)
                        }
                        className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Download Point Table"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">Download</span>
                      </button>

                      {activeDownloadId === tourn.id && (
                        <div className="absolute right-0 bottom-full mb-1 w-44 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-30 p-1 font-mono text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDownloadId(null);
                              exportPointTableToPDF(
                                tourn.title,
                                tourn.game,
                                tourn.pointTable?.matchTitle || 'Standings',
                                tourn.pointTable?.rows || [],
                                tourn.styleConfig
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
                              setActiveDownloadId(null);
                              exportPointTableToExcel(
                                tourn.title,
                                tourn.game,
                                tourn.pointTable?.matchTitle || 'Standings',
                                tourn.pointTable?.rows || []
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
                              setActiveDownloadId(null);
                              exportPointTableToCSV(
                                tourn.title,
                                tourn.game,
                                tourn.pointTable?.matchTitle || 'Standings',
                                tourn.pointTable?.rows || []
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

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeletingTournament(tourn)}
                      className="p-2 rounded-lg bg-slate-950 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 transition-colors cursor-pointer"
                      title="Delete Tournament"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-white uppercase font-['Chakra_Petch'] mb-2">
              Confirm Delete Tournament
            </h3>
            <p className="text-xs text-slate-300 font-mono mb-4 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">"{deletingTournament.title}"</strong>? This will
              remove all match scores, teams, and point table configurations. This action cannot be
              undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingTournament(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono cursor-pointer border border-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase text-xs font-['Chakra_Petch'] flex items-center gap-1.5 shadow-lg shadow-rose-600/20 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Tournament & Point Table Modal */}
      {editingTournament && (
        <EditTournamentModal
          isOpen={!!editingTournament}
          tournament={editingTournament}
          onClose={() => setEditingTournament(null)}
          currentUser={currentUser}
          onSaveChanges={handleSaveEdit}
        />
      )}
    </div>
  );
};
