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

interface AuthState {
  user: User | null;
  currentTeam: Team | null;
  teams: Team[];
  isAuthenticated: boolean;
  token: string | null;

  // Verification flow state
  pendingEmail: string | null;
  isNewUser: boolean;
  verificationCode: string | null;
  isRegistrationInProgress: boolean;

  // Actions
  setAuth: (user: UserInfo, team: TeamInfo, token: string, isNewUser: boolean) => void;
  setPendingEmail: (email: string, isNewUser: boolean) => void;
  setVerificationCode: (code: string) => void;
  setRegistrationInProgress: (inProgress: boolean) => void;
  clearPendingEmail: () => void;
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
      pendingEmail: null,
      isNewUser: false,
      verificationCode: null,
      isRegistrationInProgress: false,

      setAuth: (userInfo, teamInfo, token, isNewUser = false) => {
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
          user,
          currentTeam: team,
          teams: [team], // For now, single team
          isAuthenticated: true,
          token,
          isNewUser: isNewUser
        });
      },

      setPendingEmail: (email, isNewUser) => {
        set({ pendingEmail: email, isNewUser });
      },

      setVerificationCode: (code) => {
        set({ verificationCode: code });
      },

      setRegistrationInProgress: (inProgress) => {
        set({ isRegistrationInProgress: inProgress });
      },

      clearPendingEmail: () => {
        set({ pendingEmail: null, isNewUser: false, verificationCode: null, isRegistrationInProgress: false });
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
          user: null,
          currentTeam: null,
          teams: [],
          isAuthenticated: false,
          token: null,
          pendingEmail: null,
          isNewUser: false,
          verificationCode: null,
          isRegistrationInProgress: false,
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
        token: state.token,
      }),
    }
  )
);