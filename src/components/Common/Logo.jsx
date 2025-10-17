import React from 'react';
import logo from '../../assets/images/logo.png'; 
import WhiteLogo from '../../assets/images/white-logo.png';

/**
 * Logo Component
 * * @param {string} size - The height of the logo ('small', 'medium', 'large', 'xl').
 * @param {string} className - Additional Tailwind CSS classes.
 * @param {boolean} center - If true, centers the logo horizontally (mx-auto).
 * @param {boolean} marginBottom - If true, adds a bottom margin (mb-3).
 * @param {string} color - 'default' for the main logo, 'white' for the white variant.
 */
const Logo = ({ 
  size = 'medium', 
  className = '', 
  center = false, 
  marginBottom = true,
  color = 'default' 
}) => {
  

  const sizeClasses = {
    small: 'h-8',
    medium: 'h-12',
    large: 'h-16',
    xl: 'h-20',
    sm: 'h-10', 
  };
  
  const imageSource = color === 'white' ? WhiteLogo : logo;

  const baseClasses = [
    'w-auto',
    sizeClasses[size] || sizeClasses.medium,
    center && 'mx-auto',
    marginBottom && 'mb-3',
    className
  ].filter(Boolean).join(' ');

  return (
    <img 
      src={imageSource}
      alt="ClathraEnergies Logo" 
      className={baseClasses}
    />
  );
};

export default Logo;