// src/components/ui/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ color = 'white' }) => (
    <div className={`animate-spin rounded-full h-5 w-5 border-b-2 border-${color}-500`}></div>
);
export default LoadingSpinner;