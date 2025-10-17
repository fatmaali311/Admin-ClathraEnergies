// src/components/Toast.jsx

import React, { useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
  // Automatically close the toast after 5 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const baseClasses =
    "fixed bottom-5 right-5 z-50 p-4 rounded-lg shadow-xl text-white transition-opacity duration-300";
  const typeClasses =
    type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span className="font-semibold mr-4">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 font-bold text-lg leading-none opacity-80 hover:opacity-100"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;