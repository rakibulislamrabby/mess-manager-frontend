import { useState } from 'react';
import { useLogin } from '../hooks/auth/use-login';

const LoginExample = () => {
  const [email, setEmail] = useState('zesan@gmail.com');
  const [password, setPassword] = useState('123456');
  
  const { 
    login, 
    loginAsync, 
    isLoading, 
    isError, 
    error, 
    isSuccess, 
    data, 
    reset 
  } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    login({
      email: email,
      password: password
    });
  };

  const handleLoginAsync = async (e) => {
    e.preventDefault();
    try {
      const result = await loginAsync({
        email: email,
        password: password
      });
      console.log('Login successful:', result);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Login Example</h2>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter email"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter password"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Login (mutate)'}
          </button>
          
          <button
            type="button"
            onClick={handleLoginAsync}
            disabled={isLoading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            Login (async)
          </button>
        </div>
        
        <button
          type="button"
          onClick={reset}
          className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reset
        </button>
      </form>
      
      {/* Status Display */}
      <div className="mt-6 space-y-2">
        {isLoading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded">
            Loading...
          </div>
        )}
        
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
            Error: {error?.response?.data?.message || error?.message || 'Login failed'}
          </div>
        )}
        
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded">
            Login successful!
          </div>
        )}
        
        {data && (
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      {/* API Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">API Information:</h3>
        <p className="text-sm text-gray-600">
          <strong>Endpoint:</strong> {import.meta.env.VITE_MAIN_BASE_URL || 'http://mess-management-api.deshicreative.com/api'}/auth/login
        </p>
        <p className="text-sm text-gray-600">
          <strong>Method:</strong> POST
        </p>
        <p className="text-sm text-gray-600">
          <strong>Request Body:</strong> {'{email, password}'}
        </p>
      </div>
    </div>
  );
};

export default LoginExample; 