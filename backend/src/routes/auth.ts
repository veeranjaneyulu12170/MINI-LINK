import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Registration attempt:', { email, name }); // Log registration data

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new UserModel({
      name,
      email,
      password // Will be hashed by pre-save hook
    });

    await user.save();
    console.log('User saved successfully:', {
      id: user._id,
      email: user.email,
      name: user.name
    });

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Send response
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google Authentication
router.get('/google', (req, res) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `https://mini-link-ddch.onrender.com/api/auth/google/callback`;
  
  console.log('Initiating Google OAuth flow');
  console.log('Redirect URI:', redirectUri);
  
  const oauth2Client = new OAuth2Client(
    googleClientId,
    googleClientSecret,
    redirectUri
  );

  // Generate the url that will be used for the consent dialog
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    prompt: 'consent'
  });

  console.log('Redirecting to Google consent screen');
  res.redirect(authorizeUrl);
});

// Update your callback route to properly handle the OAuth response
router.get('/google/callback', async (req, res) => {
  try {
    console.log('Received callback from Google');
    const code = req.query.code as string;
    
    if (!code) {
      console.error('No code received from Google');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }
    
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.API_URL}/api/auth/google/callback`;
    
    const oauth2Client = new OAuth2Client(
      googleClientId,
      googleClientSecret,
      redirectUri
    );
    
    // Exchange the code for tokens
    console.log('Exchanging code for tokens');
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Get user info using the access token
    console.log('Getting user info from Google');
    const userInfoResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`
        }
      }
    );
    
    const userInfo = userInfoResponse.data;
    console.log('User info received:', { 
      email: userInfo.email,
      name: userInfo.name
    });
    
    // Check if user exists
    let user = await UserModel.findOne({ email: userInfo.email });
    
    if (!user) {
      console.log('Creating new user');
      // Create new user
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      
      user = new UserModel({
        name: userInfo.name || userInfo.email.split('@')[0],
        email: userInfo.email,
        googleId: userInfo.id,
        password: hashedPassword
      });
      
      await user.save();
      console.log('New user created');
    } else {
      console.log('User already exists');
      // Update googleId if not already set
      if (!user.googleId) {
        user.googleId = userInfo.id;
        await user.save();
        console.log('Updated user with Google ID');
      }
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Redirect to frontend with token
    console.log('Authentication successful, redirecting to frontend');
    res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${token}&userId=${user._id}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
    
  } catch (error) {
    console.error('Error in Google callback:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
  }
});

// Add this temporary route to clear users (DELETE AFTER TESTING)
router.delete('/clear-users', async (req, res) => {
  try {
    await UserModel.deleteMany({});
    console.log('All users deleted');
    res.json({ message: 'All users deleted' });
  } catch (err) {
    console.error('Error clearing users:', err);
    res.status(500).json({ error: 'Failed to clear users' });
  }
});

// Add a health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Add this route to test login functionality
router.get('/login-test', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Login endpoint is accessible',
    env: process.env.NODE_ENV,
    routes: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      google: '/api/auth/google'
    }
  });
});

// Add this test route
router.get('/google/callback-test', (req, res) => {
  res.status(200).json({ 
    message: 'Google callback endpoint is accessible',
    query: req.query
  });
});

// Add this route to handle Google token verification
router.post('/google-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ error: 'Invalid token' });
    }
    
    const { email, name, sub: googleId } = payload;
    
    // Check if email exists
    if (!email) {
      return res.status(400).json({ error: 'Email not provided in Google token' });
    }
    
    // Check if user exists
    let user = await UserModel.findOne({ email });
    
    if (!user) {
      // Create new user
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      
      user = new UserModel({
        name: name || email.split('@')[0], // Now safe because we checked email exists
        email,
        googleId,
        password: hashedPassword
      });
      
      await user.save();
    } else {
      // Update googleId if not already set
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }
    
    // Create JWT token
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Send response
    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Google token verification error:', error);
    res.status(500).json({ error: 'Failed to verify Google token' });
  }
});

export default router; 
