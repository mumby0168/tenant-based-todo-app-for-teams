import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../apis/auth.api";
import { useAuthStore } from "../../stores/auth-store";
import { useUiStore } from "../../stores/ui-store";
import type { CompleteRegistrationRequest } from "../../types/auth.types";

export function useCompleteRegistration() {
    const navigate = useNavigate();
    const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
    const addNotification = useUiStore((state) => state.addNotification);

    return useMutation({
        mutationFn: (data: CompleteRegistrationRequest) => authApi.completeRegistration(data),
        onSuccess: (response) => {
            setAuthenticated(response.user, response.team, response.token);
            addNotification('Account created successfully!', 'success');
            navigate('/');
        },
        onError: (error: Error) => {
            addNotification(error.message, 'error');
        },
    });
}