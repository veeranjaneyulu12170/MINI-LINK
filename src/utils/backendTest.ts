/**
 * Backend Connection Test Utility
 * 
 * This utility provides functions to test the connection to the backend server.
 * It can be used to diagnose network issues between the frontend and backend.
 */

// The API URL should match what's used in axiosConfig.ts
const API_URL = 'http://localhost:5000/api';

/**
 * Test the connection to the backend server using the fetch API
 * @returns Promise that resolves with the test result
 */
export const testBackendConnection = async (): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}> => {
  try {
    console.log('Testing backend connection to:', `${API_URL}/health`);
    
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Backend connection test successful:', data);
      return {
        success: true,
        message: 'Successfully connected to the backend server',
        data
      };
    } else {
      console.error('Backend connection test failed with status:', response.status);
      return {
        success: false,
        message: `Failed to connect to the backend server. Status: ${response.status}`,
        error: await response.text()
      };
    }
  } catch (error: any) {
    console.error('Backend connection test error:', error);
    
    // Check for specific error types
    let errorMessage = 'Failed to connect to the backend server due to a network error';
    
    if (error.name === 'AbortError') {
      errorMessage = 'Connection to the backend server timed out after 5 seconds';
    } else if (error.message && error.message.includes('Failed to fetch')) {
      errorMessage = 'Failed to fetch from the backend server. The server might not be running or accessible.';
    }
    
    return {
      success: false,
      message: errorMessage,
      error
    };
  }
};

/**
 * Test the Google authentication endpoint
 * @returns Promise that resolves with the test result
 */
export const testGoogleAuthEndpoint = async (): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}> => {
  try {
    console.log('Testing Google auth endpoint:', `${API_URL}/auth/google`);
    
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Send a test token (this will fail authentication but should connect to the server)
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: 'test_token' }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Even a 400 or 401 response means the server is accessible
    if (response.status !== 404 && response.status !== 500) {
      const data = await response.text();
      console.log('Google auth endpoint test successful (server is accessible):', response.status, data);
      return {
        success: true,
        message: `Successfully connected to the Google auth endpoint. Status: ${response.status}`,
        data
      };
    } else {
      console.error('Google auth endpoint test failed with status:', response.status);
      return {
        success: false,
        message: `Failed to connect to the Google auth endpoint. Status: ${response.status}`,
        error: await response.text()
      };
    }
  } catch (error: any) {
    console.error('Google auth endpoint test error:', error);
    
    // Check for specific error types
    let errorMessage = 'Failed to connect to the Google auth endpoint due to a network error';
    
    if (error.name === 'AbortError') {
      errorMessage = 'Connection to the Google auth endpoint timed out after 5 seconds';
    } else if (error.message && error.message.includes('Failed to fetch')) {
      errorMessage = 'Failed to fetch from the Google auth endpoint. The server might not be running or accessible.';
    }
    
    return {
      success: false,
      message: errorMessage,
      error
    };
  }
};

/**
 * Run all backend connection tests
 * @returns Promise that resolves with all test results
 */
export const runAllTests = async (): Promise<{
  health: {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
  };
  googleAuth: {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
  };
}> => {
  const healthTest = await testBackendConnection();
  const googleAuthTest = await testGoogleAuthEndpoint();
  
  return {
    health: healthTest,
    googleAuth: googleAuthTest
  };
};

export default {
  testBackendConnection,
  testGoogleAuthEndpoint,
  runAllTests
}; 