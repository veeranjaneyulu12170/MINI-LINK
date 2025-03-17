/**
 * Google Authentication Configuration
 * 
 * This file contains configuration settings for Google authentication.
 * Update these settings when moving between environments.
 */

// Get the client ID from environment variables
export const getGoogleClientId = (): string | null => {
  // Try Vite environment variables first
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const viteClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (viteClientId) return viteClientId;
  }
  
  // Fall back to Create React App environment variables
  if (typeof process !== 'undefined' && process.env) {
    const craClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (craClientId) return craClientId;
  }
  
  return null;
};

// List of authorized origins for Google Sign-In
// This is for documentation purposes - you still need to add these to Google Cloud Console
export const authorizedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',  // Default Vite dev server port
  'https://mini-link-frontend.onrender.com', // Add your production URL
  'https://mini-link-ddch.onrender.com',      // Add any other deployment URLs
  // Add your production domains here
  // 'https://your-production-domain.com',
];

// Check if the current origin is in the list of authorized origins
export const isAuthorizedOrigin = (): boolean => {
  const currentOrigin = window.location.origin;
  
  // Direct match
  if (authorizedOrigins.includes(currentOrigin)) {
    return true;
  }
  
  // Check if we're on localhost with a different port
  const localhostPattern = /^http:\/\/localhost:\d+$/;
  if (localhostPattern.test(currentOrigin)) {
    console.log('Running on localhost with a different port. This should be added to Google Cloud Console.');
    return true; // Consider localhost with any port as authorized in the app
  }
  
  return false;
};

// Get the redirect URI for Google OAuth
export const getRedirectUri = (): string => {
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    // For local development
    return `${window.location.origin}/auth/google/callback`;
  } else {
    // For production - use the backend URL
    // This should match what's configured in Google Cloud Console
    return 'https://mini-link-ddch.onrender.com/api/auth/google/callback';
  }
};

// Build the OAuth URL
export const buildOAuthUrl = (clientId: string, state: string): string => {
  const redirectUri = getRedirectUri();
  
  // Log the full redirect URI for debugging
  console.log('Full redirect URI:', redirectUri);
  
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile&state=${state}&prompt=select_account`;
};

// Generate a random state parameter for security
export const generateStateParameter = (): string => {
  return Math.random().toString(36).substring(2, 15);
}; 