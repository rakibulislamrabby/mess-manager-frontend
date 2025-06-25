import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import MealManagement from './pages/MealManagement';
import Deposits from './pages/Deposits';
import Members from './pages/Members';
import './App.css';

// Protected Route wrapper with loading state
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Public Route wrapper (redirects to dashboard if already authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
}

function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Fixed width and height */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Mobile sidebar overlay */}
      <div className="lg:hidden">
        <Sidebar />
      </div>
      
      {/* Main content area - Takes remaining width and height */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Main content with scroll */}
        <main className="flex-1 overflow-y-auto md:p-6 pt-16">
          <div className="max-w-6xl w-full mx-auto">
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/meals" element={<ProtectedRoute><MealManagement /></ProtectedRoute>} />
              <Route path="/deposits" element={<ProtectedRoute><Deposits /></ProtectedRoute>} />
              <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              {/* Add more routes here as you build more pages */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
