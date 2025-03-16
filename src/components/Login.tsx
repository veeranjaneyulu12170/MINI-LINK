import React, { useState, useEffect } from 'react';
import { LinkIcon } from 'lucide-react';
import { auth } from '../services/api';
import { User } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { testEnvironmentVariables } from '../utils/envTest';
import { runAllTests } from '../utils/backendTest';
import { 
  getGoogleClientId, 
  isAuthorizedOrigin, 
  buildOAuthUrl, 
  generateStateParameter,
  getRedirectUri,
  authorizedOrigins
} from '../config/googleAuth';
import Logo from './Logo';

interface LoginProps {
  setUser: (user: User) => void;
  setActiveTab?: (tab: string) => void;
}

const Login: React.FC<LoginProps> = ({ setUser, setActiveTab }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for error in location state (from redirects)
  useEffect(() => {
    const locationState = location.state as { error?: string } | null;
    if (locationState?.error) {
      setError(locationState.error);
      // Clear the error from location state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  
  // Run the environment variables test on component mount
  useEffect(() => {
    testEnvironmentVariables();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      if (isLogin) {
        // Handle Login
        const response = await auth.login(email, password);
        if (response.data.user && response.data.token) {
          console.log("Login successful, user data:", response.data.user);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setUser(response.data.user);
          navigate('/app', { replace: true });
        }
      } else {
        // Handle Register
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
          setError("All fields are required");
          setLoading(false);
          return;
        }
        
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        
        if (!agreeToTerms) {
          setError("You must agree to the Terms of Use and Privacy Policy");
          setLoading(false);
          return;
        }
        
        const fullName = `${firstName} ${lastName}`;
        const response = await auth.register(fullName, email, password);
        if (response.data.user && response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setUser(response.data.user);
          // Redirect to profile setup page instead of app
          navigate('/profile-setup', { replace: true });
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || (isLogin ? "Invalid email or password" : "Registration failed"));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Get the client ID from environment variables
      const clientId = getGoogleClientId();
      
      // Log the client ID for debugging
      console.log("Using Google Client ID:", clientId ? "ID is set" : "ID is missing");
      
      if (!clientId || clientId === 'undefined' || clientId === 'your-google-client-id') {
        setError("Google Sign-In is not properly configured. Please contact the administrator.");
        console.error("Invalid Google Client ID. Please set a valid VITE_GOOGLE_CLIENT_ID in .env.local file");
        setLoading(false);
        return;
      }
      
      // Use the fallback method directly as it's more reliable
      handleGoogleLoginFallback();
      
      // The code below is kept for reference but not used
      /*
      // Check if the current origin is in the list of authorized origins
      if (!isAuthorizedOrigin()) {
        const currentOrigin = window.location.origin;
        console.warn(`Current origin (${currentOrigin}) is not in the list of authorized origins in the application.`);
        console.warn('Authorized origins in the application:', authorizedOrigins);
        console.warn('This is just a warning. The request will still be sent, but it may fail if the origin is not authorized in Google Cloud Console.');
      }
      
      // Create a container for the Google button
      const googleButtonContainer = document.createElement('div');
      googleButtonContainer.id = 'google-signin-button';
      googleButtonContainer.style.display = 'none';
      document.body.appendChild(googleButtonContainer);
      
      // Load the Google Sign-In API
      if (!window.google) {
        // If Google API is not loaded, load it
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initializeGoogleSignIn(clientId, googleButtonContainer.id);
        };
        script.onerror = (e) => {
          console.error('Failed to load Google Sign-In script:', e);
          setError("Failed to load Google Sign-In. Please try again later or use email/password.");
          setLoading(false);
          if (googleButtonContainer) {
            document.body.removeChild(googleButtonContainer);
          }
          
          // Automatically try the fallback method after a short delay
          setTimeout(() => {
            handleGoogleLoginFallback();
          }, 1000);
        };
        document.head.appendChild(script);
      } else {
        // If Google API is already loaded, initialize Sign-In
        initializeGoogleSignIn(clientId, googleButtonContainer.id);
      }
      */
    } catch (err) {
      console.error('Google auth error:', err);
      setError("Google login failed. Please try again or use email/password.");
      setLoading(false);
    }
  };
  
  // Initialize Google Sign-In
  const initializeGoogleSignIn = (clientId: string, containerId: string) => {
    try {
      // Log the current origin to help with debugging
      const currentOrigin = window.location.origin;
      console.log('Current origin:', currentOrigin);
      console.log('Make sure this origin is added to the authorized JavaScript origins in Google Cloud Console');
      
      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      
      // Render the button (this helps with some browser issues)
      window.google.accounts.id.renderButton(
        document.getElementById(containerId)!,
        { theme: 'outline', size: 'large', width: 250 }
      );
      
      // Prompt the user to select a Google account
      window.google.accounts.id.prompt((notification: any) => {
        console.log("Google Sign-In notification:", notification);
        if (notification.isNotDisplayed()) {
          console.error('Google Sign-In prompt not displayed:', notification.getNotDisplayedReason());
          
          // Provide more specific error message based on the reason
          let errorMessage = "Google login failed: Sign-In prompt could not be displayed.";
          const reason = notification.getNotDisplayedReason();
          
          if (reason === 'unregistered_origin') {
            const currentOrigin = window.location.origin;
            errorMessage = `The current origin (${currentOrigin}) is not registered for this Google Client ID. Please add it to the authorized JavaScript origins in the Google Cloud Console.`;
            console.error('CONFIGURATION ERROR: You need to add the following origin to your Google Cloud Console project:');
            console.error(`- ${currentOrigin}`);
            console.error('Steps to fix:');
            console.error('1. Go to https://console.cloud.google.com/');
            console.error('2. Select your project');
            console.error('3. Go to "APIs & Services" → "Credentials"');
            console.error('4. Edit your OAuth 2.0 Client ID');
            console.error('5. Add the origin above to "Authorized JavaScript origins"');
            console.error('6. Click "Save"');
            
            // Show the fallback method automatically for this specific error
            setError("Google login failed: Origin not registered. Try the alternative method below.");
            setLoading(false);
            
            // Clean up the container
            const container = document.getElementById(containerId);
            if (container) {
              document.body.removeChild(container);
            }
            
            // Automatically try the fallback method after a short delay
            setTimeout(() => {
              handleGoogleLoginFallback();
            }, 1000);
            
            return;
          } else if (reason === 'browser_not_supported') {
            errorMessage += " Your browser is not supported.";
          } else if (reason === 'invalid_client') {
            errorMessage += " Invalid client configuration.";
          } else if (reason === 'missing_client_id') {
            errorMessage += " Client ID is missing.";
          } else if (reason === 'third_party_cookies_blocked') {
            errorMessage += " Third-party cookies are blocked in your browser. Please enable them or try a different browser.";
          } else if (reason === 'cookie_policy_unmet') {
            errorMessage += " Cookie policy requirements are not met.";
          } else if (reason === 'secure_http_required') {
            errorMessage += " Secure HTTP is required.";
          } else {
            errorMessage += " Please check your ad blocker or try a different browser.";
          }
          
          setError(errorMessage);
          setLoading(false);
          
          // Clean up the container
          const container = document.getElementById(containerId);
          if (container) {
            document.body.removeChild(container);
          }
        } else if (notification.isSkippedMoment()) {
          console.log('Google Sign-In prompt skipped:', notification.getSkippedReason());
          setLoading(false);
          
          // Clean up the container
          const container = document.getElementById(containerId);
          if (container) {
            document.body.removeChild(container);
          }
        } else if (notification.isDismissedMoment()) {
          console.log('Google Sign-In prompt dismissed:', notification.getDismissedReason());
          setLoading(false);
          
          // Clean up the container
          const container = document.getElementById(containerId);
          if (container) {
            document.body.removeChild(container);
          }
        }
      });
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      setError("Failed to initialize Google Sign-In. Please try again later.");
      setLoading(false);
      
      // Clean up the container
      const container = document.getElementById(containerId);
      if (container) {
        document.body.removeChild(container);
      }
    }
  };
  
  // Handle the response from Google Sign-In
  const handleGoogleCredentialResponse = async (response: any) => {
    try {
      // Get the ID token from the response
      const idToken = response.credential;
      
      // Send the token to your backend
      const authResponse = await auth.googleAuth(idToken);
      
      if (authResponse.data.user && authResponse.data.token) {
        // Store user data and token
        localStorage.setItem("token", authResponse.data.token);
        localStorage.setItem("user", JSON.stringify(authResponse.data.user));
        
        // Update user state and navigate to app
        setUser(authResponse.data.user);

        // Check if the user is new (no username set) and redirect to profile setup
        if (!authResponse.data.user.username) {
          navigate('/profile-setup', { replace: true });
        } else {
          // User already has a profile, navigate to app
          navigate('/app', { replace: true });
        }
      }
    } catch (err: any) {
      console.error('Google auth error:', err);
      
      // Display a more user-friendly error message
      if (err.message && err.message.includes('500')) {
        setError("Server error during Google authentication. Please try again later.");
      } else {
        setError(err.message || "Google authentication failed");
      }
      
      setLoading(false);
    }
  };
  
  // Fallback method for Google Sign-In
  const handleGoogleLoginFallback = () => {
    setError('');
    setLoading(true);
    
    console.log('Starting Google login fallback flow');
    
    // Generate a random state parameter for security
    const state = generateStateParameter();
    localStorage.setItem('googleOAuthState', state);
    console.log('Generated state parameter:', state);
    
    // Get the client ID from environment variables
    const clientId = getGoogleClientId();
    console.log('Using Google Client ID:', clientId ? 'ID is set' : 'ID is missing');
    
    if (!clientId || clientId === 'undefined' || clientId === 'your-google-client-id') {
      setError('Google Sign-In is not properly configured. Please contact the administrator.');
      console.error("Invalid Google Client ID. Please set a valid VITE_GOOGLE_CLIENT_ID in .env.local file");
      setLoading(false);
      return;
    }
    
    // Define the redirect URI - this should match what's configured in Google Console
    const redirectUri = getRedirectUri();
    console.log('Redirect URI:', redirectUri);
    
    // Check if the current origin is in the list of authorized origins
    if (!isAuthorizedOrigin()) {
      const currentOrigin = window.location.origin;
      console.warn(`Current origin (${currentOrigin}) is not in the list of authorized origins in the application.`);
      console.warn('Authorized origins in the application:', authorizedOrigins);
      console.warn('This is just a warning. The request will still be sent, but it may fail if the origin is not authorized in Google Cloud Console.');
    }
    
    // Define the OAuth URL
    const oauthUrl = buildOAuthUrl(clientId, state);
    console.log('OAuth URL (partial):', oauthUrl.substring(0, 100) + '...');
    
    // Open the popup
    const popup = window.open(
      oauthUrl,
      'googleOAuth',
      'width=500,height=600,left=0,top=0'
    );
    
    console.log('Popup opened:', popup ? 'Success' : 'Failed');
    
    if (!popup) {
      setError('Popup was blocked. Please allow popups for this site and try again.');
      setLoading(false);
      return;
    }
    
    // Set up message listener for the popup response
    const messageListener = (event: MessageEvent) => {
      console.log('Received message from popup:', event.origin, event.data);
      
      // Verify origin for security
      if (event.origin !== window.location.origin) {
        console.log('Origin mismatch, ignoring message');
        return;
      }
      
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        console.log('Received successful auth message');
        window.removeEventListener('message', messageListener);
        
        // Verify state parameter
        const storedState = localStorage.getItem('googleOAuthState');
        if (event.data.state !== storedState) {
          console.error('State parameter mismatch:', { received: event.data.state, stored: storedState });
          console.warn('Continuing despite state mismatch - this is a fallback for development');
          // We'll continue anyway as a fallback
        }
        
        // Process the token
        const token = event.data.token;
        console.log('Received token from popup:', token ? 'Token received' : 'No token');
        
        if (!token) {
          setError('Failed to get authentication token from Google');
          setLoading(false);
          return;
        }
        
        // Send the token to our backend
        console.log('Sending token to backend');
        auth.googleAuth(token)
          .then(response => {
            console.log('Google auth successful:', response.data);
            setUser(response.data.user);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            
            // Check if the user is new (no username set) and redirect to profile setup
            if (!response.data.user.username) {
              navigate('/profile-setup');
            } else {
              // User already has a profile, navigate to app
              navigate('/app');
            }
          })
          .catch(err => {
            console.error('Google auth error:', err);
            setError(err.message || 'Google authentication failed. Please try again.');
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        console.log('Received error auth message');
        window.removeEventListener('message', messageListener);
        setError(event.data.error || 'Google authentication failed. Please try again.');
        setLoading(false);
      }
    };
    
    window.addEventListener('message', messageListener);
    console.log('Message listener added');
    
    // Set a timeout to close the popup if it's taking too long
    setTimeout(() => {
      if (popup && !popup.closed) {
        console.log('Closing popup due to timeout');
        popup.close();
        setError('Authentication timed out. Please try again.');
        setLoading(false);
        window.removeEventListener('message', messageListener);
      }
    }, 60000); // 1 minute timeout
  };
  
  // Test backend connection
  const testBackendConnection = async () => {
    setError("Testing backend connection...");
    setLoading(true);
    
    try {
      const results = await runAllTests();
      
      if (results.health.success && results.googleAuth.success) {
        setError("Backend connection successful! Try Google Sign-In again.");
      } else {
        let errorMessage = "Backend connection issues detected:\n";
        
        if (!results.health.success) {
          errorMessage += `- Health endpoint: ${results.health.message}\n`;
        }
        
        if (!results.googleAuth.success) {
          errorMessage += `- Google auth endpoint: ${results.googleAuth.message}\n`;
        }
        
        errorMessage += "\nPlease make sure the backend server is running at http://localhost:5000";
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Backend test error:', err);
      setError("Failed to test backend connection. See console for details.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <div className="w-full max-w-md">
          {/* MiniLink Logo */}
          <div className="mb-8">
            <Logo size="large" />
            <p className="text-indigo-600 mt-1 text-sm">Simplify your links, track your clicks</p>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-6">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h1>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex justify-center items-center bg-white border border-gray-300 rounded-2xl shadow-sm px-4 py-2 mb-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.25 1.38-1.02 2.55-2.17 3.34v2.77h3.5c2.05-1.89 3.24-4.67 3.24-8.12z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.5-2.77c-.98.66-2.23 1.06-3.78 1.06-2.9 0-5.35-1.97-6.22-4.62H2.18v2.86C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.78 14.01c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.75-.7z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.12-3.13C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.6 2.8c.87-2.6 3.32-4.49 6.22-4.49z"
              />
            </svg>
            Continue with Google
          </button>
          
          {/* Backend connection test button (shown if there's a network error) */}
          {error && error.includes("Network error") && (
            <div className="mt-2 mb-4">
              <p className="text-sm text-gray-600 mb-2">Having trouble connecting to the backend server? Test the connection:</p>
              <button
                type="button"
                onClick={testBackendConnection}
                disabled={loading}
                className="w-full flex justify-center items-center bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Test Backend Connection
              </button>
            </div>
          )}

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-4 text-sm text-gray-500">or</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Login/Signup Form */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </>
            )}
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-xl"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
                {isLogin && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => {/* Toggle password visibility */}}
                  >
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>
            )}
            
            {!isLogin && (
              <div className="mb-4 flex items-start">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="agreeTerms" className="ml-2 text-sm">
                  By creating an account, I agree to the <a href="#" className="text-indigo-600 underline">Terms of use</a> and <a href="#" className="text-indigo-600 underline">Privacy Policy</a>
                </label>
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition-colors mb-4"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create an account')}
            </button>
            
            {isLogin && (
              <div className="text-center mb-4">
                <a href="#" className="text-indigo-600 hover:text-indigo-700">
                  Forgot password?
                </a>
              </div>
            )}
            
            <div className="text-center">
              {isLogin ? (
                <p>
                  Don't have an account? <a href="#" className="text-indigo-600 hover:text-indigo-700" onClick={(e) => { e.preventDefault(); setIsLogin(false); }}>Sign up</a>
                </p>
              ) : (
                <p>
                  Already have an account? <a href="#" className="text-indigo-600 hover:text-indigo-700" onClick={(e) => { e.preventDefault(); setIsLogin(true); }}>Sign in</a>
                </p>
              )}
            </div>
          </form>
          
          {/* Footer */}
          <div className="mt-8 text-xs text-gray-500">
            This site is protected by reCAPTCHA and the <a href="#" className="underline">Google Privacy Policy</a> and <a href="#" className="underline">Terms of Service</a> apply.
          </div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-yellow-500">
          <div className="absolute inset-0 left-1/4 bg-green-800 z-10"></div>
          <div className="absolute inset-0 z-20">
            <img 
              src="src\public\images\Frame.png" 
              alt="Person with thoughtful expression" 
              className="object-cover object-center w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;