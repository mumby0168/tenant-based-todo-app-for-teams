import { apiClient, isApiError } from '../lib/api-client';
import type { User, Team } from '../stores/auth-store';

// Request types
export interface RequestCodeRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  teamName: string;
}

// Response types
export interface RequestCodeResponse {
  message: string;
  expiresIn: number;
}

export interface VerifyCodeResponse {
  isNewUser: boolean;
  token?: string;
  user?: User;
  team?: Team;
  teams?: Team[];
}

export interface RegisterResponse {
  token: string;
  user: User;
  team: Team;
  teams: Team[];
}

// API functions
export const authApi = {
  async requestCode(data: RequestCodeRequest): Promise<RequestCodeResponse> {
    try {
      const response = await apiClient.post<RequestCodeResponse>(
        '/auth/request-code',
        data
      );
      return response.data;
    } catch (error) {
      if (isApiError(error) && error.response?.data) {
        throw new Error(error.response.data.message || 'Failed to send verification code');
      }
      throw new Error('Network error. Please try again.');
    }
  },

  async verifyCode(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    try {
      const response = await apiClient.post<VerifyCodeResponse>(
        '/auth/verify',
        data
      );
      return response.data;
    } catch (error) {
      if (isApiError(error) && error.response?.data) {
        throw new Error(error.response.data.message || 'Invalid verification code');
      }
      throw new Error('Network error. Please try again.');
    }
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse>(
        '/auth/register',
        data
      );
      return response.data;
    } catch (error) {
      if (isApiError(error) && error.response?.data) {
        throw new Error(error.response.data.message || 'Failed to create account');
      }
      throw new Error('Network error. Please try again.');
    }
  },
};