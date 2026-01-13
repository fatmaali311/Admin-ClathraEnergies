/**
 * Auth Constants
 * Shared animation variants and validation regex for authentication module
 */

export const AUTH_ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100 
      } 
    }
  },
  simpleFade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }
};

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const PASSWORD_ERROR_MESSAGE = 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character';

export const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;
