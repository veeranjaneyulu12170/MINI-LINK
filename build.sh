#!/bin/bash
set -e

# Clean up node_modules to ensure a fresh install
echo "Cleaning up node_modules..."
rm -rf node_modules
rm -f package-lock.json

# Install dependencies with specific flags
echo "Installing dependencies..."
npm install --legacy-peer-deps --no-optional

# Build the project
echo "Building the project..."
npm run build

echo "Build completed successfully!" 