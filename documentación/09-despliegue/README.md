# Despliegue y Configuración - Sistema CAGPU

## Visión General

Esta sección documenta el proceso de despliegue del sistema CAGPU, incluyendo configuración de variables de entorno, scripts de despliegue y monitoreo en producción.

## Variables de Entorno

### 1. Variables Requeridas

```bash
# .env.local
# Base de Datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/cagpu"

# Autenticación
JWT_SECRET="clave_secreta_muy_larga_y_compleja"

# Configuración de la Aplicación
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://cagpu.example.com"

# Base de Datos de Producción
DATABASE_URL_PROD="postgresql://usuario:contraseña@servidor:5432/cagpu"
```

### 2. Variables Opcionales

```bash
# .env.local
# Logging
LOG_LEVEL="info"
SENTRY_DSN="https://..."

# Email (futuro)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="usuario@ejemplo.com"
SMTP_PASS="contraseña"

# Monitoreo
UPTIME_ROBOT_API_KEY="..."
```

## Configuración de Producción

### 1. Next.js Config

```typescript
// next.config.mjs
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
```

### 2. Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 3. Docker Compose

```yaml
# docker-compose.yml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=cagpu
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
```

## Scripts de Despliegue

### 1. Script de Construcción

```bash
#!/bin/bash
# scripts/build.sh

echo "🚀 Iniciando construcción del proyecto CAGPU..."

# Verificar dependencias
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm no está instalado"
    exit 1
fi

# Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
rm -rf .next
rm -rf out

# Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install --frozen-lockfile

# Verificar variables de entorno
if [ ! -f .env.local ]; then
    echo "❌ Archivo .env.local no encontrado"
    exit 1
fi

# Construir proyecto
echo "🔨 Construyendo proyecto..."
pnpm run build

# Verificar construcción
if [ $? -eq 0 ]; then
    echo "✅ Construcción completada exitosamente"
else
    echo "❌ Error en la construcción"
    exit 1
fi
```

### 2. Script de Despliegue

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Iniciando despliegue del sistema CAGPU..."

# Variables de configuración
APP_NAME="cagpu"
DEPLOY_PATH="/var/www/cagpu"
BACKUP_PATH="/var/backups/cagpu"

# Crear backup
echo "💾 Creando backup..."
if [ -d "$DEPLOY_PATH" ]; then
    timestamp=$(date +%Y%m%d_%H%M%S)
    tar -czf "$BACKUP_PATH/backup_$timestamp.tar.gz" -C "$DEPLOY_PATH" .
fi

# Detener aplicación
echo "⏹️ Deteniendo aplicación..."
sudo systemctl stop $APP_NAME || true

# Sincronizar archivos
echo "📁 Sincronizando archivos..."
rsync -av --delete ./ $DEPLOY_PATH/

# Instalar dependencias de producción
echo "📦 Instalando dependencias..."
cd $DEPLOY_PATH
pnpm install --prod --frozen-lockfile

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones de base de datos..."
npx prisma migrate deploy

# Generar cliente Prisma
echo "🔧 Generando cliente Prisma..."
npx prisma generate

# Reiniciar aplicación
echo "🔄 Reiniciando aplicación..."
sudo systemctl start $APP_NAME

# Verificar estado
echo "✅ Verificando estado de la aplicación..."
sleep 5
if curl -f http://localhost:3000/api/ping > /dev/null 2>&1; then
    echo "✅ Despliegue completado exitosamente"
else
    echo "❌ Error en el despliegue"
    exit 1
fi
```

## Configuración del Servidor

### 1. Systemd Service

```ini
# /etc/systemd/system/cagpu.service
[Unit]
Description=CAGPU Sistema de Gestión
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/cagpu
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 2. Nginx Configuration

```nginx
# /etc/nginx/sites-available/cagpu
server {
    listen 80;
    server_name cagpu.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cagpu.example.com;

    ssl_certificate /etc/letsencrypt/live/cagpu.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cagpu.example.com/privkey.pem;

    # Configuración SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Headers de seguridad
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Proxy a la aplicación
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Archivos estáticos
    location /_next/static {
        alias /var/www/cagpu/.next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /api/ping {
        proxy_pass http://127.0.0.1:3000;
        access_log off;
    }
}
```

## Monitoreo y Logging

### 1. Logging Configuration

```typescript
// lib/logger.ts
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "cagpu" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
```

### 2. Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Verificar base de datos
    await prisma.$queryRaw`SELECT 1`;

    // Verificar memoria
    const memUsage = process.memoryUsage();

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      },
      database: "connected",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 500 }
    );
  }
}
```

## Backup y Restauración

### 1. Script de Backup

```bash
#!/bin/bash
# scripts/backup.sh

DB_NAME="cagpu"
BACKUP_DIR="/var/backups/cagpu"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "💾 Iniciando backup de la base de datos..."

# Crear directorio de backup si no existe
mkdir -p $BACKUP_DIR

# Backup de la base de datos
pg_dump -h localhost -U postgres $DB_NAME > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Backup de archivos de la aplicación
tar -czf "$BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz" -C /var/www/cagpu .

# Limpiar backups antiguos (mantener últimos 7 días)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup completado: $BACKUP_DIR"
```

### 2. Script de Restauración

```bash
#!/bin/bash
# scripts/restore.sh

if [ $# -eq 0 ]; then
    echo "Uso: $0 <archivo_backup>"
    exit 1
fi

BACKUP_FILE=$1
DB_NAME="cagpu"

echo "🔄 Iniciando restauración desde: $BACKUP_FILE"

# Verificar que el archivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Archivo de backup no encontrado: $BACKUP_FILE"
    exit 1
fi

# Confirmar restauración
read -p "¿Estás seguro de que quieres restaurar? Esto sobrescribirá la base de datos actual. (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restauración cancelada"
    exit 1
fi

# Detener aplicación
echo "⏹️ Deteniendo aplicación..."
sudo systemctl stop cagpu

# Restaurar base de datos
echo "🗄️ Restaurando base de datos..."
psql -h localhost -U postgres -d $DB_NAME < "$BACKUP_FILE"

# Reiniciar aplicación
echo "🔄 Reiniciando aplicación..."
sudo systemctl start cagpu

echo "✅ Restauración completada"
```

## CI/CD Pipeline

### 1. GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}

      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/cagpu
            git pull origin main
            npm ci --production
            npx prisma migrate deploy
            npx prisma generate
            sudo systemctl restart cagpu
```

## Monitoreo de Performance

### 1. Métricas del Sistema

```typescript
// lib/metrics.ts
export interface SystemMetrics {
  cpu: number;
  memory: number;
  uptime: number;
  requests: number;
  errors: number;
}

export class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: SystemMetrics = {
    cpu: 0,
    memory: 0,
    uptime: 0,
    requests: 0,
    errors: 0,
  };

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  recordRequest() {
    this.metrics.requests++;
  }

  recordError() {
    this.metrics.errors++;
  }

  getMetrics(): SystemMetrics {
    const memUsage = process.memoryUsage();
    this.metrics.memory = Math.round(memUsage.heapUsed / 1024 / 1024);
    this.metrics.uptime = process.uptime();

    return { ...this.metrics };
  }
}
```

## Próximas Mejoras

### 1. Containerización Avanzada

- Kubernetes deployment
- Helm charts
- Service mesh (Istio)

### 2. Monitoreo Avanzado

- Prometheus + Grafana
- ELK Stack
- APM tools

### 3. Automatización

- Auto-scaling
- Blue-green deployments
- Canary releases
