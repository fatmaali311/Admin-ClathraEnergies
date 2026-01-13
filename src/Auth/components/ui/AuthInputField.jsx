import React from 'react';
import { motion } from 'framer-motion';

import { AUTH_ANIMATION_VARIANTS } from '../../utils/authConstants';

/**
 * Auth Input Field Component
 * Reusable input field for auth forms 
 */
const AuthInputField = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  required = false,
  autoComplete,
  className = ''
}) => {
  return (
    <motion.div variants={AUTH_ANIMATION_VARIANTS.item} className="space-y-1">
      <label
        className="block text-gray-700 mb-1 font-medium text-sm"
        htmlFor={id}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ADD0B3] focus:border-transparent transition text-sm ${error ? 'border-red-500' : ''} ${className}`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">{error}</p>
      )}
    </motion.div>
  );
};

export default AuthInputField;