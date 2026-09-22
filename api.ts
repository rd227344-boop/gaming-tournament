import { User, TournamentItem, Team, LeaderboardEntry, TeamMember } from '../types';
import { INITIAL_TOURNAMENTS, INITIAL_TEAMS, INITIAL_LEADERBOARD, DEMO_USERS } from "./tournamentData";

const AUTH_STORAGE_KEY = 'mgt_current_user_session';
const TOURNAMENTS_STORAGE_KEY = 'mgt_tournaments_data';
const TEAMS_STORAGE_KEY = 'mgt_teams_data';

// Helper to access LocalStorage safely
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// Ensure initial seeds in local storage
if (!localStorage.getItem(TOURNAMENTS_STORAGE_KEY)) {
  setStored(TOURNAMENTS_STORAGE_KEY, INITIAL_TOURNAMENTS);
}
if (!localStorage.getItem(TEAMS_STORAGE_KEY)) {
  setStored(TEAMS_STORAGE_KEY, INITIAL_TEAMS);
}

export const api = {
  auth: {
    getCurrentUser(): User | null {
      return getStored<User | null>(AUTH_STORAGE_KEY, null);
    },

    async login(emailOrTag: string, password?: string): Promise<User> {
      const cleanInput = emailOrTag.trim().toLowerCase();
      
      // Try real backend API first
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailOrTag, password })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setStored(AUTH_STORAGE_KEY, data.user);
            return data.user;
          }
        }
      } catch {
        // Fallback to local evaluation
      }

      // Local matching for demo accounts & registered accounts
      const matchedDemo = DEMO_USERS.find(
        (acc) =>
          acc.user.email.toLowerCase() === cleanInput ||
          acc.user.gamerTag.toLowerCase() === cleanInput
      );

      if (matchedDemo) {
        setStored(AUTH_STORAGE_KEY, matchedDemo.user);
        return matchedDemo.user;
      }

      // If user typed custom info, create an active session
      const newUser: User = {
        id: 'usr-' + Date.now().toString(36),
        gamerTag: emailOrTag.includes('@') ? emailOrTag.split('@')[0] : emailOrTag,
        email: emailOrTag.includes('@') ? emailOrTag : `${emailOrTag.toLowerCase()}@gamer.pro`,
        role: 'player',
        preferredGame: 'Valorant',
        region: 'NA',
        avatarColor: 'from-emerald-500 to-teal-600',
        bio: 'Competitive gamer on Pro Arena.'
      };

      setStored(AUTH_STORAGE_KEY, newUser);
      return newUser;
    },

    async signup(data: {
      gamerTag: string;
      email: string;
      password?: string;
      preferredGame: string;
      region: 'NA' | 'EU' | 'APAC' | 'LATAM' | 'Global';
      role?: 'player' | 'captain' | 'organizer';
      discord?: string;
    }): Promise<User> {
      // Try real backend API first
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          const body = await res.json();
          if (body.user) {
            setStored(AUTH_STORAGE_KEY, body.user);
            return body.user;
          }
        }
      } catch {
        // Local fallback
      }

      const colors = [
        'from-cyan-500 to-blue-600',
        'from-emerald-500 to-teal-600',
        'from-rose-500 to-red-600',
        'from-amber-500 to-orange-600',
        'from-violet-500 to-purple-600'
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newUser: User = {
        id: 'usr-' + Date.now().toString(36),
        gamerTag: data.gamerTag.trim(),
        email: data.email.trim(),
        role: data.role || 'player',
        preferredGame: data.preferredGame,
        region: data.region,
        avatarColor: randomColor,
        discord: data.discord?.trim(),
        bio: `Verified competitor in ${data.preferredGame}.`
      };

      setStored(AUTH_STORAGE_KEY, newUser);
      return newUser;
    },

    async logout(): Promise<void> {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch {
        // ignore
      }
      localStorage.removeItem(AUTH_STORAGE_KEY);
    },

    updateUser(updates: Partial<User>): User | null {
      const current = getStored<User | null>(AUTH_STORAGE_KEY, null);
      if (!current) return null;
      const updated = { ...current, ...updates };
      setStored(AUTH_STORAGE_KEY, updated);
      return updated;
    }
  },

  tournaments: {
    async getAll(): Promise<TournamentItem[]> {
      try {
        const res = await fetch('/api/tournaments');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setStored(TOURNAMENTS_STORAGE_KEY, data);
            return data;
          }
        }
      } catch {
        // fallback
      }
      return getStored<TournamentItem[]>(TOURNAMENTS_STORAGE_KEY, INITIAL_TOURNAMENTS);
    },

    async getById(id: string): Promise<TournamentItem | undefined> {
      try {
        const res = await fetch(`/api/tournaments/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) return data;
        }
      } catch {
        // fallback
      }
      const list = getStored<TournamentItem[]>(TOURNAMENTS_STORAGE_KEY, INITIAL_TOURNAMENTS);
      return list.find((t) => t.id === id);
    },

    async getMyTournaments(currentUser: User): Promise<TournamentItem[]> {
      if (!currentUser) {
        throw new Error('Authentication required to view your tournaments.');
      }

      try {
        const res = await fetch('/api/my-tournaments', {
          headers: {
            'Authorization': `Bearer ${currentUser.id}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            return data;
          }
        }
      } catch (err) {
        console.warn('Backend API /api/my-tournaments error, reading local store:', err);
      }

      // Local fallback
      const list = getStored<TournamentItem[]>(TOURNAMENTS_STORAGE_KEY, INITIAL_TOURNAMENTS);
      return list.filter(
        (t) =>
          t.createdBy === currentUser.id ||
          (t.organizerName && t.organizerName.toLowerCase() === currentUser.gamerTag.toLowerCase())
      );
    },

    async saveTournament(
      tournamentData: Partial<TournamentItem> & { title: string; game: string },
      currentUser: User
    ): Promise<TournamentItem> {
      if (!currentUser) {
        throw new Error('Authentication required: You must be logged in to save a tournament or point table.');
      }

      const payload = {
        ...tournamentData,
        organizerName: currentUser.gamerTag,
        createdBy: currentUser.id,
        isSavedProject: true
      };

      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.id}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `Server error (${res.status}): Failed to save tournament.`);
      }

      const saved: TournamentItem = await res.json();
      const list = getStored<TournamentItem[]>(TOURNAMENTS_STORAGE_KEY, INITIAL_TOURNAMENTS);
      const existingIdx = list.findIndex((t) => t.id === saved.id);
      if (existingIdx !== -1) {
        list[existingIdx] = saved;
        setStored(TOURNAMENTS_STORAGE_KEY, list);
      } else {
        setStored(TOURNAMENTS_STORAGE_KEY, [saved, ...list]);
      }

      return saved;
    },

    async update(
      id: string,
      updates: Partial<TournamentItem>,
      currentUser: User
    ): Promise<TournamentItem> {
      if (!currentUser) {
        throw new Error('Authentication required: You must be logged in to update this tournament.');
      }

      const res = await fetch(`/api/tournaments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.id}`
        },
        body: JSON.stringify(updates)
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `Failed to update tournament (${res.status}).`);
      }

      const updated: TournamentItem = await res.json();
      const list = getStored<TournamentItem[]>(TOURNAMENTS_STORAGE_KEY, INITIAL_TOURNAMENTS);
      const idx = list.findIndex((t) => t.id === id);
      if (idx !== -1) {
        list[idx] = updated;
        setStored(TOURNAMENTS_STORAGE_KEY, list);
      }
      return updated;
    },

    async delete(id: string, currentUser: User): Promise<void> {
      if (!currentUser) {
        throw new Error('Authentication required to delete a tournament.');
      }

      const res = await fetch(`/api/tournaments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.id}`
        }
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `Failed to delete tournament (${res.status}).`);
      }

      const list = getStored<TournamentItem[]>(TOURNAMENTS_STORAGE_KEY, INITIAL_TOURNAMENTS);
      const filtered = list.filter((t) => t.id !== id);
      setStored(TOURNAMENTS_STORAGE_KEY, filtered);
    },

    async create(newTourn: Omit<TournamentItem, 'id'>, currentUser: User): Promise<TournamentItem> {
      // Must be logged in
      if (!currentUser) {
        throw new Error('Authentication required: You must be logged in to create a tournament.');
      }

      try {
        const res = await fetch('/api/tournaments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.id}`
          },
          body: JSON.stringify({
            ...newTourn,
            organizerName: currentUser.gamerTag,
            createdBy: currentUser.id,
            isSavedProject: true
          })
        });
        if (res.ok) {
          const created = await res.json();
          const list = getStored<TournamentItem[]>(TOURNAMENTS_STORAGE_KEY, INITIAL_TOURNAMENTS);
          const updated = [created, ...list];
          setStored(TOURNAMENTS_STORAGE_KEY, updated);
          return created;
        }
      } catch {
        // fallback
      }

      const item: TournamentItem = {
        ...newTourn,
        id: `custom-tourn-${Date.now().toString(36)}`,
        organizerName: currentUser.gamerTag,
        createdBy: currentUser.id,
        isSavedProject: true,
        registeredSquadNames: [currentUser.teamName || `${currentUser.gamerTag}'s Squad`]
      };

      const list = getStored<TournamentItem[]>(TOURNAMENTS_STORAGE_KEY, INITIAL_TOURNAMENTS);
      const updated = [item, ...list];
      setStored(TOURNAMENTS_STORAGE_KEY, updated);
      return item;
    },

    async join(
      tournamentId: string,
      squadInfo: { squadName: string; captainName: string },
      currentUser: User
    ): Promise<TournamentItem> {
      if (!currentUser) {
        throw new Error('Authentication required: Guests cannot register for tournaments. Please log in.');
      }

      try {
        const res = await fetch(`/api/tournaments/${tournamentId}/join`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.id}`
          },
          body: JSON.stringify(squadInfo)
        });
        if (res.ok) {
          const updatedTourn = await res.json();
          return updatedTourn;
        }
      } catch {
        // fallback
      }

      const list = getStored<TournamentItem[]>(TOURNAMENTS_STORAGE_KEY, INITIAL_TOURNAMENTS);
      const targetIndex = list.findIndex((t) => t.id === tournamentId);
      if (targetIndex === -1) {
        throw new Error('Tournament not found');
      }

      const current = list[targetIndex];
      const newSlotsFilled = Math.min(current.slotsTotal, current.slotsFilled + 1);
      const existingSquads = current.registeredSquadNames || [];
      const updatedSquads = existingSquads.includes(squadInfo.squadName)
        ? existingSquads
        : [...existingSquads, squadInfo.squadName];

      const updated: TournamentItem = {
        ...current,
        slotsFilled: newSlotsFilled,
        registeredSquadNames: updatedSquads
      };

      list[targetIndex] = updated;
      setStored(TOURNAMENTS_STORAGE_KEY, list);
      return updated;
    },

    async registerSquad(
      tournamentId: string,
      squadName: string,
      currentUser?: User | null
    ): Promise<TournamentItem> {
      const user = currentUser || api.auth.getCurrentUser();
      if (!user) {
        throw new Error('Authentication required: Guests cannot register for tournaments. Please log in.');
      }
      return this.join(tournamentId, { squadName, captainName: user.gamerTag }, user);
    }
  },

  teams: {
    async getAll(): Promise<Team[]> {
      try {
        const res = await fetch('/api/teams');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setStored(TEAMS_STORAGE_KEY, data);
            return data;
          }
        }
      } catch {
        // fallback
      }
      return getStored<Team[]>(TEAMS_STORAGE_KEY, INITIAL_TEAMS);
    },

    async create(
      teamData: {
        name: string;
        tag: string;
        region: 'NA' | 'EU' | 'APAC' | 'LATAM';
        game: string;
        description: string;
      },
      currentUser: User
    ): Promise<Team> {
      if (!currentUser) {
        throw new Error('Authentication required: Guests cannot create teams. Please log in.');
      }

      const colors = [
        'from-cyan-500 to-blue-600',
        'from-emerald-500 to-teal-600',
        'from-rose-500 to-red-600',
        'from-amber-500 to-orange-600',
        'from-violet-500 to-purple-600'
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const initialMember: TeamMember = {
        id: 'tm-' + Date.now().toString(36),
        gamerTag: currentUser.gamerTag,
        role: 'Captain',
        joinedAt: 'Just now'
      };

      const newTeam: Team = {
        id: 'team-' + Date.now().toString(36),
        name: teamData.name.trim(),
        tag: teamData.tag.trim().toUpperCase(),
        region: teamData.region,
        game: teamData.game,
        description: teamData.description.trim(),
        captain: currentUser.gamerTag,
        logoColor: randomColor,
        openToJoin: true,
        wins: 0,
        losses: 0,
        members: [initialMember]
      };

      try {
        const res = await fetch('/api/teams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.id}`
          },
          body: JSON.stringify(newTeam)
        });
        if (res.ok) {
          const saved = await res.json();
          return saved;
        }
      } catch {
        // fallback
      }

      const list = getStored<Team[]>(TEAMS_STORAGE_KEY, INITIAL_TEAMS);
      const updated = [newTeam, ...list];
      setStored(TEAMS_STORAGE_KEY, updated);

      // Update user with team
      api.auth.updateUser({
        teamId: newTeam.id,
        teamName: newTeam.name,
        teamTag: newTeam.tag,
        role: 'captain'
      });

      return newTeam;
    },

    async join(teamId: string, currentUser: User): Promise<Team> {
      if (!currentUser) {
        throw new Error('Authentication required: Guests cannot join teams. Please log in.');
      }

      try {
        const res = await fetch(`/api/teams/${teamId}/join`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.id}`
          },
          body: JSON.stringify({ gamerTag: currentUser.gamerTag })
        });
        if (res.ok) {
          const joinedTeam = await res.json();
          return joinedTeam;
        }
      } catch {
        // fallback
      }

      const list = getStored<Team[]>(TEAMS_STORAGE_KEY, INITIAL_TEAMS);
      const targetIndex = list.findIndex((t) => t.id === teamId);
      if (targetIndex === -1) {
        throw new Error('Team not found');
      }

      const targetTeam = list[targetIndex];
      const existingMembers = targetTeam.members || [];
      const isAlreadyMember = existingMembers.some((m) => m.gamerTag.toLowerCase() === currentUser.gamerTag.toLowerCase());

      if (isAlreadyMember) {
        throw new Error('You are already registered in this squad roster.');
      }

      const newMember: TeamMember = {
        id: 'tm-' + Date.now().toString(36),
        gamerTag: currentUser.gamerTag,
        role: 'Player',
        joinedAt: 'Just now'
      };

      const updatedTeam: Team = {
        ...targetTeam,
        members: [...existingMembers, newMember]
      };

      list[targetIndex] = updatedTeam;
      setStored(TEAMS_STORAGE_KEY, list);

      api.auth.updateUser({
        teamId: updatedTeam.id,
        teamName: updatedTeam.name,
        teamTag: updatedTeam.tag
      });

      return updatedTeam;
    }
  },

  leaderboard: {
    async getAll(): Promise<LeaderboardEntry[]> {
      try {
        const res = await fetch('/api/leaderboard');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data;
          }
        }
      } catch {
        // fallback
      }
      return INITIAL_LEADERBOARD;
    }
  }
};
