import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../apis/auth.api';
import { useAuthStore } from '../../stores/auth-store';
import { useUiStore } from '../../stores/ui-store';
import { AUTH_CONSTANTS } from '../../constants/auth.constants';
import type { VerifyCodeRequest } from '../../types/auth.types';

export function useVerifyCode() {
  const navigate = useNavigate();
  const { setAuthenticated, setAwaitingRegistration } = useAuthStore();
  const addNotification = useUiStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: VerifyCodeRequest) => authApi.verifyCode(data),
    onSuccess: (response, variables) => {
      if (response.isNewUser) {
        setAwaitingRegistration(variables.email, variables.code);
        navigate('/register');
      } else if (response.user && response.token) {
        const mockTeam = {
          id: '1',
          name: 'Default Team',
          role: AUTH_CONSTANTS.ADMIN_ROLE,
        };
        setAuthenticated(response.user, mockTeam, response.token);
        addNotification('Welcome back!', 'success');
        navigate('/');
      }
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });
}