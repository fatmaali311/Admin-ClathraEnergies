export const getRoleDisplayName = (role) => {
  const roleNames = {
    admin: 'Administrator',
    superadmin: 'Super Administrator'
  };
  return roleNames[role] || 'admin';
};

export const getDashboardRoute = (role) => {
  const routes = {
    admin: '/',
    superadmin: '/'
  };
  return routes[role] || '/';
};

export const hasPermission = (userRole, requiredRole) => {
  const roleHierarchy = {
    superadmin: 2,
    admin: 1
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const formatAuthError = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'An unexpected error occurred. Please try again.';
};