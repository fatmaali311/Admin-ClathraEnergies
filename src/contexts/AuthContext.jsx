// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { logoutRequest, fetchUserProfile } from '../Auth/services/authService';
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Must be true initially

    const login = useCallback((userData, tokenValue) => {
        setUser(userData || null);
        setToken(tokenValue);
        // FIX: Standardize saving to 'token' only
        if (tokenValue) localStorage.setItem('token', tokenValue);
    }, []);

    const logout = useCallback(async () => {
        setUser(null);
        setToken(null);
        // FIX: Clear 'token' only
        localStorage.removeItem('token');
        await logoutRequest().catch(() => console.warn('Logout API warning'));
    }, []);

    // FIX: Logic to fetch user profile using the token on page refresh
    useEffect(() => {
        // Only run if a token is present but the user object is null
        if (token && !user) {
            const fetchUser = async () => {
                setLoading(true);
                try {
                    const { ok, data } = await fetchUserProfile();

                    if (ok && data?.user) {
                        // This restores the user object, including the 'role'
                        setUser(data.user);
                    } else {
                        console.error('Token invalid or profile fetch failed.');
                        logout(); // Invalid token means automatic logout
                    }
                } catch (err) {
                    console.error('Error fetching user:', err);
                    logout();
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        } else {
            // If no token or user is already set, stop loading
            setLoading(false);
        }
    }, [token, user, logout]);

    return (
        <AuthContext.Provider value={{ token, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}