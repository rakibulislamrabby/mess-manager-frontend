import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, mockMess } from '../data/mockData';
import { 
  validateEmail, 
  validatePassword, 
  hashPassword, 
  generateToken, 
  isTokenExpired,
  clearAuthData,
  saveAuthData
} from '../utils/authUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentMess, setCurrentMess] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState(null);

  // Initialize users in localStorage if not exists
  useEffect(() => {
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      // Initialize with mock users and hashed passwords
      const initialUsers = mockUsers.map(user => ({
        ...user,
        passwordHash: hashPassword('password123'), // Default password for demo users
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true
      }));
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
  }, []);

  // Check for existing session on app load
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        const savedMess = localStorage.getItem('currentMess');
        const savedToken = localStorage.getItem('sessionToken');
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        
        if (savedUser && savedMess && savedToken && tokenExpiry) {
          // Check if token is still valid
          if (!isTokenExpired(tokenExpiry)) {
            setCurrentUser(JSON.parse(savedUser));
            setCurrentMess(JSON.parse(savedMess));
            setSessionToken(savedToken);
            setIsAuthenticated(true);
          } else {
            // Token expired, clear everything
            logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = async (userData) => {
    try {
      const { name, email, password, confirmPassword } = userData;

      // Validation
      if (!name || !email || !password || !confirmPassword) {
        return { success: false, error: 'All fields are required' };
      }

      if (!validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error };
      }

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = existingUsers.find(user => user.email === email);
      
      if (userExists) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        name,
        email,
        passwordHash: hashPassword(password),
        role: 'viewer', // Default role
        messId: null,
        balance: 0,
        totalMeals: 0,
        totalDeposits: 0,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true
      };

      // Save user to localStorage
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const login = async (email, password) => {
    try {
      // Validation
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      if (!validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.isActive);

      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Check password
      const passwordHash = hashPassword(password);
      if (user.passwordHash !== passwordHash) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Generate session token
      const token = generateToken();
      const tokenExpiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours

      // Update user's last login
      user.lastLogin = new Date().toISOString();
      const updatedUsers = users.map(u => u.id === user.id ? user : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Set session data
      setCurrentUser(user);
      setSessionToken(token);
      setIsAuthenticated(true);

      // Save session to localStorage
      saveAuthData(user, null, token, tokenExpiry);

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentMess(null);
    setIsAuthenticated(false);
    setSessionToken(null);
    
    // Clear localStorage
    clearAuthData();
  };

  const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
    try {
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' };
      }

      // Validate current password
      const currentPasswordHash = hashPassword(currentPassword);
      if (currentUser.passwordHash !== currentPasswordHash) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Validate new password
      if (newPassword !== confirmNewPassword) {
        return { success: false, error: 'New passwords do not match' };
      }

      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error };
      }

      // Update password
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            passwordHash: hashPassword(newPassword)
          };
        }
        return user;
      });

      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Update current user
      const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Failed to change password. Please try again.' };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' };
      }

      const { name, email } = profileData;

      // Validate email if changed
      if (email !== currentUser.email) {
        if (!validateEmail(email)) {
          return { success: false, error: 'Please enter a valid email address' };
        }

        // Check if email is already taken
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const emailExists = users.find(u => u.email === email && u.id !== currentUser.id);
        if (emailExists) {
          return { success: false, error: 'Email is already taken' };
        }
      }

      // Update user
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            name: name || user.name,
            email: email || user.email
          };
        }
        return user;
      });

      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Update current user
      const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Failed to update profile. Please try again.' };
    }
  };

  const createMess = (messData) => {
    try {
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' };
      }

      const newMess = {
        id: Date.now(),
        name: messData.name,
        address: messData.address,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.id,
        members: [currentUser],
        isActive: true
      };
      
      setCurrentMess(newMess);
      localStorage.setItem('currentMess', JSON.stringify(newMess));
      
      // Update user's messId
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return { ...user, messId: newMess.id };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update current user
      const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return { success: true, mess: newMess };
    } catch (error) {
      console.error('Create mess error:', error);
      return { success: false, error: 'Failed to create mess. Please try again.' };
    }
  };

  const joinMess = (messId) => {
    try {
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' };
      }

      // For demo purposes, use mockMess
      // In a real app, you would fetch the mess from an API
      setCurrentMess(mockMess);
      localStorage.setItem('currentMess', JSON.stringify(mockMess));
      
      // Update user's messId
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return { ...user, messId: mockMess.id };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update current user
      const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return { success: true, mess: mockMess };
    } catch (error) {
      console.error('Join mess error:', error);
      return { success: false, error: 'Failed to join mess. Please try again.' };
    }
  };

  const value = {
    currentUser,
    currentMess,
    isAuthenticated,
    isLoading,
    sessionToken,
    register,
    login,
    logout,
    changePassword,
    updateProfile,
    createMess,
    joinMess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 