// src/hooks/useSetupAccount.js
import { useCallback } from 'react';
import { completeProfile } from '../services/userService';
import { useParams, useNavigate } from 'react-router-dom';
import { formatAuthError } from '../utils/authHelpers';

export function useSetupAccount() {
  const { token } = useParams();
  const navigate = useNavigate();

  const submitSetupAccount = useCallback(
    async (values, { setSubmitting, setStatus }) => {
      setSubmitting(true);
      setStatus(null);

      try {
        const body = {
          userName: values.userName,
          fullName: values.fullName,
          password: values.password,
        };

        const { ok, status, data } = await completeProfile(token, body);

        if (ok) {
          setStatus({ success: data?.message || 'Profile completed successfully', setupComplete: true });
          setTimeout(() => navigate('/login'), 3000); // Redirect to login
          return { ok: true, status, data };
        } else {
          // General API error (e.g., 400 Bad Request, token issues)
          setStatus({ error: formatAuthError(data?.message || 'Failed to complete profile') });
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

  return { submitSetupAccount };
}