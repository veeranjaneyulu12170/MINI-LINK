/**
 * Backend Server Starter
 * 
 * This script checks if the backend server is running and starts it if it's not.
 * Run this script with Node.js to ensure the backend server is running.
 */

const { exec } = require('child_process');
const http = require('http');

// Check if the backend server is running
function checkServerRunning(port, callback) {
  const options = {
    hostname: 'localhost',
    port: port,
    path: '/api/health',
    method: 'GET',
    timeout: 2000
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log(`✅ Backend server is already running on port ${port}`);
      callback(true);
    } else {
      console.log(`❌ Backend server returned status ${res.statusCode}`);
      callback(false);
    }
  });

  req.on('error', (e) => {
    console.log(`❌ Backend server is not running on port ${port}: ${e.message}`);
    callback(false);
  });

  req.on('timeout', () => {
    console.log(`❌ Backend server connection timed out on port ${port}`);
    req.destroy();
    callback(false);
  });

  req.end();
}

// Start the backend server
function startBackendServer() {
  console.log('🚀 Starting backend server...');
  
  const serverProcess = exec('cd backend && npm run dev', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error starting backend server: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Backend server stderr: ${stderr}`);
    }
    console.log(`Backend server stdout: ${stdout}`);
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data.trim()}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Backend error: ${data.trim()}`);
  });

  // Check if the server started successfully after a delay
  setTimeout(() => {
    checkServerRunning(5000, (isRunning) => {
      if (isRunning) {
        console.log('✅ Backend server started successfully');
      } else {
        console.error('❌ Failed to start backend server');
      }
    });
  }, 5000);

  return serverProcess;
}

// Main function
function main() {
  console.log('🔍 Checking if backend server is running...');
  
  checkServerRunning(5000, (isRunning) => {
    if (!isRunning) {
      startBackendServer();
    } else {
      console.log('✅ Backend server is already running. No action needed.');
    }
  });
}

// Run the main function
main();

// Handle script termination
process.on('SIGINT', () => {
  console.log('Script terminated. Exiting...');
  process.exit(0);
}); 