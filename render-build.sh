#!/usr/bin/env bash
# Exit on error
set -o errexit

npm install
npm install axios@1.6.7 --save-exact

# Debug: Check if node_modules/axios exists
if [ -d "node_modules/axios" ]; then
  echo "axios package found in node_modules"
  ls -la node_modules/axios
else
  echo "ERROR: axios package not found in node_modules"
  exit 1
fi

npm run build 