import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserData, updateProfile } from '../services/userService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      const res = await getUserData();
      if (res.ok) setUser(res.data.user || res.data);
      setLoading(false);
    }
    fetchUser();
  }, []);

  async function refreshUser() {
    const res = await getUserData();
    if (res.ok) { setUser(res.data.user || res.data); return { ok: true }; }
    return res;
  }

  async function saveProfile(payload) {
    const res = await updateProfile(payload);
    if (res.ok) {
      setUser(res.data.user || res.data);
    }
    return res;
  }

  function signOut() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, saveProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}