
# Full-Rose Docker Setup

This project contains a complete production-ready setup using Docker Compose.

## Project Structure

```
Full-Rose/
├── docker-compose.yml
├── nginx.conf
├── Back-End/
│   ├── Dockerfile
│   └── [Laravel files...]
├── Front-End/
│   ├── Dockerfile
│   └── [React files...]
└── README-DOCKER.md
```

## Services

- **nginx**: Reverse proxy server (Port 80)
- **backend**: Laravel API server (PHP 8.2-FPM)
- **frontend**: React build served by Nginx
- **db**: MySQL 8.0 database

## Quick Start

1. Clone the repository and navigate to project directory:
```bash
cd Full-Rose
```

2. Copy environment file for Laravel:
```bash
cp .env.docker Back-End/.env
```

3. Build and start all services:
```bash
docker-compose up --build
```

4. Generate Laravel application key:
```bash
docker-compose exec backend php artisan key:generate
```

5. Run Laravel migrations:
```bash
docker-compose exec backend php artisan migrate
```

## Access Points

- **Frontend**: http://localhost
- **API**: http://localhost/api
- **Database**: localhost:3306

## Useful Commands

### Start services in background
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f [service_name]
```

### Execute commands in containers
```bash
# Laravel commands
docker-compose exec backend php artisan [command]

# Database access
docker-compose exec db mysql -u laravel -p full_rose
```

### Rebuild services
```bash
docker-compose build --no-cache
docker-compose up
```

## Environment Variables

Update `.env` files in respective directories:
- `Back-End/.env` - Laravel configuration
- `Front-End/.env` - React configuration

## Production Considerations

1. **Security**: Update default passwords in docker-compose.yml
2. **SSL**: Add SSL certificates and configure HTTPS
3. **Performance**: Tune PHP-FPM and Nginx configurations
4. **Monitoring**: Add logging and monitoring services
5. **Backups**: Configure database backup strategy

## Troubleshooting

### Port conflicts
If port 80 is already in use, change in docker-compose.yml:
```yaml
ports:
  - "8080:80"  # Access via http://localhost:8080
```

### Permission issues
```bash
docker-compose exec backend chown -R www-data:www-data /var/www/html
```

### Database connection issues
Ensure database is fully started before backend:
```bash
docker-compose up db
# Wait for "ready for connections"
docker-compose up backend
```
