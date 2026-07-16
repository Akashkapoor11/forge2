#!/bin/bash
set -e

cd /app

# Copy env file
[ -f .env ] || cp .env.example .env

# Switch to pgsql when Render provides DATABASE_URL
[ -n "$DATABASE_URL" ] && export DB_CONNECTION=pgsql

# SQLite fallback
[ "$DB_CONNECTION" = "sqlite" ] && touch database/database.sqlite

# Run package discovery (skipped during build due to --no-scripts)
php artisan package:discover --ansi 2>&1 || echo "[warn] package:discover skipped"

# Run migrations
php artisan migrate --force --no-interaction || echo "[warn] migrate failed, continuing"

# Start PHP built-in server on Render's PORT
PORT="${PORT:-8000}"
echo "[start] PHP server on 0.0.0.0:$PORT"
exec php -S 0.0.0.0:$PORT -t public public/index.php
