import { useUserStore } from '../state/useUserStore';

export function useAuth() {
    const { user, isAuthenticated, login, logout } = useUserStore();

    return {
        user,
        isAuthenticated,
        login,
        logout,
        // Add more auth logic here (e.g. check permissions)
    };
}
