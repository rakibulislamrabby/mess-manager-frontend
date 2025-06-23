import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MealManagement from './pages/MealManagement';
import Deposits from './pages/Deposits';
import './App.css';

// Simple Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
}

function AppLayout() {
  return (
    <div className="flex">
      {/* Sidebar is fixed on the left */}
      <Sidebar />
      {/* Main content fills the rest, with left margin for sidebar */}
      <main className="min-h-screen bg-gray-50 flex-1 p-6">
        <div className="max-w-6xl w-full">
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/meals" element={<ProtectedRoute><MealManagement /></ProtectedRoute>} />
            <Route path="/deposits" element={<ProtectedRoute><Deposits /></ProtectedRoute>} />
            {/* Add more routes here as you build more pages */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
