import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Users, 
  Calendar, 
  DollarSign, 
  ShoppingCart, 
  FileText, 
  LogOut,
  Menu,
  X,
  User,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser, currentMess, logout } = useAuth();

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: Home,
      accessible: true
    },
    {
      path: '/members',
      name: 'Members',
      icon: Users,
      accessible: true
    },
    {
      path: '/meals',
      name: 'Meal Management',
      icon: Calendar,
      accessible: currentUser?.role === 'manager'
    },
    {
      path: '/deposits',
      name: 'Deposits',
      icon: DollarSign,
      accessible: currentUser?.role === 'manager'
    },
    {
      path: '/bazaar',
      name: 'Bazaar Costs',
      icon: ShoppingCart,
      accessible: currentUser?.role === 'manager'
    },
    {
      path: '/reports',
      name: 'Reports',
      icon: FileText,
      accessible: true
    }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const generatePDF = () => {
    // This will be implemented in the Reports component
    window.location.href = '/reports';
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-indigo-600 text-white shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg
        flex flex-col h-screen
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-center h-16 px-4 bg-indigo-600 text-white flex-shrink-0">
          <h1 className="text-xl font-bold">Mess Manager</h1>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser?.email}
              </p>
              <p className="text-xs text-indigo-600 font-medium capitalize">
                {currentUser?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Mess Info */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="font-semibold text-gray-900 text-sm">{currentMess?.name}</h2>
          <p className="text-xs text-gray-600 truncate">{currentMess?.address}</p>
        </div>

        {/* Navigation Menu - Scrollable */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            if (!item.accessible) return null;
            
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Actions - Fixed at bottom */}
        <div className="px-4 py-4 border-t border-gray-200 space-y-2">
          <Link
            to="/profile"
            className={`
              w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${location.pathname === '/profile'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }
            `}
            onClick={() => setIsOpen(false)}
          >
            <Settings className="mr-3 h-5 w-5" />
            Profile Settings
          </Link>
          
          <button
            onClick={generatePDF}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
          >
            <FileText className="mr-3 h-5 w-5" />
            Export PDF
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar; 