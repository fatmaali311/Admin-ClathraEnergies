import React from 'react';

const InputGroup = ({ title, name, value, onChange, type = 'text', className = '' }) => (
    <div>
        <label className="block text-md font-semibold text-gray-700 mb-1">{title}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-600 focus:border-blue-600 text-lg ${className}`}
        />
    </div>
);
export default InputGroup;