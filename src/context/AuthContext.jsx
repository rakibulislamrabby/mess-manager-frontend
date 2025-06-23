import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, mockMess } from '../data/mockData';

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

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedMess = localStorage.getItem('currentMess');
    
    if (savedUser && savedMess) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentMess(JSON.parse(savedMess));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email, password) => {
    // Simple mock authentication - in real app, this would be API call
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
      // Mock password check (in real app, this would be proper authentication)
      if (password === 'password123') {
        setCurrentUser(user);
        setCurrentMess(mockMess);
        setIsAuthenticated(true);
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('currentMess', JSON.stringify(mockMess));
        
        return { success: true, user };
      }
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentMess(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentMess');
  };

  const createMess = (messData) => {
    // Mock mess creation
    const newMess = {
      id: Date.now(),
      name: messData.name,
      address: messData.address,
      createdAt: new Date().toISOString().split('T')[0],
      members: [currentUser]
    };
    
    setCurrentMess(newMess);
    localStorage.setItem('currentMess', JSON.stringify(newMess));
    
    return { success: true, mess: newMess };
  };

  const joinMess = (messId) => {
    // Mock joining existing mess
    setCurrentMess(mockMess);
    localStorage.setItem('currentMess', JSON.stringify(mockMess));
    
    return { success: true, mess: mockMess };
  };

  const value = {
    currentUser,
    currentMess,
    isAuthenticated,
    login,
    logout,
    createMess,
    joinMess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 