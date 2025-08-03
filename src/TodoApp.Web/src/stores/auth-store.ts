import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
}

export interface Team {
  id: string;
  name: string;
  role: 'Owner' | 'Admin' | 'Member';
}

interface AuthState {
  user: User | null;
  currentTeam: Team | null;
  teams: Team[];
  isAuthenticated: boolean;
  token: string | null;
  
  // Actions
  setAuth: (user: User, team: Team, teams: Team[], token: string) => void;
  switchTeam: (teamId: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      currentTeam: null,
      teams: [],
      isAuthenticated: false,
      token: null,

      setAuth: (user, team, teams, token) => {
        localStorage.setItem('auth_token', token);
        set({
          user,
          currentTeam: team,
          teams,
          isAuthenticated: true,
          token,
        });
      },

      switchTeam: (teamId) => {
        const team = get().teams.find((t) => t.id === teamId);
        if (team) {
          set({ currentTeam: team });
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          currentTeam: null,
          teams: [],
          isAuthenticated: false,
          token: null,
        });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        currentTeam: state.currentTeam,
        teams: state.teams,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);