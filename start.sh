#!/bin/sh

# Start the backend server directly with node
node /app/backend/dist/server.js &

# Start Nginx in the foreground
nginx -g 'daemon off;'