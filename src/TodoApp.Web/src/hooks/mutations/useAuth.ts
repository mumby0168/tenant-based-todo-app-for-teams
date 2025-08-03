import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../apis/auth.api';
import { useAuthStore } from '../../stores/auth-store';
import { useUiStore } from '../../stores/ui-store';
import { AUTH_CONSTANTS } from '../../constants/auth.constants';
import type {
  RequestCodeRequest,
  VerifyCodeRequest,
  CompleteRegistrationRequest,
} from '../../types/auth.types';

export function useRequestCode() {
  const navigate = useNavigate();
  const addNotification = useUiStore((state) => state.addNotification);
  const setPendingEmail = useAuthStore((state) => state.setPendingEmail);

  return useMutation({
    mutationFn: (data: RequestCodeRequest) => authApi.requestCode(data),
    onSuccess: (response, variables) => {
      // Store email in auth store for the verify step
      setPendingEmail(variables.email, false); // We don't know if new user yet
      addNotification(response.message, 'success');
      navigate('/verify');
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });
}

export function useVerifyCode() {
  const navigate = useNavigate();
  const { setAuth, setPendingEmail, setVerificationCode } = useAuthStore();
  const addNotification = useUiStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: VerifyCodeRequest) => authApi.verifyCode(data),
    onSuccess: (response, variables) => {
      if (response.isNewUser) {
        // New user needs to complete registration
        setPendingEmail(variables.email, true);
        setVerificationCode(variables.code); // Store the code for registration
        navigate('/register');
      } else if (response.user && response.token) {
        // Existing user - log them in
        // For now, we'll need to parse JWT to get team info
        // In a real app, the backend should return full team info
        const mockTeam = {
          id: '1',
          name: 'Default Team',
          role: AUTH_CONSTANTS.ADMIN_ROLE,
        };
        setAuth(response.user, mockTeam, response.token);
        addNotification('Welcome back!', 'success');
        navigate('/');
      }
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });
}

export function useCompleteRegistration() {
  const navigate = useNavigate();
  const { setAuth, setRegistrationInProgress } = useAuthStore();
  const addNotification = useUiStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: CompleteRegistrationRequest) => {
      setRegistrationInProgress(true);
      return authApi.completeRegistration(data);
    },
    onSuccess: (response) => {
      setAuth(response.user, response.team, response.token);
      addNotification('Account created successfully!', 'success');
      navigate('/');
    },
    onError: (error: Error) => {
      setRegistrationInProgress(false);
      addNotification(error.message, 'error');
    },
  });
}