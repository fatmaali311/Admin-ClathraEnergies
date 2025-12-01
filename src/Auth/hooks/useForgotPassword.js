import { useState, useCallback } from 'react';
import { forgotPassword } from '../services/userService';
import { formatAuthError } from '../utils/authHelpers';


export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleForgotPassword = useCallback(async (values) => {
    const email = values?.email?.trim();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const { ok, status, data } = await forgotPassword(email);
      if (ok) {
        const successMsg = data?.message || 'Email sent successfully';
        setMessage(successMsg);
        return { ok: true, status, data, successMsg };
      } else {
        const errMsg = formatAuthError(data?.message || 'Failed to send reset email');
        setError(errMsg);
        return { ok: false, status, data, errMsg };
      }
    } catch (err) {
      const networkErr = formatAuthError(err?.message || 'Network error');
      setError(networkErr);
      return { ok: false, status: 0, data: null, errMsg: networkErr };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    handleForgotPassword,
    loading,
    message,
    error,
    sent: !!message, 
  };
}
