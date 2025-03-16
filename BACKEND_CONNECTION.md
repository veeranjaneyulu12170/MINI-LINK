# Backend Connection Troubleshooting Guide

If you're experiencing issues with the Google Sign-In feature showing a "Network error" message, it's likely that your frontend application cannot connect to the backend server. This guide will help you diagnose and fix the issue.

## Common Error Messages

- **"Network error - Is the backend server running at http://localhost:5000/api?"**
- **"Cannot connect to the server. Please check your internet connection and try again."**
- **"Failed to load resource: net::ERR_CONNECTION_REFUSED"**

These errors indicate that your frontend application is unable to communicate with the backend server.

## Quick Fixes

### 1. Check if the Backend Server is Running

The backend server should be running on port 5000. You can check if it's running by:

- Looking for a terminal window where the backend server is running
- Running `node start-backend.js` in the project root directory to automatically check and start the server if needed
- Manually starting the backend server with:
  ```
  cd backend
  npm run dev
  ```

### 2. Test the Backend Connection

You can test the connection to the backend server directly from your browser:

1. Open your application in the browser
2. If you see a "Network error" message, click the "Test Backend Connection" button
3. Check the results to see if the backend server is accessible

### 3. Check for Port Conflicts

If the backend server is running but you still can't connect to it, there might be a port conflict:

- Check if another application is using port 5000
- Try changing the backend server port in `backend/src/index.ts`:
  ```typescript
  const PORT = process.env.PORT || 5001; // Change from 5000 to 5001
  ```
- Update the frontend API URL in `src/services/axiosConfig.ts`:
  ```typescript
  const API_URL = 'http://localhost:5001/api'; // Change from 5000 to 5001
  ```

### 4. Check for Firewall or Antivirus Issues

Sometimes firewalls or antivirus software can block connections between the frontend and backend:

- Temporarily disable your firewall or antivirus software to see if that resolves the issue
- Add exceptions for your development environment in your firewall settings

### 5. Check for CORS Issues

If the backend server is running but the frontend can't connect due to CORS issues:

- Check the browser console for CORS-related errors
- Ensure the backend server has proper CORS configuration in `backend/src/index.ts`
- Make sure the frontend origin (e.g., http://localhost:3001) is allowed in the CORS configuration

## Advanced Troubleshooting

### Check Network Traffic

You can use browser developer tools to inspect network traffic:

1. Open your browser's developer tools (F12 or right-click > Inspect)
2. Go to the Network tab
3. Try to sign in with Google
4. Look for requests to `http://localhost:5000/api/auth/google`
5. Check the status and response of these requests

### Check Server Logs

Check the backend server logs for any errors:

1. Look at the terminal where the backend server is running
2. Check for any error messages related to the Google authentication process
3. Look for any connection or CORS-related errors

### Test with a Different Browser

Sometimes browser extensions or settings can interfere with connections:

- Try using a different browser to see if the issue persists
- Try using an incognito/private browsing window

## Troubleshooting Google Authentication Errors

### 500 Internal Server Error

If you're getting a "500 Internal Server Error" when trying to authenticate with Google, it means the backend server is running but encountering an error when processing the Google token. This could be due to:

1. **Invalid or expired Google token**: The token provided by Google might be invalid or expired.
2. **Token format issues**: The backend might be expecting a different token format than what's being sent.
3. **Google API issues**: There might be issues connecting to Google's API to verify the token.

#### How to Fix:

1. **Try the alternative Google Sign-In method**: Click the "Try Alternative Google Sign-In" button that appears when there's an error. This uses a different authentication flow that might work better.

2. **Check the backend server logs**: Look at the terminal where the backend server is running for detailed error messages.

3. **Test the token verification process**: You can use the test script to verify if the Google token is valid:
   ```
   cd backend
   node test-google-token.js <your-token>
   ```

4. **Clear browser cache and cookies**: Sometimes, clearing your browser cache and cookies can resolve authentication issues.

5. **Check your Google Cloud Console configuration**: Make sure your Google Cloud project is properly configured:
   - The OAuth consent screen is set up correctly
   - The correct scopes are enabled (email, profile)
   - The OAuth client ID is configured with the right redirect URIs

### Other Google Authentication Errors

- **"Invalid Google token"**: This means the token couldn't be verified with Google's API. Try the alternative method.
- **"Google token verification failed"**: Similar to above, the token couldn't be verified. Try the alternative method.
- **"Failed to create user account"**: There was an issue creating a new user in the database. Check the backend logs for details.

## Need More Help?

If you're still experiencing issues after trying these solutions, please:

1. Collect the following information:
   - Frontend console logs (from browser developer tools)
   - Backend server logs
   - Network request/response details for the Google authentication request
   - Your operating system and browser version

2. Contact the development team with this information for further assistance. 