import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { logoutRequest, fetchUserProfile } from '../Auth/services/authService';
import { updateProfile } from '../Auth/services/userService';

const AuthContext = createContext();

// Create the initial auth state
const initialState = {
    token: localStorage.getItem('token') || null,
    user: null,
    loading: true
};

export function AuthProvider({ children }) {
    const [token, setToken] = useState(initialState.token);
    const [user, setUser] = useState(initialState.user);
    const [loading, setLoading] = useState(initialState.loading);

    const login = useCallback((userData, tokenValue) => {
        setUser(userData || null);
        setToken(tokenValue);
        if (tokenValue) localStorage.setItem('token', tokenValue);
    }, []);

    const logout = useCallback(async () => {
        // Clear storage first
        localStorage.clear();
        sessionStorage.clear();

        // Clear state
        setUser(null);
        setToken(null);
        setLoading(false);

        try {
            // Attempt backend logout
            await logoutRequest();
        } catch (err) {
            console.error('Logout API error:', err);
        }

        // Double check storage is cleared
        localStorage.clear();
        sessionStorage.clear();

        // Force remove specific items just in case
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');

        // Force a complete page refresh
        window.location.replace('/login');
    }, []);

    const signOut = logout;

    const refreshUser = useCallback(async () => {
        const res = await fetchUserProfile();
        if (res.ok) {
            setUser(res.data.user || res.data);
            return { ok: true };
        }
        return res;
    }, []);

    const saveProfile = useCallback(async (payload) => {
        const res = await updateProfile(payload);
        if (res.ok) {
            setUser(res.data.user || res.data);
        }
        return res;
    }, []);


    //Logic to fetch user profile using the token on page refresh
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
        <AuthContext.Provider value={{ token, user, login, logout, signOut, loading, refreshUser, saveProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}