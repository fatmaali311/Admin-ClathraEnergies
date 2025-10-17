import React from 'react';

const Button = ({ children, onClick, type = 'button', disabled = false, className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#ADD0B3] hover:bg-[#388E3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#388E3C] disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

export default Button;