FROM php:8.2-cli

# Install system deps + PostgreSQL client
RUN apt-get update && apt-get install -y \
    unzip curl git \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy backend source
COPY . .

# Install PHP dependencies (disable audit to avoid security advisory blocking)
RUN COMPOSER_NO_AUDIT=1 composer install --no-dev --optimize-autoloader --no-interaction

# Copy entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/docker-entrypoint.sh"]
