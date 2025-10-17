import { useState, useCallback } from 'react';

/**
 * Custom hook to manage toast notifications state.
 * @returns {{toast: {message: string, type: 'success' | 'error' | 'info' | ''}, showToast: (message: string, type: 'success' | 'error' | 'info') => void, closeToast: () => void}}
 */
export const useToast = () => {
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast({ message: '', type: '' });
  }, []);

  return { toast, showToast, closeToast };
};