import { useCallback } from 'react';
import { completeProfile } from '../services/userService';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatAuthError } from '../utils/authHelpers';


export function useSetupAccount() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const token = query.get('token');
  const navigate = useNavigate();

  const submitSetupAccount = useCallback(
    async (values, { setSubmitting, setStatus }) => {
      setSubmitting(true);
      setStatus(null);

      // Early exit if token is missing
      if (!token) {
        setStatus({ error: formatAuthError('Missing setup token. Please use the full link.') });
        setSubmitting(false);
        return { ok: false, status: 400, data: null };
      }

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
    [token, navigate],
  );

  return {
    submitSetupAccount,
    token,
  };
}
