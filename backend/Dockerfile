FROM php:8.4-cli-alpine

RUN apk add --no-cache \
        icu-dev \
        oniguruma-dev \
        libzip-dev \
        libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring intl zip bcmath xml \
    && apk del icu-dev oniguruma-dev libzip-dev libxml2-dev

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

EXPOSE 80

CMD php artisan migrate --force; php artisan config:cache; php artisan serve --host=0.0.0.0 --port=80
