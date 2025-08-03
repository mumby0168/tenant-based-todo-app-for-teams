import { apiClient } from '../lib/api-client';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import type {
  RequestCodeRequest,
  RequestCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  CompleteRegistrationRequest,
  AuthResponse,
  ProblemDetails
} from '../types/auth.types';

// Helper to extract error message from backend response
function getErrorMessage(error: any, defaultMessage: string): string {
  if (error.response?.data) {
    const problemDetails = error.response.data as ProblemDetails;
    return problemDetails.detail || problemDetails.title || defaultMessage;
  }
  return error.message || defaultMessage;
}

// API functions
export const authApi = {
  async requestCode(data: RequestCodeRequest): Promise<RequestCodeResponse> {
    try {
      const response = await apiClient.post<RequestCodeResponse>(
        AUTH_CONSTANTS.REQUEST_CODE_ENDPOINT,
        data
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new Error(AUTH_CONSTANTS.TOO_MANY_REQUESTS);
      }
      throw new Error(getErrorMessage(error, 'Failed to send verification code'));
    }
  },

  async verifyCode(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    try {
      const response = await apiClient.post<VerifyCodeResponse>(
        AUTH_CONSTANTS.VERIFY_CODE_ENDPOINT,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(getErrorMessage(error, AUTH_CONSTANTS.INVALID_CODE));
    }
  },

  async completeRegistration(data: CompleteRegistrationRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        AUTH_CONSTANTS.COMPLETE_REGISTRATION_ENDPOINT,
        data
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        const problemDetails = error.response.data as ProblemDetails;
        if (problemDetails.title === 'User exists') {
          throw new Error(AUTH_CONSTANTS.ACCOUNT_EXISTS);
        }
      }
      throw new Error(getErrorMessage(error, 'Failed to create account'));
    }
  },
};