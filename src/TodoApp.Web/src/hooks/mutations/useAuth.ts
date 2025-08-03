import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../apis/auth.api';
import { useAuthStore } from '../../stores/auth-store';
import { useUiStore } from '../../stores/ui-store';
import type { RequestCodeRequest, VerifyCodeRequest, RegisterRequest } from '../../apis/auth.api';

export function useRequestCode() {
  const navigate = useNavigate();
  const addNotification = useUiStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: RequestCodeRequest) => authApi.requestCode(data),
    onSuccess: (_, variables) => {
      // Store email in session storage for the verify step
      sessionStorage.setItem('auth_email', variables.email);
      navigate('/login/verify');
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });
}

export function useVerifyCode() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const addNotification = useUiStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: VerifyCodeRequest) => authApi.verifyCode(data),
    onSuccess: (response, variables) => {
      if (response.isNewUser) {
        // New user needs to complete registration
        sessionStorage.setItem('auth_email', variables.email);
        navigate('/signup/create-account');
      } else if (response.user && response.team && response.teams && response.token) {
        // Existing user - log them in
        setAuth(response.user, response.team, response.teams, response.token);
        sessionStorage.removeItem('auth_email');
        
        if (response.teams.length > 1) {
          navigate('/login/select-team');
        } else {
          navigate('/');
        }
      }
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const addNotification = useUiStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      setAuth(response.user, response.team, response.teams, response.token);
      sessionStorage.removeItem('auth_email');
      addNotification('Account created successfully!', 'success');
      navigate('/');
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });
}