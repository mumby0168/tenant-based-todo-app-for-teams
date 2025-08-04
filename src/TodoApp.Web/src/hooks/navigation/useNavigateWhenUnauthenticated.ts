import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth-store";


export function useNavigateWhenUnauthenticated() {
    const navigate = useNavigate();
    const status = useAuthStore(state => state.status);

    useEffect(() => {
        if (status === 'unauthenticated') {            
            navigate('/login');
        }
    }, [status, navigate]);
}