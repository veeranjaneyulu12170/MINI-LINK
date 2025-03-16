#!/usr/bin/env bash
# Exit on error
set -o errexit

# Clean up node_modules to ensure a fresh install
rm -rf node_modules
rm -f package-lock.json

# Install dependencies without optional dependencies and with legacy peer deps
npm install --omit=optional --legacy-peer-deps

# Build the project
npm run build 