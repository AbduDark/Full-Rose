
FROM ubuntu:22.04

# تثبيت المتطلبات الأساسية
RUN apt-get update && apt-get install -y \
    software-properties-common \
    curl \
    wget \
    gnupg \
    lsb-release \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# تثبيت PHP 8.2
RUN add-apt-repository ppa:ondrej/php && \
    apt-get update && \
    apt-get install -y \
    php8.2 \
    php8.2-cli \
    php8.2-fpm \
    php8.2-mysql \
    php8.2-pgsql \
    php8.2-sqlite3 \
    php8.2-redis \
    php8.2-memcached \
    php8.2-json \
    php8.2-mbstring \
    php8.2-xml \
    php8.2-curl \
    php8.2-zip \
    php8.2-bcmath \
    php8.2-intl \
    php8.2-readline \
    php8.2-gd \
    php8.2-imagick \
    unzip \
    supervisor \
    nginx

# تثبيت Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# تثبيت Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# إنشاء مجلد العمل
WORKDIR /var/www

# نسخ ملفات المشروع
COPY . .

# تثبيت dependencies للـ backend
WORKDIR /var/www/Back-End
RUN composer install --no-dev --optimize-autoloader

# تثبيت dependencies للـ frontend
WORKDIR /var/www/Front-End
RUN npm install && npm run build

# إعداد صلاحيات Laravel
WORKDIR /var/www/Back-End
RUN chown -R www-data:www-data /var/www/Back-End/storage /var/www/Back-End/bootstrap/cache
RUN chmod -R 775 /var/www/Back-End/storage /var/www/Back-End/bootstrap/cache

# نسخ ملفات الإعداد
COPY nginx.conf /etc/nginx/sites-available/default
COPY supervisor.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
