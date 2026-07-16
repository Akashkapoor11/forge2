FROM php:8.2-cli

# Install PostgreSQL driver
RUN apt-get update && apt-get install -y \
    unzip curl git libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Composer 2.2 LTS (no advisory blocking)
COPY --from=composer:2.2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

# Install dependencies (--no-scripts: skip artisan calls that need .env during build)
RUN COMPOSER_NO_AUDIT=1 composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

RUN chmod -R 775 storage bootstrap/cache

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
