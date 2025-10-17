import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheckCircle, MdError, MdWarning, MdInfo } from "react-icons/md";


const typeStyles = {
  success: 'bg-green-50 border-green-200 text-green-700',
  error: 'bg-red-50 border-red-200 text-red-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
};


const iconMap = {
  success: <MdCheckCircle className="text-green-500 mr-2" size={24} />,
  error: <MdError className="text-red-500 mr-2" size={24} />,
  warning: <MdWarning className="text-yellow-500 mr-2" size={24} />,
  info: <MdInfo className="text-blue-500 mr-2" size={24} />,
};


const Alert = ({ show, type = 'info', message, onClose, persistent = false }) => {
  useEffect(() => {
    // Auto close non-persistent alerts after 5 seconds
    if (show && !persistent && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [show, persistent, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`relative px-5 py-4 rounded-lg border font-semibold shadow-md flex items-center justify-center gap-2 mb-6 transition-all ${
            typeStyles[type] || typeStyles.info
          }`}
          role="alert"
        >
          {iconMap[type] || iconMap.info}
          <span className="flex-1">{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-3 top-2 text-xl text-gray-400 hover:text-gray-700"
              aria-label="Close"
            >
              &times;
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;