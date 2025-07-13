import { useMutation } from '@tanstack/react-query';
import { mainApi } from '../../lib/axios';
import { ENDPOINTS } from '../../constants';

/**
 * Custom hook for handling user login
 * @returns {Object} Login mutation object with methods and state
 */
export const useLogin = () => {
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await mainApi.post(ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Store the token in localStorage if it exists in the response
      if (data.token) {
        localStorage.setItem('sessionToken', data.token);
      }
      
      // Store user data if it exists in the response
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
      // You can add additional error handling here
      // For example, showing toast notifications
    },
  });

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoading: loginMutation.isPending,
    isError: loginMutation.isError,
    error: loginMutation.error,
    isSuccess: loginMutation.isSuccess,
    data: loginMutation.data,
    reset: loginMutation.reset,
  };
};

/**
 * Example usage:
 * 
 * const { login, isLoading, isError, error } = useLogin();
 * 
 * const handleLogin = () => {
 *   login({
 *     email: "zesan@gmail.com",
 *     password: "123456"
 *   });
 * };
 */
