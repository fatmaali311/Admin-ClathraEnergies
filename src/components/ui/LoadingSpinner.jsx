import React from 'react';
import { PRIMARY_COLOR } from '../Common/styles';

/**
 * Reusable Loading Spinner
 * Corrected to handle both PRIMARY_COLOR (hex bit) and standard Tailwind colors.
 */
const LoadingSpinner = ({ color = PRIMARY_COLOR }) => {
    // If color is a hex code (starts with #), use Tailwind's arbitrary value syntax
    const colorClass = color && color.startsWith('#') ? `border-[${color}]` : `border-${color}`;

    return (
        <div className={`animate-spin rounded-full h-5 w-5 border-b-2 ${colorClass}`}></div>
    );
};

export default LoadingSpinner;