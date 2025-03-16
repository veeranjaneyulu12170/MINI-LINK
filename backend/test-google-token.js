/**
 * Google Token Verification Test Script
 * 
 * This script tests the Google token verification process without affecting the database.
 * It helps diagnose issues with the Google authentication flow.
 * 
 * Usage:
 * node test-google-token.js <token>
 */

const axios = require('axios');

// Get the token from command line arguments
const token = process.argv[2];

if (!token) {
  console.error('Please provide a Google token as a command line argument');
  console.error('Usage: node test-google-token.js <token>');
  process.exit(1);
}

console.log('Testing Google token verification...');
console.log('Token length:', token.length);
console.log('Token type:', typeof token);

// Determine token type based on format
const isIdToken = token.split('.').length === 3;
console.log('Token appears to be an', isIdToken ? 'ID token' : 'access token');

async function verifyIdToken() {
  try {
    console.log('Verifying ID token with tokeninfo endpoint...');
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
    );
    
    console.log('Verification successful!');
    console.log('Response status:', response.status);
    console.log('User info:', response.data);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('ID token verification failed:', error.message);
    
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    
    return {
      success: false,
      error: error.message,
      details: error.response?.data
    };
  }
}

async function getUserInfo() {
  try {
    console.log('Fetching user info with access token...');
    const response = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('User info fetch successful!');
    console.log('Response status:', response.status);
    console.log('User info:', response.data);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('User info fetch failed:', error.message);
    
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    
    return {
      success: false,
      error: error.message,
      details: error.response?.data
    };
  }
}

async function main() {
  let result;
  
  // Try the appropriate verification method based on token type
  if (isIdToken) {
    result = await verifyIdToken();
  } else {
    result = await getUserInfo();
  }
  
  // If the first method fails, try the other method as a fallback
  if (!result.success) {
    console.log('First verification method failed, trying alternative method...');
    
    if (isIdToken) {
      result = await getUserInfo();
    } else {
      result = await verifyIdToken();
    }
  }
  
  // Final result
  if (result.success) {
    console.log('=== VERIFICATION SUCCESSFUL ===');
    console.log('Email:', result.data.email);
    console.log('Name:', result.data.name || result.data.given_name);
    console.log('Google ID:', result.data.sub || result.data.id);
  } else {
    console.error('=== VERIFICATION FAILED ===');
    console.error('Both verification methods failed. The token may be invalid or expired.');
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 