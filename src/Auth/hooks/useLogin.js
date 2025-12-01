import { useCallback } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { formatAuthError, getDashboardRoute } from '../utils/authHelpers';
import { useAuth } from '../../contexts/AuthContext';

export function useLogin() {
 const navigate = useNavigate();
 const { login } = useAuth();

 const submitLogin = useCallback(
  async (credentials, { setSubmitting, setStatus }) => {
   setSubmitting(true);
   setStatus(null); 

   try {
    const { ok, status, data } = await loginUser(credentials);

    if (ok) {
     const token = data?.token || null; 
     if (!token) {
      setStatus(formatAuthError('Login succeeded but token missing.'));
      return { ok: false, status, data };
     }

     login(data?.user, token);
     navigate(getDashboardRoute(data?.user?.role || 'admin'));
     return { ok: true, status, data };
    } else {
     setStatus(formatAuthError(data?.message || (status === 401 ? 'Invalid credentials or incomplete profile.' : 'Login failed')));
     return { ok: false, status, data };
    }
   } catch (err) {
    setStatus(formatAuthError(err?.message || 'Network error. Please check your connection.'));
    return { ok: false, status: 0, data: null };
   } finally {
    setSubmitting(false);
   }
  },
  [navigate, login]
 );

 return { submitLogin };
}