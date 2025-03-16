# Google Authentication Setup Guide

This guide will help you set up Google Authentication for your application.

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make note of your project ID

## 2. Enable the Google OAuth API

1. In your Google Cloud project, go to "APIs & Services" → "Library"
2. Search for "Google OAuth API" and enable it

## 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type (unless you're using Google Workspace)
3. Fill in the required information:
   - App name
   - User support email
   - Developer contact information
4. Add the following scopes:
   - `./auth/userinfo.email`
   - `./auth/userinfo.profile`
5. Add any test users if you're still in testing mode

## 4. Create OAuth Client ID

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application" as the application type
4. Give your client ID a name
5. Add authorized JavaScript origins:
   - For development: `http://localhost:3000`, `http://localhost:3001`, `http://localhost:5173`
   - For production: Your production domain(s)
6. Add authorized redirect URIs:
   - For development: `http://localhost:3000/auth/google/callback`, `http://localhost:3001/auth/google/callback`, `http://localhost:5173/auth/google/callback`
   - For production: `https://your-domain.com/auth/google/callback`
7. Click "Create"
8. Make note of your Client ID

## 5. Configure Your Application

1. Create a `.env.local` file in the root of your project
2. Add your Google Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id-here
   ```
3. Update the `authorizedOrigins` array in `src/config/googleAuth.ts` if you're using additional origins

## 6. Testing Your Configuration

1. Start your development server
2. Open the browser console
3. Try to sign in with Google
4. If you see "unregistered_origin" errors, make sure your current origin is added to the authorized JavaScript origins in the Google Cloud Console

## Troubleshooting

### "The given origin is not allowed for the given client ID"

This error occurs when the domain you're using to access your application is not listed in the "Authorized JavaScript origins" in your Google Cloud Console project.

1. Check the browser console to see the current origin
2. Go to your Google Cloud Console project
3. Navigate to "APIs & Services" → "Credentials"
4. Edit your OAuth 2.0 Client ID
5. Add the origin to "Authorized JavaScript origins"
6. Click "Save"
7. Wait a few minutes for the changes to propagate
8. Try again

#### Quick Fix for Development

For a quick fix during development, you can run the helper script:

```
node update-google-origins.js
```

This will output all the origins you should add to your Google Cloud Console project.

### "State parameter mismatch"

This error occurs when the state parameter used for security doesn't match between the initial request and the callback.

1. Make sure you're not opening multiple Google Sign-In popups at the same time
2. Clear your browser's localStorage by running `localStorage.clear()` in the console
3. Try again

### "Popup was blocked"

This error occurs when your browser blocks the popup window for Google authentication.

1. Make sure popup blockers are disabled for your site
2. Try the alternative Google Sign-In method

### "Failed to load Google Sign-In script"

This error occurs when the Google Sign-In script cannot be loaded.

1. Check your internet connection
2. Make sure you're not blocking scripts from accounts.google.com
3. Try the alternative Google Sign-In method

## Common Issues and Solutions

### The app is running on a different port than expected

If your app is running on a port that's not in the authorized origins list (e.g., if port 3000 is already in use and Vite uses port 3001 instead), you'll need to:

1. Add the new origin to your Google Cloud Console project
2. Or use the fallback authentication method which is more tolerant of origin mismatches

### Changes to Google Cloud Console not taking effect

Changes to the authorized origins in Google Cloud Console can take a few minutes to propagate. If you've made changes but are still seeing errors:

1. Wait 5-10 minutes
2. Clear your browser cache
3. Try in a private/incognito window
4. Try a different browser

### Using the application on a mobile device or different computer

If you're testing on a mobile device or different computer, make sure:

1. The IP address or domain you're using is added to the authorized origins
2. You're using HTTPS for production environments (Google Sign-In requires HTTPS except for localhost) 