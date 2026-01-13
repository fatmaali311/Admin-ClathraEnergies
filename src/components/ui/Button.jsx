import React from 'react';

/**
 * Reusable Button Component
 * Used across the admin dashboard for form submissions and actions.
 */
const Button = ({
    type = 'button',
    onClick,
    children,
    disabled = false,
    className = '',
    style = {},
    variant = 'contained', // not strictly used if style is passed, but for future use
    ...props
}) => {
    const baseClasses = 'transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${className}`}
            style={style}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
