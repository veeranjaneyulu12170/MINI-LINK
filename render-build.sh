#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies without optional dependencies
npm install --omit=optional

# Build the project
npm run build 