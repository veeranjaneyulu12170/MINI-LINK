import axiosInstance from './axiosConfig';
import { User, LoginResponse, RegisterResponse, GoogleAuthResponse } from '../types';
import axios from 'axios';
export default class AuthService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async login(email: string, password: string): Promise<{ data: LoginResponse }> {
    try {
      const response = await axiosInstance.post<LoginResponse>(`${this.baseUrl}/login`, { email, password });
      console.log("Auth service login response:", response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(name: string, email: string, password: string): Promise<{ data: RegisterResponse }> {
    try {
      const response = await axiosInstance.post<RegisterResponse>(`${this.baseUrl}/register`, { name, email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async googleAuth(token: string): Promise<{ data: GoogleAuthResponse }> {
    try {
      console.log('Sending Google token to backend:', token.substring(0, 20) + '...');
      console.log('Backend URL:', `${this.baseUrl}/google`);
      
      // Add a timeout to the request
      const response = await axiosInstance.post<GoogleAuthResponse>(
        `${this.baseUrl}/google`, 
        { token },
        { 
          timeout: 15000,  // Increase timeout to 15 seconds
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Google auth response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error: any) {
      console.error('Google auth error:', error);
      
      // Log more detailed error information
      if (error.response?.data) {
        console.error('Server error response:', error.response.data);
        
        // Check for detailed error information
        if (error.response.data.details) {
          console.error('Error details:', error.response.data.details);
        }
      }
      
      // Check for specific error types
      if (error.code === 'ERR_NETWORK') {
        console.error('Network error details:', {
          message: error.message,
          code: error.code,
          baseURL: this.baseUrl,
          endpoint: `${this.baseUrl}/google`
        });
        
        // Try a direct fetch as a fallback
        try {
          console.log('Attempting fallback with fetch API...');
          const fetchResponse = await fetch(`${this.baseUrl}/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
          });
          
          if (fetchResponse.ok) {
            const data = await fetchResponse.json();
            console.log('Fetch fallback successful:', data);
            
            if (data.token) {
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            return { data };
          } else {
            const errorText = await fetchResponse.text();
            console.error('Fetch fallback failed:', fetchResponse.status, errorText);
            
            try {
              // Try to parse the error response as JSON
              const errorJson = JSON.parse(errorText);
              console.error('Parsed error response:', errorJson);
              
              if (errorJson.error) {
                throw new Error(errorJson.error);
              }
            } catch (parseError) {
              // If parsing fails, just use the text
            }
          }
        } catch (fetchError) {
          console.error('Fetch fallback error:', fetchError);
        }
        
        throw new Error('Network error: Cannot connect to the server. Please check your internet connection and try again. If the problem persists, the backend server might not be running.');
      } else if (error.response?.status === 401) {
        // Handle authentication errors
        const errorMessage = error.response.data.error || 'Authentication failed: Invalid Google token.';
        throw new Error(errorMessage);
      } else if (error.response?.status === 400) {
        // Handle validation errors
        const errorMessage = error.response.data.error || 'Invalid Google authentication request.';
        throw new Error(errorMessage);
      } else if (error.response?.status === 500) {
        // Handle server errors
        let errorMessage = 'Server error during Google authentication.';
        
        if (error.response.data.error) {
          errorMessage = `Server error: ${error.response.data.error}`;
          
          if (error.response.data.details) {
            // Add details if available
            console.error('Error details:', error.response.data.details);
            
            // If the error is related to token verification, suggest using the fallback method
            if (errorMessage.includes('token verification')) {
              errorMessage += '. Please try the alternative Google Sign-In method.';
            }
          }
        }
        
        throw new Error(errorMessage);
      }
      
      throw error;
    }
  }

  getGoogleAuthUrl(): string {
    return `${this.baseUrl}/google`;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
} 