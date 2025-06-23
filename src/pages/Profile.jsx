import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Eye, EyeOff, CheckCircle, XCircle, Save, Key } from 'lucide-react';

const Profile = () => {
  const { currentUser, updateProfile, changePassword, logout } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      setPasswordStrength({
        length: value.length >= 6,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value)
      });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const result = await updateProfile(profileData);
    
    if (result.success) {
      setSuccess('Profile updated successfully!');
      setProfileData({
        name: result.user.name,
        email: result.user.email
      });
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const result = await changePassword(
      passwordData.currentPassword,
      passwordData.newPassword,
      passwordData.confirmNewPassword
    );
    
    if (result.success) {
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);
  const isPasswordFormValid = passwordData.currentPassword && 
                             passwordData.newPassword && 
                             passwordData.confirmNewPassword && 
                             isPasswordValid && 
                             passwordData.newPassword === passwordData.confirmNewPassword;

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <User className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
              <p className="text-gray-600">Manage your account settings</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <User className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <Key className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    required
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    required
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength */}
                {passwordData.newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-xs">
                      {passwordStrength.length ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={passwordStrength.length ? "text-green-600" : "text-red-600"}>
                        At least 6 characters
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.uppercase ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={passwordStrength.uppercase ? "text-green-600" : "text-red-600"}>
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.lowercase ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={passwordStrength.lowercase ? "text-green-600" : "text-red-600"}>
                        One lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.number ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={passwordStrength.number ? "text-green-600" : "text-red-600"}>
                        One number
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmNewPassword"
                    required
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                
                {passwordData.confirmNewPassword && (
                  <div className="mt-1 flex items-center text-xs">
                    {passwordData.newPassword === passwordData.confirmNewPassword ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        <span className="text-red-600">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !isPasswordFormValid}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Key className="h-4 w-4 mr-2" />
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">User ID</p>
              <p className="text-sm text-gray-900">{currentUser.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="text-sm text-gray-900 capitalize">{currentUser.role}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-sm text-gray-900">
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Login</p>
              <p className="text-sm text-gray-900">
                {currentUser.lastLogin 
                  ? new Date(currentUser.lastLogin).toLocaleString()
                  : 'Never'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-lg shadow p-6 border border-red-200">
          <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
          <p className="text-sm text-gray-600 mb-4">
            Once you log out, you'll need to sign in again to access your account.
          </p>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 