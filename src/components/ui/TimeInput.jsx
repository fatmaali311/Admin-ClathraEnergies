// src/components/ui/TimeInput.jsx
import React from 'react';

const TimeInput = ({ name, value, onChange, disabled = false }) => (
    <input
        type="time" 
        step="60" 
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-lg text-center ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-blue-500 focus:border-blue-500'}`}
    />
);
export default TimeInput;