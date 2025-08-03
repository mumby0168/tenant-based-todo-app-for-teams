import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth-store";


export function useNavigateWhenUnauthenticated() {
    const navigate = useNavigate();
    const status = useAuthStore(state => state.status);

    useEffect(() => {
        if (status === 'unauthenticated') {
            console.warn('User is unauthenticated, redirecting to login');
            navigate('/login');
        }
    }, [status, navigate]);
}