import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { verifyEmailChange } from '../services/userService';
import { useToast } from '../../hooks/useToast';

export default function VerifyEmailChangePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        showToast('Invalid verification link', 'error');
        return navigate('/login');
      }

      try {
        console.log('Verifying email change with token:', token);
        const response = await verifyEmailChange(token);
        console.log('Verification Response:', response);

        if (response.ok && response.data?.user) {
          const newEmail = response.data.user.email;

          showToast(
            `✅ Email verified successfully! You can now log in with your new email address (${newEmail}).`,
            'success'
          );

          // Force logout & clear everything to remove old JWT
          await logout();
          localStorage.clear();
          sessionStorage.clear();

          // Wait briefly so the toast is visible
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Redirect to login
          navigate('/login', { replace: true });
        } else {
          showToast(response.error?.message || 'Failed to verify email', 'error');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Verify email change error:', err);
        showToast(
          err.response?.data?.message || 'Server error during verification',
          'error'
        );
        navigate('/dashboard');
      }
    };

    verify();
  }, [token, logout, navigate, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Verifying email change...</h2>
        <p className="mt-3 text-sm text-gray-500">
          Please wait — you will be redirected shortly.
        </p>
      </div>
    </div>
  );
}
