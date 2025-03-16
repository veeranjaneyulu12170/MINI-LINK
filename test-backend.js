/**
 * Backend Server Test Script
 * 
 * This script tests if the backend server is running and responding to requests.
 */

const http = require('http');

// Test the health endpoint
function testHealthEndpoint() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
      timeout: 5000
    };

    console.log('Testing backend health endpoint...');
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Backend server is healthy!');
          console.log('Response:', data);
          resolve(true);
        } else {
          console.log(`❌ Backend server returned status ${res.statusCode}`);
          console.log('Response:', data);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error connecting to backend server: ${error.message}`);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('❌ Request timed out');
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.end();
  });
}

// Test the Google auth endpoint
function testGoogleAuthEndpoint() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/google',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    };

    const data = JSON.stringify({
      token: 'test_token'
    });

    console.log('Testing Google auth endpoint...');
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        // Even a 401 or 400 response means the server is working
        if (res.statusCode !== 500 && res.statusCode !== 404) {
          console.log('✅ Google auth endpoint is working!');
          console.log(`Status: ${res.statusCode}`);
          console.log('Response:', responseData);
          resolve(true);
        } else {
          console.log(`❌ Google auth endpoint returned status ${res.statusCode}`);
          console.log('Response:', responseData);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error connecting to Google auth endpoint: ${error.message}`);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('❌ Request timed out');
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.write(data);
    req.end();
  });
}

// Run all tests
async function runTests() {
  try {
    console.log('=== BACKEND SERVER TEST ===');
    
    // Test health endpoint
    const healthResult = await testHealthEndpoint();
    
    // Test Google auth endpoint
    const googleAuthResult = await testGoogleAuthEndpoint();
    
    // Overall result
    if (healthResult && googleAuthResult) {
      console.log('✅ All tests passed! The backend server is working correctly.');
    } else {
      console.log('❌ Some tests failed. Check the logs above for details.');
    }
    
    console.log('=== TEST COMPLETE ===');
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the tests
runTests(); 