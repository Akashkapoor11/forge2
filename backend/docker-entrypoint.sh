#!/bin/bash
set -e

cd /var/www/html

# Copy .env if not present
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Generate app key if not set
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
  php artisan key:generate --force
fi

# If DATABASE_URL is set (Render PostgreSQL), switch to pgsql
if [ -n "$DATABASE_URL" ]; then
  export DB_CONNECTION=pgsql
fi

# If using sqlite, create the file
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
  touch /var/www/html/database/database.sqlite
fi

# Run migrations
php artisan migrate --force --no-interaction || echo "Migration warning (may already be up to date)"

# Clear and cache config for production
php artisan config:clear
php artisan route:clear

# Start Apache in foreground
exec apache2-foreground
