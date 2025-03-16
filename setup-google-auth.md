# Setting Up Google Authentication for MiniLink

This guide will walk you through the process of setting up Google authentication for your MiniLink application.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a name for your project (e.g., "MiniLink")
5. Click "Create"

## Step 2: Enable the Google Sign-In API

1. Select your project in the Google Cloud Console
2. In the sidebar, navigate to "APIs & Services" > "Library"
3. Search for "Google Identity Services" or "Google Sign-In API"
4. Click on the API and then click "Enable"

## Step 3: Configure the OAuth Consent Screen

1. In the sidebar, navigate to "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type (unless you have a Google Workspace organization)
3. Click "Create"
4. Fill in the required information:
   - App name: "MiniLink"
   - User support email: Your email address
   - Developer contact information: Your email address
5. Click "Save and Continue"
6. Under "Scopes", add the following scopes:
   - `email`
   - `profile`
   - `openid`
7. Click "Save and Continue"
8. Add test users if you're in testing mode
9. Click "Save and Continue"
10. Review your settings and click "Back to Dashboard"

## Step 4: Create OAuth 2.0 Credentials

1. In the sidebar, navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Name: "MiniLink Web Client"
5. Add Authorized JavaScript origins:
   - For development: `http://localhost:5173` (or your Vite dev server URL)
   - For production: Add your production domain
6. Add Authorized redirect URIs:
   - For development: 
     - `http://localhost:5173`
     - `http://localhost:5173/login`
     - `http://localhost:5173/app`
   - For production: Add your production URIs
7. Click "Create"
8. You'll see a modal with your Client ID and Client Secret
9. Copy the Client ID

## Step 5: Update Your Environment Variables

1. Open the `.env.local` file in your project root
2. Update the `VITE_GOOGLE_CLIENT_ID` variable with your actual Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```
3. Save the file

## Step 6: Test Google Sign-In

1. Start your development server
2. Navigate to the login page
3. Click "Continue with Google"
4. You should see the Google Sign-In popup
5. Select your Google account
6. You should be redirected to the app after successful authentication

## Troubleshooting

If you encounter issues:

1. **"The given client ID is not found"**:
   - Make sure you've correctly copied your Client ID to `.env.local`
   - Ensure the environment variable is being loaded correctly
   - Check that you've added the correct JavaScript origins in the Google Cloud Console

2. **"Popup blocked"**:
   - Make sure your browser allows popups for your development URL
   - Try clicking the Google Sign-In button again

3. **"Error 400: redirect_uri_mismatch"**:
   - Make sure you've added all necessary redirect URIs in the Google Cloud Console
   - Check that your application's URL exactly matches what you've configured

4. **Backend verification fails**:
   - Make sure your backend is correctly verifying the Google token
   - Check the network tab in your browser's developer tools for detailed error messages

## Additional Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web/guides/overview)
- [Google OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google Sign-In for Websites](https://developers.google.com/identity/sign-in/web/sign-in) 