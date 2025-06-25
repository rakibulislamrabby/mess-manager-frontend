// Authentication utility functions

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (password.length < minLength) {
    return { valid: false, error: 'Password must be at least 6 characters long' };
  }
  if (!hasUpperCase || !hasLowerCase) {
    return { valid: false, error: 'Password must contain both uppercase and lowercase letters' };
  }
  if (!hasNumbers) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  
  return { valid: true };
};

// Simple hash function for demo purposes (in production, use bcrypt or similar)
export const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

// Generate session token
export const generateToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Check if token is expired
export const isTokenExpired = (tokenExpiry) => {
  if (!tokenExpiry) return true;
  return new Date().getTime() > parseInt(tokenExpiry);
};

// Get user from localStorage
export const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from storage:', error);
    return null;
  }
};

// Get mess from localStorage
export const getMessFromStorage = () => {
  try {
    const mess = localStorage.getItem('currentMess');
    return mess ? JSON.parse(mess) : null;
  } catch (error) {
    console.error('Error parsing mess from storage:', error);
    return null;
  }
};

// Clear all auth data from localStorage
export const clearAuthData = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentMess');
  localStorage.removeItem('sessionToken');
  localStorage.removeItem('tokenExpiry');
};

// Save auth data to localStorage
export const saveAuthData = (user, mess, token, expiry) => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('currentMess', JSON.stringify(mess));
    localStorage.setItem('sessionToken', token);
    localStorage.setItem('tokenExpiry', expiry.toString());
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

// Check if user has required role
export const hasRole = (user, requiredRole) => {
  if (!user || !user.role) return false;
  return user.role === requiredRole;
};

// Check if user is manager
export const isManager = (user) => {
  return hasRole(user, 'manager');
};

// Check if user is viewer
export const isViewer = (user) => {
  return hasRole(user, 'viewer');
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString();
};

// Format datetime for display
export const formatDateTime = (dateString) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleString();
}; 