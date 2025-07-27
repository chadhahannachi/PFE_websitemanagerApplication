FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    default-mysql-client

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory
COPY . .

# Give execute permissions to entrypoint script
RUN chmod +x docker-entrypoint.sh

# Install dependencies
RUN composer install

# Set permissions
RUN chown -R www-data:www-data /var/www

# Expose port 8000
EXPOSE 8000

# Use custom entrypoint
ENTRYPOINT ["/var/www/docker-entrypoint.sh"]

# Start PHP artisan serve
CMD php artisan serve --host=0.0.0.0 --port=8000