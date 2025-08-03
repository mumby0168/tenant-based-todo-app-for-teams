import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../apis/auth.api";
import { useAuthStore } from "../../stores/auth-store";
import { useUiStore } from "../../stores/ui-store";
import type { RequestCodeRequest } from "../../types/auth.types";

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