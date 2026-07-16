#!/bin/bash
set -e

# Copy .env if not present
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Generate app key if not already set
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
  php artisan key:generate --force
fi

# If DATABASE_URL is set (Render PostgreSQL), switch connection to pgsql
if [ -n "$DATABASE_URL" ]; then
  export DB_CONNECTION=pgsql
fi

# If using sqlite and the file doesn't exist, create it
if [ "$DB_CONNECTION" = "sqlite" ]; then
  DB_FILE="${DB_DATABASE:-/app/database/database.sqlite}"
  mkdir -p "$(dirname "$DB_FILE")"
  touch "$DB_FILE"
fi

# Run migrations
php artisan migrate --force

# Start the PHP server
exec php -S 0.0.0.0:${PORT:-8000} -t public public/index.php
