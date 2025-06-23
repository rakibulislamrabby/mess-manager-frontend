import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Users, Plus, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMessOptions, setShowMessOptions] = useState(false);
  const [messName, setMessName] = useState('');
  const [messAddress, setMessAddress] = useState('');
  const [messId, setMessId] = useState('');

  const { login, createMess, joinMess } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      setShowMessOptions(true);
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const handleCreateMess = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await createMess({
      name: messName,
      address: messAddress
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError('Failed to create mess');
    }
    
    setIsLoading(false);
  };

  const handleJoinMess = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await joinMess(messId);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError('Failed to join mess');
    }
    
    setIsLoading(false);
  };

  if (showMessOptions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Mess Access
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Choose how you want to access your mess
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            {/* Create New Mess */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Plus className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Create New Mess</h3>
              </div>
              <form onSubmit={handleCreateMess} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mess Name
                  </label>
                  <input
                    type="text"
                    required
                    value={messName}
                    onChange={(e) => setMessName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter mess name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={messAddress}
                    onChange={(e) => setMessAddress(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter mess address"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Mess'}
                </button>
              </form>
            </div>

            {/* Join Existing Mess */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <UserCheck className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Join Existing Mess</h3>
              </div>
              <form onSubmit={handleJoinMess} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mess ID
                  </label>
                  <input
                    type="text"
                    required
                    value={messId}
                    onChange={(e) => setMessId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter mess ID"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Joining...' : 'Join Mess'}
                </button>
              </form>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Mess Management System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Demo credentials: john@example.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 