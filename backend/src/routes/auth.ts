import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import axios from 'axios';

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
router.post('/google', async (req, res) => {
  try {
    console.log('Received Google auth request');
    const { token } = req.body;
    
    if (!token) {
      console.log('No token provided in request');
      return res.status(400).json({ error: 'Google token is required' });
    }

    console.log('Token received, length:', token.length);
    console.log('Token type:', typeof token);
    
    try {
      // Determine token type and use appropriate endpoint
      let googleResponse;
      let userInfo;
      
      // Check if it's an ID token (JWT format)
      if (token.split('.').length === 3) {
        console.log('Token appears to be an ID token, verifying with tokeninfo endpoint');
        // Verify the Google ID token
        googleResponse = await axios.get(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
        );
        userInfo = googleResponse.data;
      } else {
        console.log('Token appears to be an access token, fetching user info');
        // Use the access token to get user info
        googleResponse = await axios.get(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        userInfo = googleResponse.data;
      }
      
      console.log('Google API response status:', googleResponse.status);
      
      if (!userInfo) {
        console.log('No user info in Google API response');
        return res.status(401).json({ error: 'Invalid Google token - no user info returned' });
      }
      
      if (!userInfo.email) {
        console.log('No email in Google API response:', userInfo);
        return res.status(401).json({ error: 'Invalid Google token - no email returned' });
      }
      
      console.log('Google token verified successfully');
      // Extract user info (field names might differ between endpoints)
      const email = userInfo.email;
      const name = userInfo.name || userInfo.given_name;
      const googleId = userInfo.sub || userInfo.id;
      
      console.log('User info from Google:', { email, name, googleId: googleId?.substring(0, 10) + '...' });

      // Check if user exists
      console.log('Checking if user exists in database');
      let user = await UserModel.findOne({ email });

      if (!user) {
        console.log('User not found, creating new user');
        // Create new user if not exists
        try {
          const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
          
          user = new UserModel({
            name: name || email.split('@')[0],
            email,
            googleId,
            password: hashedPassword
          });

          await user.save();
          console.log('New user created successfully');
        } catch (error) {
          console.error('Error creating new user:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          return res.status(500).json({ error: 'Failed to create user account', details: errorMessage });
        }
      } else {
        console.log('User found in database');
        // Update googleId if not already set
        if (!user.googleId && googleId) {
          console.log('Updating googleId for existing user');
          try {
            user.googleId = googleId;
            await user.save();
            console.log('User updated successfully');
          } catch (error) {
            console.error('Error updating user:', error);
            // Continue anyway since we found the user
          }
        }
      }

      // Create token
      console.log('Creating JWT token');
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      console.log('Using JWT secret:', jwtSecret ? 'Secret is set' : 'Using fallback secret');
      
      const jwtToken = jwt.sign(
        { userId: user._id },
        jwtSecret,
        { expiresIn: '24h' }
      );

      // Send response
      console.log('Authentication successful, sending response');
      res.json({
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Google API verification error:', error);
      
      // Check if it's an axios error with a response property
      const axiosError = error as { response?: { status: number, data: any } };
      if (axiosError.response) {
        console.error('Google API error response:', {
          status: axiosError.response.status,
          data: axiosError.response.data
        });
        return res.status(401).json({ 
          error: 'Google token verification failed', 
          details: axiosError.response.data 
        });
      }
      
      // Default error message if not an axios error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ 
        error: 'Error verifying Google token', 
        details: errorMessage 
      });
    }
  } catch (error) {
    console.error('Google auth error:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Google authentication failed';
    let errorDetails = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = { 
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: errorDetails
    });
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

export default router; 