/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HomeFeaturesSection } from './components/HomeFeaturesSection';
import { TournamentsPage } from './components/TournamentsPage';
import { GamePage } from './components/GamePage';
import { Footer } from './components/Footer';
import { CreateTournamentModal } from './components/CreateTournamentModal';
import { JoinTournamentModal } from './components/JoinTournamentModal';
import { TournamentDetailsModal } from './components/TournamentDetailsModal';
import { AuthNoticeModal } from './components/AuthNoticeModal';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { MyTournamentsPage } from './components/MyTournamentsPage';

import { INITIAL_TOURNAMENTS } from './data/tournamentData';
import { COMPETITIVE_GAMES, getGameById } from './data/gamesData';
import { TournamentItem, User } from './types';
import { api } from './services/api';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation View Router: 'home' | 'tournaments' | 'my-tournaments' | 'game-page' | 'login' | 'signup'
  const [currentView, setCurrentView] = useState<'home' | 'tournaments' | 'my-tournaments' | 'game-page' | 'login' | 'signup'>('home');
  const [selectedGameId, setSelectedGameId] = useState<string>('free-fire');
  const [tournamentsGameFilter, setTournamentsGameFilter] = useState<string>('all');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Platform Tournaments Data
  const [tournaments, setTournaments] = useState<TournamentItem[]>(INITIAL_TOURNAMENTS);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState<boolean>(true);
  const [tournamentsFetchError, setTournamentsFetchError] = useState<string | null>(null);

  // Modals state
  const [isCreateTournamentOpen, setIsCreateTournamentOpen] = useState(false);
  const [createModalGame, setCreateModalGame] = useState<string | null>(null);
  const [createModalPurpose, setCreateModalPurpose] = useState<'point-table' | 'tournament' | null>(null);

  const [isJoinTournamentOpen, setIsJoinTournamentOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTournamentForDetails, setSelectedTournamentForDetails] = useState<TournamentItem | null>(null);
  const [joinTargetTournamentId, setJoinTargetTournamentId] = useState<string | null>(null);

  // Guest restriction prompt modal
  const [isAuthNoticeOpen, setIsAuthNoticeOpen] = useState(false);
  const [authNoticeAction, setAuthNoticeAction] = useState('perform this action');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch real tournaments and check session on mount
  const fetchPlatformData = async () => {
    setIsLoadingTournaments(true);
    setTournamentsFetchError(null);
    try {
      const user = await api.auth.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }

      const fetchedTournaments = await api.tournaments.getAll();
      if (fetchedTournaments && fetchedTournaments.length > 0) {
        setTournaments(fetchedTournaments);
      }
    } catch (err: any) {
      console.warn('Backend API connection warning, using tournament fixtures:', err);
      // Fallback is already initialized to INITIAL_TOURNAMENTS
    } finally {
      setIsLoadingTournaments(false);
    }
  };

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Helper to trigger guest restriction modal with Login/Signup options
  const promptGuestAuth = (actionName: string) => {
    setAuthNoticeAction(actionName);
    setIsAuthNoticeOpen(true);
  };

  // Logout handler
  const handleLogout = async () => {
    await api.auth.logout();
    setCurrentUser(null);
    showToast('Logged out. You are now browsing as a guest.');
  };

  // Navigate to dedicated Tournaments page (with optional game filter)
  const handleNavigateToTournaments = (gameFilter: string = 'all') => {
    setTournamentsGameFilter(gameFilter);
    setCurrentView('tournaments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to My Tournaments / Saved Projects page
  const handleNavigateToMyTournaments = () => {
    if (!currentUser) {
      promptGuestAuth('manage your tournaments and saved projects');
    }
    setCurrentView('my-tournaments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate directly to game-specific page
  const handleNavigateToGamePage = (gameId: string) => {
    setSelectedGameId(gameId);
    setCurrentView('game-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Create Tournament trigger (Requires Login)
  const handleOpenCreateTournament = (preselectedGame?: string, defaultPurpose?: 'point-table' | 'tournament') => {
    if (!currentUser) {
      promptGuestAuth(preselectedGame ? `create a ${preselectedGame} tournament` : 'create a tournament');
    } else {
      setCreateModalGame(preselectedGame || null);
      setCreateModalPurpose(defaultPurpose || null);
      setIsCreateTournamentOpen(true);
    }
  };

  // Handle Create Tournament completion from modal
  const handleCreateTournamentSubmit = async (newTournament: TournamentItem) => {
    if (!currentUser) {
      promptGuestAuth('create tournaments');
      return;
    }

    try {
      const created = await api.tournaments.create(newTournament, currentUser);
      setTournaments((prev) => [created, ...prev]);
      showToast(`Tournament "${created.title}" published successfully!`);

      // Open the dedicated tournaments page to see the created tournament
      setTournamentsGameFilter(created.game || 'all');
      setCurrentView('tournaments');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      showToast(err?.message || 'Failed to publish tournament.');
    }
  };

  // Handle Open Join Tournament modal (Requires Login)
  const handleOpenJoinTournament = (tournament?: TournamentItem | string) => {
    if (!currentUser) {
      promptGuestAuth('register squad for this tournament');
      return;
    }

    if (typeof tournament === 'string') {
      setJoinTargetTournamentId(tournament);
    } else if (tournament) {
      setJoinTargetTournamentId(tournament.id);
    } else {
      setJoinTargetTournamentId(null);
    }
    setIsJoinTournamentOpen(true);
  };

  // Handle View Details modal (Open to guests without login!)
  const handleOpenDetails = (tournament: TournamentItem) => {
    setSelectedTournamentForDetails(tournament);
    setIsDetailsModalOpen(true);
  };

  // Handle Join Tournament submission
  const handleJoinTournamentSubmit = async (
    tournamentId: string,
    teamData: { name: string; tag: string; captain: string; discord: string; region: string }
  ) => {
    if (!currentUser) {
      promptGuestAuth('register for tournaments');
      return;
    }

    try {
      const updatedTourn = await api.tournaments.registerSquad(tournamentId, teamData.name);
      setTournaments((prev) =>
        prev.map((t) => (t.id === tournamentId ? updatedTourn : t))
      );
      showToast(`Squad "${teamData.name}" enrolled into tournament!`);
    } catch (err: any) {
      showToast(err?.message || 'Failed to register squad.');
    }
  };

  // Active game info for game-specific page
  const activeGame = getGameById(selectedGameId) || COMPETITIVE_GAMES[0];

  // ================= VIEW: DEDICATED LOGIN PAGE =================
  if (currentView === 'login') {
    return (
      <LoginPage
        onSuccess={(user) => {
          setCurrentUser(user);
          setCurrentView('home');
          showToast(`Welcome back, ${user.gamerTag}!`);
        }}
        onGoToSignup={() => setCurrentView('signup')}
        onGoToHome={() => setCurrentView('home')}
      />
    );
  }

  // ================= VIEW: DEDICATED SIGNUP PAGE =================
  if (currentView === 'signup') {
    return (
      <SignupPage
        onSuccess={(user) => {
          setCurrentUser(user);
          setCurrentView('home');
          showToast(`Account registered! Welcome, ${user.gamerTag}.`);
        }}
        onGoToLogin={() => setCurrentView('login')}
        onGoToHome={() => setCurrentView('home')}
      />
    );
  }

  // ================= VIEW: NEW DEDICATED TOURNAMENTS PAGE =================
  if (currentView === 'tournaments') {
    return (
      <div className="min-h-screen bg-[#070b14] text-[#e2e8f0] flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
        {/* Header Navbar */}
        <Navbar
          currentUser={currentUser}
          onGoHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoToTournaments={() => {
            setTournamentsGameFilter('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoToMyTournaments={handleNavigateToMyTournaments}
          onOpenCreateTournament={() => handleOpenCreateTournament()}
          onGoToLogin={() => setCurrentView('login')}
          onGoToSignup={() => setCurrentView('signup')}
          onLogout={handleLogout}
        />

        {/* Dedicated Tournaments Page Component */}
        <TournamentsPage
          tournaments={tournaments}
          isLoading={isLoadingTournaments}
          error={tournamentsFetchError}
          currentUser={currentUser}
          initialGameFilter={tournamentsGameFilter}
          onBackToHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCreateTournament={handleOpenCreateTournament}
          onGoToMyTournaments={handleNavigateToMyTournaments}
          onViewDetails={handleOpenDetails}
          onOpenJoinTournament={handleOpenJoinTournament}
          onPromptAuth={promptGuestAuth}
          onRetryFetch={fetchPlatformData}
        />

        {/* Footer */}
        <Footer
          onGoHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoToTournaments={() => {
            setTournamentsGameFilter('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCreateTournament={() => handleOpenCreateTournament()}
          onSelectGame={(gameId) => {
            const matchedGame = COMPETITIVE_GAMES.find((g) => g.id === gameId);
            if (matchedGame) {
              handleNavigateToTournaments(matchedGame.name);
            }
          }}
          onGoToLogin={() => setCurrentView('login')}
          onGoToSignup={() => setCurrentView('signup')}
        />

        {/* Shared Modals */}
        <AuthNoticeModal
          isOpen={isAuthNoticeOpen}
          onClose={() => setIsAuthNoticeOpen(false)}
          actionName={authNoticeAction}
          onGoToLogin={() => {
            setIsAuthNoticeOpen(false);
            setCurrentView('login');
          }}
          onGoToSignup={() => {
            setIsAuthNoticeOpen(false);
            setCurrentView('signup');
          }}
        />

        <TournamentDetailsModal
          tournament={selectedTournamentForDetails}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          currentUser={currentUser}
          onRegisterClick={(t) => handleOpenJoinTournament(t)}
          onPromptAuth={() => {
            promptGuestAuth(`register for ${selectedTournamentForDetails?.title || 'this tournament'}`);
          }}
        />

        <CreateTournamentModal
          isOpen={isCreateTournamentOpen}
          onClose={() => {
            setIsCreateTournamentOpen(false);
            setCreateModalGame(null);
            setCreateModalPurpose(null);
          }}
          currentUser={currentUser}
          onCreateTournament={handleCreateTournamentSubmit}
          onPromptAuth={promptGuestAuth}
          initialGame={createModalGame}
          initialPurpose={createModalPurpose}
        />

        <JoinTournamentModal
          isOpen={isJoinTournamentOpen}
          onClose={() => setIsJoinTournamentOpen(false)}
          tournaments={tournaments}
          preSelectedTournamentId={joinTargetTournamentId}
          currentUser={currentUser}
          onJoinTournament={handleJoinTournamentSubmit}
        />

        {toastMessage && (
          <div
            id="global-toast-notification"
            className="fixed bottom-6 right-6 z-50 bg-[#0c1322] border border-emerald-500/80 text-white text-xs font-semibold px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 animate-bounce font-['Chakra_Petch']"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // ================= VIEW: DEDICATED MY TOURNAMENTS / SAVED PROJECTS PAGE =================
  if (currentView === 'my-tournaments') {
    return (
      <div className="min-h-screen bg-[#070b14] text-[#e2e8f0] flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
        {/* Header Navbar */}
        <Navbar
          currentUser={currentUser}
          onGoHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoToTournaments={() => {
            setTournamentsGameFilter('all');
            setCurrentView('tournaments');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoToMyTournaments={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCreateTournament={() => handleOpenCreateTournament()}
          onGoToLogin={() => setCurrentView('login')}
          onGoToSignup={() => setCurrentView('signup')}
          onLogout={handleLogout}
        />

        {/* My Tournaments & Saved Projects Page */}
        <MyTournamentsPage
          currentUser={currentUser}
          onBackToTournaments={() => {
            setCurrentView('tournaments');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCreateTournament={handleOpenCreateTournament}
          onPromptAuth={promptGuestAuth}
          onViewDetails={handleOpenDetails}
          onTournamentUpdated={(updated) => {
            setTournaments((prev) =>
              prev.map((t) => (t.id === updated.id ? updated : t))
            );
            showToast(`Tournament "${updated.title}" updated successfully!`);
          }}
        />

        {/* Footer */}
        <Footer
          onGoHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoToTournaments={() => {
            setTournamentsGameFilter('all');
            setCurrentView('tournaments');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCreateTournament={() => handleOpenCreateTournament()}
          onSelectGame={(gameId) => {
            const matchedGame = COMPETITIVE_GAMES.find((g) => g.id === gameId);
            if (matchedGame) {
              handleNavigateToTournaments(matchedGame.name);
            }
          }}
          onGoToLogin={() => setCurrentView('login')}
          onGoToSignup={() => setCurrentView('signup')}
        />

        {/* Shared Modals */}
        <AuthNoticeModal
          isOpen={isAuthNoticeOpen}
          onClose={() => setIsAuthNoticeOpen(false)}
          actionName={authNoticeAction}
          onGoToLogin={() => {
            setIsAuthNoticeOpen(false);
            setCurrentView('login');
          }}
          onGoToSignup={() => {
            setIsAuthNoticeOpen(false);
            setCurrentView('signup');
          }}
        />

        <TournamentDetailsModal
          tournament={selectedTournamentForDetails}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          currentUser={currentUser}
          onRegisterClick={(t) => handleOpenJoinTournament(t)}
          onPromptAuth={() => {
            promptGuestAuth(`register for ${selectedTournamentForDetails?.title || 'this tournament'}`);
          }}
        />

        <CreateTournamentModal
          isOpen={isCreateTournamentOpen}
          onClose={() => {
            setIsCreateTournamentOpen(false);
            setCreateModalGame(null);
            setCreateModalPurpose(null);
          }}
          currentUser={currentUser}
          onCreateTournament={handleCreateTournamentSubmit}
          onPromptAuth={promptGuestAuth}
          initialGame={createModalGame}
          initialPurpose={createModalPurpose}
        />

        <JoinTournamentModal
          isOpen={isJoinTournamentOpen}
          onClose={() => setIsJoinTournamentOpen(false)}
          tournaments={tournaments}
          preSelectedTournamentId={joinTargetTournamentId}
          currentUser={currentUser}
          onJoinTournament={handleJoinTournamentSubmit}
        />

        {toastMessage && (
          <div
            id="global-toast-notification"
            className="fixed bottom-6 right-6 z-50 bg-[#0c1322] border border-emerald-500/80 text-white text-xs font-semibold px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 animate-bounce font-['Chakra_Petch']"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // ================= VIEW: DEDICATED GAME-SPECIFIC PAGE =================
  if (currentView === 'game-page') {
    return (
      <div className="min-h-screen bg-[#070b14] text-[#e2e8f0] flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
        {/* Header Navbar */}
        <Navbar
          currentUser={currentUser}
          onGoHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoToTournaments={() => handleNavigateToTournaments('all')}
          onGoToMyTournaments={handleNavigateToMyTournaments}
          onOpenCreateTournament={() => handleOpenCreateTournament(activeGame.name)}
          onGoToLogin={() => setCurrentView('login')}
          onGoToSignup={() => setCurrentView('signup')}
          onLogout={handleLogout}
        />

        {/* Dedicated Game Page */}
        <GamePage
          game={activeGame}
          tournaments={tournaments}
          isLoading={isLoadingTournaments}
          error={tournamentsFetchError}
          currentUser={currentUser}
          onBackToHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCreateTournament={handleOpenCreateTournament}
          onViewDetails={handleOpenDetails}
          onOpenJoinTournament={handleOpenJoinTournament}
          onPromptAuth={promptGuestAuth}
          onRetryFetch={fetchPlatformData}
        />

        {/* Footer */}
        <Footer
          onGoHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoToTournaments={() => handleNavigateToTournaments('all')}
          onOpenCreateTournament={() => handleOpenCreateTournament()}
          onSelectGame={handleNavigateToGamePage}
          onGoToLogin={() => setCurrentView('login')}
          onGoToSignup={() => setCurrentView('signup')}
        />

        {/* Shared Modals */}
        <AuthNoticeModal
          isOpen={isAuthNoticeOpen}
          onClose={() => setIsAuthNoticeOpen(false)}
          actionName={authNoticeAction}
          onGoToLogin={() => {
            setIsAuthNoticeOpen(false);
            setCurrentView('login');
          }}
          onGoToSignup={() => {
            setIsAuthNoticeOpen(false);
            setCurrentView('signup');
          }}
        />

        <TournamentDetailsModal
          tournament={selectedTournamentForDetails}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          currentUser={currentUser}
          onRegisterClick={(t) => handleOpenJoinTournament(t)}
          onPromptAuth={() => {
            promptGuestAuth(`register for ${selectedTournamentForDetails?.title || 'this tournament'}`);
          }}
        />

        <CreateTournamentModal
          isOpen={isCreateTournamentOpen}
          onClose={() => {
            setIsCreateTournamentOpen(false);
            setCreateModalGame(null);
            setCreateModalPurpose(null);
          }}
          currentUser={currentUser}
          onCreateTournament={handleCreateTournamentSubmit}
          onPromptAuth={promptGuestAuth}
          initialGame={createModalGame}
          initialPurpose={createModalPurpose}
        />

        <JoinTournamentModal
          isOpen={isJoinTournamentOpen}
          onClose={() => setIsJoinTournamentOpen(false)}
          tournaments={tournaments}
          preSelectedTournamentId={joinTargetTournamentId}
          currentUser={currentUser}
          onJoinTournament={handleJoinTournamentSubmit}
        />

        {toastMessage && (
          <div
            id="global-toast-notification"
            className="fixed bottom-6 right-6 z-50 bg-[#0c1322] border border-emerald-500/80 text-white text-xs font-semibold px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 animate-bounce font-['Chakra_Petch']"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // ================= VIEW: CLEAN HOMEPAGE (CLEAN & PROFESSIONAL - NO CARDS ON HOMEPAGE) =================
  return (
    <div className="min-h-screen bg-[#070b14] text-[#e2e8f0] flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. Header: Gaming Tournament logo, Home, Tournaments, Create Tournament, Login and Signup */}
      <Navbar
        currentUser={currentUser}
        onGoHome={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoToTournaments={() => handleNavigateToTournaments('all')}
        onGoToMyTournaments={handleNavigateToMyTournaments}
        onOpenCreateTournament={() => handleOpenCreateTournament()}
        onGoToLogin={() => setCurrentView('login')}
        onGoToSignup={() => setCurrentView('signup')}
        onLogout={handleLogout}
      />

      {/* Main Homepage Body:
          - Hero Section (Clean & professional with Explore Tournaments button and Create Tournament button)
          - Platform Infrastructure Features Section
          (Tournament cards and game cards are strictly NOT shown on the homepage!) */}
      <main className="flex-1">
        <HeroSection
          currentUser={currentUser}
          onOpenCreateTournament={() => handleOpenCreateTournament()}
          onExploreTournaments={() => handleNavigateToTournaments('all')}
        />

        <HomeFeaturesSection
          onExploreTournaments={() => handleNavigateToTournaments('all')}
          onOpenCreateTournament={() => handleOpenCreateTournament()}
        />
      </main>

      {/* Footer */}
      <Footer
        onGoHome={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoToTournaments={() => handleNavigateToTournaments('all')}
        onOpenCreateTournament={() => handleOpenCreateTournament()}
        onSelectGame={(gameId) => {
          const matchedGame = COMPETITIVE_GAMES.find((g) => g.id === gameId);
          if (matchedGame) {
            handleNavigateToTournaments(matchedGame.name);
          }
        }}
        onGoToLogin={() => setCurrentView('login')}
        onGoToSignup={() => setCurrentView('signup')}
      />

      {/* Auth Notice Modal */}
      <AuthNoticeModal
        isOpen={isAuthNoticeOpen}
        onClose={() => setIsAuthNoticeOpen(false)}
        actionName={authNoticeAction}
        onGoToLogin={() => {
          setIsAuthNoticeOpen(false);
          setCurrentView('login');
        }}
        onGoToSignup={() => {
          setIsAuthNoticeOpen(false);
          setCurrentView('signup');
        }}
      />

      {/* Tournament Details Modal */}
      <TournamentDetailsModal
        tournament={selectedTournamentForDetails}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        currentUser={currentUser}
        onRegisterClick={(t) => handleOpenJoinTournament(t)}
        onPromptAuth={() => {
          promptGuestAuth(`register for ${selectedTournamentForDetails?.title || 'this tournament'}`);
        }}
      />

      {/* Create Tournament Modal */}
      <CreateTournamentModal
        isOpen={isCreateTournamentOpen}
        onClose={() => {
          setIsCreateTournamentOpen(false);
          setCreateModalGame(null);
          setCreateModalPurpose(null);
        }}
        currentUser={currentUser}
        onCreateTournament={handleCreateTournamentSubmit}
        onPromptAuth={promptGuestAuth}
        initialGame={createModalGame}
        initialPurpose={createModalPurpose}
      />

      {/* Join Tournament Modal */}
      <JoinTournamentModal
        isOpen={isJoinTournamentOpen}
        onClose={() => setIsJoinTournamentOpen(false)}
        tournaments={tournaments}
        preSelectedTournamentId={joinTargetTournamentId}
        currentUser={currentUser}
        onJoinTournament={handleJoinTournamentSubmit}
      />

      {/* Floating Interactive Toast Feedback */}
      {toastMessage && (
        <div
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-[#0c1322] border border-emerald-500/80 text-white text-xs font-semibold px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 animate-bounce font-['Chakra_Petch']"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
