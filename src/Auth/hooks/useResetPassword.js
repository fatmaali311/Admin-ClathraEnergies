// src/hooks/useResetPassword.js
import { useCallback } from 'react';
import { resetPassword } from '../services/userService';
import { useNavigate, useParams } from 'react-router-dom';
import { formatAuthError } from '../utils/authHelpers';

export function useResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const submitResetPassword = useCallback(
    async (values, { setSubmitting, setStatus }) => {
      setSubmitting(true);
      setStatus(null);

      try {
        const payload = { password: values.password };
        const { ok, status, data } = await resetPassword(token, payload);

        if (ok) {
          setStatus({ success: data?.message || 'Password reset successfully', reset: true });
          setTimeout(() => navigate('/login'), 3000); // Redirect to login
          return { ok: true, status, data };
        } else {
          // General API error (e.g., token expired, 400 status)
          setStatus({ error: formatAuthError(data?.message || (status === 400 ? 'The reset link has expired.' : 'Invalid reset link or password.')) });
          return { ok: false, status, data };
        }
      } catch (err) {
        setStatus({ error: formatAuthError(err?.message || 'Network error. Please check your connection.') });
        return { ok: false, status: 0, data: null };
      } finally {
        setSubmitting(false);
      }
    },
    [token, navigate]
  );

  return { submitResetPassword };
}