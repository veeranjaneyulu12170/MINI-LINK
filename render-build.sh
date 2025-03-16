#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
npm install axios@1.6.7 --save-exact

# Debug: Check if node_modules/axios exists in backend
if [ -d "node_modules/axios" ]; then
  echo "axios package found in backend/node_modules"
  ls -la node_modules/axios
else
  echo "ERROR: axios package not found in backend/node_modules"
  exit 1
fi

# Build backend
npm run build

# Return to root and build frontend
cd ..
npm run build 