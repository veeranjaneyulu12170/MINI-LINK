import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const links = {
  create: (linkData: {
    title: string;
    url: string;
    backgroundColor?: string;
    textColor?: string;
  }) => api.post('/links', linkData),
  
  getAll: () => api.get('/links'),
  delete: (id: string) => api.delete(`/links/${id}`),
  incrementClicks: (id: string) => api.post(`/links/${id}/clicks`),
  reorder: (linkIds: string[]) => api.post('/links/reorder', { linkIds })
};

export default api; 