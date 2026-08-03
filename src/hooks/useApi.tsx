
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5000';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(endpoint: string, immediate: boolean = true) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: immediate,
    error: null
  });

  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setState({ data: result.data || result, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      console.error('API Error:', error);
    }
  };

  const postData = async (data: any, method: 'POST' | 'PUT' | 'DELETE' = 'POST') => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setState({ data: result.data || result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [endpoint, immediate]);

  return {
    ...state,
    refetch: fetchData,
    postData
  };
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      if (result.token) {
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('user_data', JSON.stringify(result.user));
        setUser(result.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return result;
      }
    } catch (error) {
      toast.error('Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      window.location.href = '/auth';
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        
        if (response.ok) {
          const result = await response.json();
          setUser(result.data);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };
}
