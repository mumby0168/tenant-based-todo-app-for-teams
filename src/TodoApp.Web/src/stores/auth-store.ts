import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import type { UserInfo, TeamInfo } from '../types/auth.types';

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface Team {
  id: string;
  name: string;
  role: string; // 'Admin' | 'Member'
}

type AuthStatus = 
  | 'unauthenticated'
  | 'code_requested' 
  | 'awaiting_registration'
  | 'authenticated';

interface AuthState {
  status: AuthStatus;
  user: User | null;
  currentTeam: Team | null;
  teams: Team[];
  token: string | null;

  // Temporary flow state
  pendingEmail: string | null;
  pendingCode: string | null; // Only stored when needed for registration

  // Actions
  setAuthenticated: (user: UserInfo, team: TeamInfo, token: string) => void;
  setCodeRequested: (email: string) => void;
  setAwaitingRegistration: (email: string, code: string) => void;
  reset: () => void;
  switchTeam: (teamId: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      status: 'unauthenticated',
      user: null,
      currentTeam: null,
      teams: [],
      token: null,
      pendingEmail: null,
      pendingCode: null,

      setAuthenticated: (userInfo, teamInfo, token) => {
        localStorage.setItem(AUTH_CONSTANTS.AUTH_TOKEN_KEY, token);
        const user: User = {
          id: userInfo.id,
          email: userInfo.email,
          displayName: userInfo.displayName,
        };
        const team: Team = {
          id: teamInfo.id,
          name: teamInfo.name,
          role: teamInfo.role,
        };
        set({
          status: 'authenticated',
          user,
          currentTeam: team,
          teams: [team], // For now, single team
          token,
          pendingEmail: null,
          pendingCode: null,
        });
      },

      setCodeRequested: (email) => {
        set({ 
          status: 'code_requested',
          pendingEmail: email,
          pendingCode: null,
        });
      },

      setAwaitingRegistration: (email, code) => {
        set({
          status: 'awaiting_registration',
          pendingEmail: email,
          pendingCode: code,
        });
      },

      reset: () => {
        set({
          status: 'unauthenticated',
          pendingEmail: null,
          pendingCode: null,
        });
      },

      switchTeam: (teamId) => {
        const team = get().teams.find((t) => t.id === teamId);
        if (team) {
          set({ currentTeam: team });
        }
      },

      logout: () => {
        localStorage.removeItem(AUTH_CONSTANTS.AUTH_TOKEN_KEY);
        set({
          status: 'unauthenticated',
          user: null,
          currentTeam: null,
          teams: [],
          token: null,
          pendingEmail: null,
          pendingCode: null,
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
        status: state.status,
        user: state.user,
        currentTeam: state.currentTeam,
        teams: state.teams,
        token: state.token,
      }),
    }
  )
);