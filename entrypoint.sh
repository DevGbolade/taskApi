#!/bin/sh

# Copy .env.prod to .env
echo "Copying .env.prod to .env..."
cp /app/.env.prod /app/.env

# Start the application
echo "Starting the application..."
exec "$@"

