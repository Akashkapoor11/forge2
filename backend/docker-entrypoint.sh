#!/bin/bash
set -e

cd /var/www/html

# ── Env setup ─────────────────────────────────────────────────────────────────
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Use Render's PORT (default 80)
PORT="${PORT:-80}"

# ── Apache port: Render routes to $PORT, not necessarily 80 ───────────────────
if [ "$PORT" != "80" ]; then
  sed -i "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf
  sed -i "s/<VirtualHost \*:80>/<VirtualHost *:$PORT>/" /etc/apache2/sites-available/000-default.conf
  sed -i "s/<VirtualHost \*:80>/<VirtualHost *:$PORT>/" /etc/apache2/sites-available/default-ssl.conf 2>/dev/null || true
fi

# ── Laravel setup ─────────────────────────────────────────────────────────────
# Use env vars set by Render (APP_KEY, DATABASE_URL etc.) directly
# Only generate key if not already set in environment
if [ -z "$APP_KEY" ] && ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
  php artisan key:generate --force
fi

# Switch to pgsql if DATABASE_URL is provided
if [ -n "$DATABASE_URL" ]; then
  export DB_CONNECTION=pgsql
fi

# SQLite fallback
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
  mkdir -p /var/www/html/database
  touch /var/www/html/database/database.sqlite
fi

# Run migrations (don't exit on failure — let app start)
php artisan migrate --force --no-interaction 2>&1 || echo "[WARN] Migration had issues — continuing"

# Clear caches for production
php artisan config:clear
php artisan route:clear

echo "[INFO] Starting Apache on port $PORT"
exec apache2-foreground
