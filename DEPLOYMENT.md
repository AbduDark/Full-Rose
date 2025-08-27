
# دليل النشر - Rose Academy Platform

## متطلبات النظام

- Ubuntu 20.04 أو أحدث
- Docker و Docker Compose
- 4GB RAM على الأقل
- 20GB مساحة تخزين

## خطوات النشر

### 1. تثبيت Docker
```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# تثبيت Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# إضافة المستخدم إلى مجموعة docker
sudo usermod -aG docker $USER
```

### 2. إعداد المشروع
```bash
# نسخ المشروع
git clone <repository-url>
cd rose-academy-platform

# إعداد ملف البيئة
cp Back-End/.env.production Back-End/.env

# توليد مفتاح التطبيق
docker-compose run --rm app php /var/www/Back-End/artisan key:generate
```

### 3. النشر
```bash
# تشغيل سكريبت النشر
./deploy.sh
```

## المنافذ المستخدمة

- **5000**: التطبيق الرئيسي
- **3306**: قاعدة البيانات MySQL
- **6379**: Redis Cache

## أوامر مفيدة

### إيقاف التطبيق
```bash
docker-compose down
```

### إعادة تشغيل التطبيق
```bash
docker-compose restart
```

### عرض logs
```bash
docker-compose logs -f app
```

### الدخول إلى container التطبيق
```bash
docker-compose exec app bash
```

### تشغيل Laravel commands
```bash
docker-compose exec app php /var/www/Back-End/artisan <command>
```

### تحديث التطبيق
```bash
# سحب التحديثات
git pull

# إعادة بناء Images
docker-compose build --no-cache

# إعادة تشغيل التطبيق
docker-compose up -d
```

## استكشاف الأخطاء

### مشكلة في قاعدة البيانات
```bash
# إعادة تشغيل MySQL
docker-compose restart mysql

# التحقق من logs
docker-compose logs mysql
```

### مشكلة في التطبيق
```bash
# التحقق من logs
docker-compose logs app

# إعادة تشغيل التطبيق
docker-compose restart app
```

### تنظيف النظام
```bash
# حذف containers و volumes
docker-compose down -v

# حذف images غير المستخدمة
docker system prune -a
```

## الأمان

- تأكد من تغيير كلمات المرور الافتراضية
- استخدم HTTPS في الإنتاج
- قم بإعداد firewall للحماية
- اعمل backup دوري لقاعدة البيانات

## النسخ الاحتياطي

### نسخ احتياطي لقاعدة البيانات
```bash
docker-compose exec mysql mysqldump -u root -psecret rose_academy > backup.sql
```

### استعادة قاعدة البيانات
```bash
docker-compose exec -i mysql mysql -u root -psecret rose_academy < backup.sql
```
