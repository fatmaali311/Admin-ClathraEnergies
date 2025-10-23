import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../ui/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const closeToast = useCallback(() => setToast({ message: '', type: '' }), []);

  return (
    <ToastContext.Provider value={{ toast, showToast, closeToast }}>
      {children}
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used within ToastProvider');
  return ctx;
};
