
#!/bin/bash

echo "🚀 بدء عملية النشر..."

# إنشاء مجلد logs إذا لم يكن موجوداً
mkdir -p logs

echo "📦 بناء Docker images..."
docker-compose build

echo "🗄️ إعداد قاعدة البيانات..."
docker-compose up -d mysql redis

# انتظار تشغيل MySQL
echo "⏳ انتظار تشغيل قاعدة البيانات..."
sleep 30

echo "🔧 تشغيل Laravel migrations..."
docker-compose run --rm app php /var/www/Back-End/artisan migrate --force

echo "🌱 تشغيل seeders..."
docker-compose run --rm app php /var/www/Back-End/artisan db:seed --force

echo "🗂️ تحسين Laravel..."
docker-compose run --rm app php /var/www/Back-End/artisan config:cache
docker-compose run --rm app php /var/www/Back-End/artisan route:cache
docker-compose run --rm app php /var/www/Back-End/artisan view:cache

echo "📱 تشغيل التطبيق..."
docker-compose up -d

echo "✅ تم النشر بنجاح!"
echo "🌐 التطبيق متاح على: http://0.0.0.0:5000"
echo "📊 قاعدة البيانات متاحة على المنفذ: 3306"

# عرض الـ logs
echo "📋 عرض logs..."
docker-compose logs -f
