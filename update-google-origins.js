/**
 * Google Cloud Console Origin Configuration Helper
 * 
 * This script helps you identify which origins need to be added to your Google Cloud Console project.
 * Run this script with Node.js to get a list of origins that should be added.
 */

// List of common development origins
const developmentOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5173',
];

// List of production origins (update these with your actual production domains)
const productionOrigins = [
  // 'https://your-production-domain.com',
  // 'https://staging.your-production-domain.com',
];

// Combine all origins
const allOrigins = [...developmentOrigins, ...productionOrigins];

console.log('=== Google Cloud Console Origin Configuration Helper ===');
console.log('');
console.log('Add the following origins to your Google Cloud Console project:');
console.log('');

// Print all origins in a format that can be easily copied
allOrigins.forEach(origin => {
  console.log(`- ${origin}`);
});

console.log('');
console.log('Steps to add these origins:');
console.log('1. Go to https://console.cloud.google.com/');
console.log('2. Select your project');
console.log('3. Go to "APIs & Services" → "Credentials"');
console.log('4. Edit your OAuth 2.0 Client ID');
console.log('5. Add the origins above to "Authorized JavaScript origins"');
console.log('6. Add the following to "Authorized redirect URIs":');

// Print all redirect URIs
allOrigins.forEach(origin => {
  console.log(`- ${origin}/auth/google/callback`);
});

console.log('');
console.log('7. Click "Save"');
console.log('');
console.log('Note: Changes may take a few minutes to propagate.');
console.log('=== End of Helper ===');

// If this is run as a script, exit
if (require.main === module) {
  console.log('');
  console.log('You can run this script with:');
  console.log('node update-google-origins.js');
}

module.exports = {
  developmentOrigins,
  productionOrigins,
  allOrigins,
}; 