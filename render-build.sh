#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies without optional dependencies and with legacy peer deps
npm install --omit=optional --legacy-peer-deps

# Build the project
npm run build 