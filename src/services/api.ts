import LinksService from './links';
import AuthService from './auth';
import axiosInstance from './axiosConfig';
import { API_URL } from './axiosConfig';

console.log('Initializing API services with base URL:', API_URL);

// Create service instances
export const links = new LinksService(`${API_URL}/links`);
export const auth = new AuthService(`${API_URL}/auth`);

// Export a test function to check connectivity
export const testBackendConnection = async () => {
  try {
    const response = await axiosInstance.get('/health');
    console.log('Backend connection test result:', response.data);
    return response.data;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    throw error;
  }
};

export default axiosInstance; 