import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../apis/auth.api";
import { useAuthStore } from "../../stores/auth-store";
import { useUiStore } from "../../stores/ui-store";
import type { CompleteRegistrationRequest } from "../../types/auth.types";

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
            setAuth(response.user, response.team, response.token, false);
            addNotification('Account created successfully!', 'success');
            navigate('/');
        },
        onError: (error: Error) => {
            setRegistrationInProgress(false);
            addNotification(error.message, 'error');
        },
    });
}