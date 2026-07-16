#!/bin/bash
set -e

# Copy .env if not present
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Generate app key if not set
php artisan key:generate --force

# Run migrations against the Render disk SQLite DB
php artisan migrate --force

# Start the server
exec php -S 0.0.0.0:${PORT:-8000} -t public public/index.php
