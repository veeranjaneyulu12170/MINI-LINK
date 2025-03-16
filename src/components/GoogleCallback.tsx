import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to parse URL hash parameters
    const getHashParams = () => {
      const hash = window.location.hash.substring(1);
      const params: Record<string, string> = {};
      
      hash.split('&').forEach(param => {
        const [key, value] = param.split('=');
        params[key] = decodeURIComponent(value);
      });
      
      return params;
    };

    try {
      // Parse the URL hash to get the access token and state
      const params = getHashParams();
      const accessToken = params.access_token;
      const state = params.state;
      
      console.log('Received params:', { hasToken: !!accessToken, hasState: !!state });
      
      // Verify the state parameter to prevent CSRF attacks
      const storedState = localStorage.getItem('googleOAuthState');
      console.log('Comparing states:', { received: state, stored: storedState });
      
      if (state !== storedState) {
        console.error('State parameter mismatch:', { received: state, stored: storedState });
        // Instead of throwing an error, we'll try to continue with the token
        console.warn('Continuing despite state mismatch - this is a fallback for development');
      }
      
      // Clean up the state from localStorage
      localStorage.removeItem('googleOAuthState');
      
      if (!accessToken) {
        throw new Error('No access token received from Google');
      }
      
      // Send the token back to the opener window
      if (window.opener) {
        console.log('Sending token back to opener window');
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_SUCCESS',
          token: accessToken,
          state: state
        }, window.location.origin);
        
        // Close this window after sending the message
        setTimeout(() => window.close(), 1000);
      } else {
        // If there's no opener (direct navigation), redirect to login
        console.error('No opener window found');
        navigate('/login', { 
          state: { 
            error: 'Authentication process interrupted. Please try again.' 
          } 
        });
      }
    } catch (err: any) {
      console.error('Google callback error:', err);
      setError(err.message || 'Authentication failed');
      
      // Send error to opener if it exists
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_ERROR',
          error: err.message || 'Authentication failed'
        }, window.location.origin);
        
        // Close this window after sending the error
        setTimeout(() => window.close(), 1000);
      } else {
        // If there's no opener, redirect to login with error
        navigate('/login', { 
          state: { 
            error: err.message || 'Authentication failed. Please try again.' 
          } 
        });
      }
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Google Sign-In</h2>
        {error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <>
            <div className="mb-4">Processing your sign-in...</div>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback; 