// This file is for testing environment variables
// You can import and call this function from your main component to verify env vars

export function testEnvironmentVariables() {
  console.log('=== Environment Variables Test ===');
  
  // Test Vite environment variables
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    console.log('Vite environment detected');
    console.log('VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID || 'Not set');
    
    // List all available Vite environment variables (that start with VITE_)
    console.log('All available Vite environment variables:');
    Object.keys(import.meta.env).forEach(key => {
      if (key.startsWith('VITE_')) {
        console.log(`  ${key}:`, import.meta.env[key] || 'Not set');
      }
    });
  } else {
    console.log('Vite environment not detected');
  }
  
  // Test Create React App environment variables
  if (typeof process !== 'undefined' && process.env) {
    console.log('Node process environment detected');
    console.log('REACT_APP_GOOGLE_CLIENT_ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID || 'Not set');
  } else {
    console.log('Node process environment not detected');
  }
  
  console.log('=== End Environment Variables Test ===');
} 