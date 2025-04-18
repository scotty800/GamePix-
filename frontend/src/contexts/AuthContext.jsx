import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(authService.getUser());

    useEffect(() => {
        const handleStorageChange = () => {
            const user = authService.getUser();
            console.log("🚨 handleStorageChange - Nouvelle donnée utilisateur:", user);
            setUser(user);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = (token, userData) => {
        console.log("🚨 login - token:", token);
        console.log("🚨 login - userData:", userData);

        authService.login(token, userData);
        const user = authService.getUser();
        console.log("🚨 Après login - Utilisateur chargé:", user);
        setUser(user);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        authService.updateUserData(updatedUser);
        setUser(updatedUser);
    };

    const getAuthHeader = () => authService.getAuthHeader();

    return (
        <AuthContext.Provider value={{
            user,
            authenticated: !!user,
            login,
            logout,
            getAuthHeader,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
