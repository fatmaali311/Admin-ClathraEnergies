import { useCallback } from 'react';
import { resetPassword } from '../services/userService';
import { useNavigate, useLocation } from 'react-router-dom'; // Changed to useLocation to read query param
import { formatAuthError } from '../utils/authHelpers';



export function useResetPassword() {
  // The token is now retrieved from the URL query via ?token=...
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const token = query.get('token');
  const navigate = useNavigate();

  const submitResetPassword = useCallback(
    async (values, { setSubmitting, setStatus }) => {
      setSubmitting(true);
      setStatus(null);

      // Early exit if token is missing
      if (!token) {
        setStatus({ error: formatAuthError('Missing reset token. Please use the full link from your email.') });
        setSubmitting(false);
        return { ok: false, status: 400, data: null };
      }

      try {
        const payload = { password: values.password };
        // resetPassword now uses the token as a path parameter in the API call
        const { ok, status, data } = await resetPassword(token, payload);

        if (ok) {
          setStatus({ success: data?.message || 'Password reset successfully', reset: true });
          setTimeout(() => navigate('/login'), 3000); // Redirect to login
          return { ok: true, status, data };
        } else {
          // General API error (e.g., 400 Token expired)
          setStatus({
            error: formatAuthError(
              data?.message || (status === 400 ? 'The reset link has expired or is invalid.' : 'Invalid reset link or password.')
            ),
          });
          return { ok: false, status, data };
        }
      } catch (err) {
        setStatus({
          error: formatAuthError(err?.message || 'Network error. Please check your connection.'),
        });
        return { ok: false, status: 0, data: null };
      } finally {
        setSubmitting(false);
      }
    },
    [token, navigate],
  );

  return {
    submitResetPassword,
    token,
  };
}
