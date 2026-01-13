import React, { useState } from 'react';
import { PRIMARY_COLOR } from '../Common/styles';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'French' },
    { code: 'zh', label: 'Chinese' }
];

const LocalizedInput = ({ label, value, onChange, name, placeholder, type = 'text', required = false, className = '' }) => {
    const [activeLang, setActiveLang] = useState('en');

    // Ensure value is an object. If string (legacy data), map it to 'en'.
    const safeValue = typeof value === 'string'
        ? { en: value, fr: '', zh: '' }
        : { en: '', fr: '', zh: '', ...value };

    const handleChange = (newValue) => {
        onChange({
            target: {
                name: name,
                value: {
                    ...safeValue,
                    [activeLang]: newValue
                }
            }
        });
    };

    return (
        <div className={`mb-4 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            type="button"
                            onClick={() => setActiveLang(lang.code)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${activeLang === lang.code
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            style={activeLang === lang.code ? { color: PRIMARY_COLOR } : {}}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>
            <input
                type={type}
                name={`${name}.${activeLang}`}
                value={safeValue[activeLang] || ''}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={`${placeholder || label} (${LANGUAGES.find(l => l.code === activeLang).label})`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-colors"
                style={{ focusRingColor: PRIMARY_COLOR }}
                required={required && activeLang === 'en'} // Only enforce required on default lang? Or all? Let's stick to EN for now as primary.
            />
        </div>
    );
};

export default LocalizedInput;
