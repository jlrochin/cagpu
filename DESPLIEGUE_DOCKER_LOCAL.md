# 🐳 **Guía de Despliegue con Docker - CAGPU**

## **Descripción General**

Esta guía detalla el proceso completo para desplegar la aplicación CAGPU (Catálogo de Atención) usando Docker en un entorno local, manteniendo todos los datos existentes y configuraciones.

---

## **📋 Tabla de Contenidos**

1. [Requisitos Previos](#1-requisitos-previos)
2. [Configuración del Proyecto](#2-configuración-del-proyecto)
3. [Archivos Docker](#3-archivos-docker)
4. [Despliegue](#4-despliegue)
5. [Gestión de Datos](#5-gestión-de-datos)
6. [Mantenimiento](#6-mantenimiento)
7. [Solución de Problemas](#7-solución-de-problemas)

---

## **1. Requisitos Previos**

### **1.1 Software Requerido**

- **Docker Desktop** (Windows/macOS) o **Docker Engine** (Linux)
- **Docker Compose** (incluido en Docker Desktop)
- **Git** para clonar el repositorio

### **1.2 Verificar Instalación**

```bash
# Verificar Docker
docker --version
docker-compose --version

# Verificar que Docker esté ejecutándose
docker info
```

---

## **2. Configuración del Proyecto**

### **2.1 Clonar Repositorio**

```bash
# Clonar el proyecto
git clone https://tu-repositorio.git cagpu-docker
cd cagpu-docker

# O si ya tienes el proyecto local
cp -r /ruta/local/cagpu ./cagpu-docker
cd cagpu-docker
```

### **2.2 Estructura del Proyecto**

```
cagpu-docker/
├── docker-compose.yml
├── Dockerfile
├── .env.docker
├── docker/
│   ├── postgres/
│   │   └── init.sql
│   └── nginx/
│       └── nginx.conf
├── scripts/
│   ├── backup.sh
│   └── restore.sh
└── README.md
```

---

## **3. Archivos Docker**

### **3.1 Dockerfile**

Crear `Dockerfile` en la raíz del proyecto:

```dockerfile
# ============================================================================
# DOCKERFILE PARA CAGPU
# ============================================================================

# Usar imagen base de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

# Copiar archivos de dependencias
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Construir aplicación
RUN pnpm run build

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["pnpm", "start"]
```

### **3.2 Docker Compose**

Crear `docker-compose.yml`:

```yaml
# ============================================================================
# DOCKER COMPOSE PARA CAGPU
# ============================================================================

version: "3.8"

services:
  # Base de datos PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: cagpu_postgres
    environment:
      POSTGRES_DB: cagpu_production
      POSTGRES_USER: cagpu_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - cagpu_network
    restart: unless-stopped

  # Aplicación CAGPU
  app:
    build: .
    container_name: cagpu_app
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    networks:
      - cagpu_network
    restart: unless-stopped

  # Nginx (opcional, para producción)
  nginx:
    image: nginx:alpine
    container_name: cagpu_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./uploads:/var/www/uploads
    depends_on:
      - app
    networks:
      - cagpu_network
    restart: unless-stopped

  # Prisma Studio (opcional, para desarrollo)
  prisma-studio:
    image: node:18-alpine
    container_name: cagpu_prisma_studio
    working_dir: /app
    command: >
      sh -c "npm install -g prisma &&
              npx prisma studio --hostname 0.0.0.0 --port 5555"
    environment:
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - .:/app
    ports:
      - "5555:5555"
    depends_on:
      - postgres
    networks:
      - cagpu_network
    profiles:
      - dev

volumes:
  postgres_data:
    driver: local

networks:
  cagpu_network:
    driver: bridge
```

### **3.3 Variables de Entorno**

Crear `.env.docker`:

```env
# ============================================================================
# CONFIGURACIÓN DOCKER - CAGPU
# ============================================================================

# Base de Datos
DB_PASSWORD=tu_contraseña_super_segura_aqui
DATABASE_URL=postgresql://cagpu_user:tu_contraseña_super_segura_aqui@postgres:5432/cagpu_production

# Next.js
NEXTAUTH_SECRET=tu_secreto_super_seguro_aqui_generar_con_openssl_rand_base64_32
NEXTAUTH_URL=http://192.168.1.100:3000

# Configuración de Seguridad
JWT_SECRET=otro_secreto_jwt_seguro_aqui

# Configuración de Red
HOSTNAME=0.0.0.0
PORT=3000

# IP del servidor en red local
SERVER_IP=192.168.1.100
```

### **3.4 Script de Inicialización de PostgreSQL**

Crear `docker/postgres/init.sql`:

```sql
-- ============================================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS - CAGPU
-- ============================================================================

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear usuario si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'cagpu_user') THEN
        CREATE USER cagpu_user WITH PASSWORD 'tu_contraseña_super_segura_aqui';
    END IF;
END
$$;

-- Otorgar privilegios
GRANT ALL PRIVILEGES ON DATABASE cagpu_production TO cagpu_user;
GRANT ALL ON SCHEMA public TO cagpu_user;
```

### **3.5 Configuración de Nginx (Opcional)**

Crear `docker/nginx/nginx.conf`:

```nginx
# ============================================================================
# CONFIGURACIÓN NGINX PARA CAGPU
# ============================================================================

events {
    worker_connections 1024;
}

http {
    upstream cagpu_app {
        server app:3000;
    }

    server {
        listen 80;
        server_name 192.168.1.100;

        location / {
            proxy_pass http://cagpu_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /uploads/ {
            alias /var/www/uploads/;
        }
    }
}
```

---

## **4. Configuración de Red Local**

### **4.1 Configurar IP Estática**

```bash
# En Windows 10:
# 1. Win + I → Red e Internet → Estado → Cambiar opciones del adaptador
# 2. Clic derecho en adaptador activo → Propiedades
# 3. Protocolo de Internet versión 4 (TCP/IPv4) → Propiedades
# 4. Usar la siguiente dirección IP:
#    - IP: 192.168.1.100
#    - Máscara de subred: 255.255.255.0
#    - Puerta de enlace: 192.168.1.1
#    - DNS: 8.8.8.8

# En Linux:
sudo nano /etc/netplan/01-netcfg.yaml
# network:
#   version: 2
#   renderer: networkd
#   ethernets:
#     enp0s3:
#       dhcp4: no
#       addresses: [192.168.1.100/24]
#       gateway4: 192.168.1.1
#       nameservers:
#         addresses: [8.8.8.8, 8.8.4.4]

# Aplicar: sudo netplan apply
```

### **4.2 Configurar Firewall**

```bash
# Windows (PowerShell como administrador):
netsh advfirewall firewall add rule name="CAGPU App" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="CAGPU Prisma" dir=in action=allow protocol=TCP localport=5555
netsh advfirewall firewall add rule name="CAGPU Nginx" dir=in action=allow protocol=TCP localport=80

# Linux (UFW):
sudo ufw allow 3000
sudo ufw allow 5555
sudo ufw allow 80
sudo ufw enable
```

### **4.3 Verificar Configuración de Red**

```bash
# Verificar IP
ipconfig /all  # Windows
ip addr show   # Linux

# Verificar conectividad
ping 192.168.1.1

# Verificar puertos
netstat -an | findstr :3000  # Windows
netstat -tlnp | grep :3000   # Linux
```

### **4.4 Configurar DNS Local (Opcional)**

```bash
# En Windows (editar C:\Windows\System32\drivers\etc\hosts como administrador):
# Agregar línea: 192.168.1.100 cagpu.local

# En Linux (editar /etc/hosts):
# Agregar línea: 192.168.1.100 cagpu.local

# Ahora podrás acceder usando:
# http://cagpu.local:3000
# http://cagpu.local:80
```

---

## **5. Despliegue**

### **5.1 Construir y Ejecutar**

```bash
# Construir imágenes
docker-compose build

# Ejecutar servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver estado de los servicios
docker-compose ps
```

### **4.2 Ejecutar Migraciones**

```bash
# Ejecutar migraciones de Prisma
docker-compose exec app npx prisma migrate deploy

# Verificar estado de la base de datos
docker-compose exec app npx prisma db push

# Generar cliente Prisma
docker-compose exec app npx prisma generate
```

### **4.3 Verificar Despliegue**

```bash
# Verificar que todos los contenedores estén ejecutándose
docker-compose ps

# Verificar logs de la aplicación
docker-compose logs app

# Verificar logs de la base de datos
docker-compose logs postgres

# Verificar conectividad local
curl http://localhost:3000/api/ping

# Verificar conectividad desde red local
curl http://192.168.1.100:3000/api/ping

# Verificar desde otra máquina en la red
# curl http://192.168.1.100:3000/api/ping
```

---

## **5. Gestión de Datos**

### **5.1 Backup de Base de Datos**

Crear `scripts/backup.sh`:

```bash
#!/bin/bash
# ============================================================================
# SCRIPT DE BACKUP - CAGPU DOCKER
# ============================================================================

# Configuración
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="cagpu_backup_${TIMESTAMP}.sql"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Realizar backup
echo "Iniciando backup de la base de datos..."
docker-compose exec -T postgres pg_dump -U cagpu_user cagpu_production > "$BACKUP_DIR/$BACKUP_FILE"

# Comprimir backup
gzip "$BACKUP_DIR/$BACKUP_FILE"

echo "Backup completado: $BACKUP_DIR/$BACKUP_FILE.gz"
echo "Tamaño: $(du -h "$BACKUP_DIR/$BACKUP_FILE.gz" | cut -f1)"
```

### **5.2 Restaurar Base de Datos**

Crear `scripts/restore.sh`:

```bash
#!/bin/bash
# ============================================================================
# SCRIPT DE RESTAURACIÓN - CAGPU DOCKER
# ============================================================================

if [ $# -eq 0 ]; then
    echo "Uso: $0 <archivo_backup.sql>"
    echo "Ejemplo: $0 backups/cagpu_backup_20241201_120000.sql"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: El archivo $BACKUP_FILE no existe"
    exit 1
fi

echo "Restaurando base de datos desde: $BACKUP_FILE"
echo "¿Estás seguro? Esta acción sobrescribirá la base de datos actual. (y/N)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "Iniciando restauración..."
    docker-compose exec -T postgres psql -U cagpu_user -d cagpu_production < "$BACKUP_FILE"
    echo "Restauración completada"
else
    echo "Restauración cancelada"
fi
```

### **5.3 Migrar Datos Existentes**

```bash
# Si tienes datos en SQLite o PostgreSQL local
# 1. Exportar datos existentes
pg_dump -h localhost -U tu_usuario cagpu > backup_existente.sql

# 2. Copiar archivo al directorio del proyecto
cp backup_existente.sql ./

# 3. Restaurar en Docker
docker-compose exec -T postgres psql -U cagpu_user -d cagpu_production < backup_existente.sql
```

---

## **6. Mantenimiento**

### **6.1 Comandos de Gestión**

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Ver logs
docker-compose logs -f [servicio]

# Ejecutar comandos en contenedores
docker-compose exec app npm run build
docker-compose exec postgres psql -U cagpu_user -d cagpu_production
```

### **6.2 Actualización de la Aplicación**

```bash
# 1. Hacer backup
./scripts/backup.sh

# 2. Actualizar código
git pull origin main

# 3. Reconstruir y reiniciar
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 4. Ejecutar migraciones
docker-compose exec app npx prisma migrate deploy
```

### **6.3 Limpieza y Mantenimiento**

```bash
# Limpiar contenedores no utilizados
docker container prune

# Limpiar imágenes no utilizadas
docker image prune

# Limpiar volúmenes no utilizados
docker volume prune

# Limpiar todo (¡CUIDADO!)
docker system prune -a

# Ver uso de recursos
docker stats
```

---

## **7. Solución de Problemas**

### **7.1 Problemas Comunes**

#### **Contenedor no inicia**

```bash
# Ver logs del contenedor
docker-compose logs [servicio]

# Verificar variables de entorno
docker-compose exec [servicio] env

# Verificar conectividad entre contenedores
docker-compose exec app ping postgres
```

#### **Error de base de datos**

```bash
# Verificar estado de PostgreSQL
docker-compose exec postgres pg_isready -U cagpu_user

# Verificar logs de PostgreSQL
docker-compose logs postgres

# Conectar a la base de datos
docker-compose exec postgres psql -U cagpu_user -d cagpu_production
```

#### **Problemas de red**

```bash
# Verificar redes Docker
docker network ls
docker network inspect cagpu-docker_cagpu_network

# Verificar puertos
netstat -tlnp | grep :3000
netstat -tlnp | grep :5432
```

### **7.2 Comandos de Emergencia**

```bash
# Reiniciar todo
docker-compose down
docker-compose up -d

# Reiniciar solo la aplicación
docker-compose restart app

# Ver estado completo
docker-compose ps
docker-compose logs --tail=100
```

### **7.3 Debugging**

```bash
# Entrar al contenedor de la aplicación
docker-compose exec app sh

# Entrar al contenedor de PostgreSQL
docker-compose exec postgres psql -U cagpu_user -d cagpu_production

# Ver logs en tiempo real
docker-compose logs -f --tail=100
```

---

## **🔧 Comandos Rápidos de Referencia**

### **Gestión de Contenedores**

```bash
docker-compose up -d              # Iniciar servicios
docker-compose down               # Detener servicios
docker-compose restart            # Reiniciar servicios
docker-compose ps                 # Ver estado
docker-compose logs -f            # Ver logs en tiempo real
```

### **Base de Datos**

```bash
docker-compose exec app npx prisma generate    # Generar cliente
docker-compose exec app npx prisma migrate deploy  # Ejecutar migraciones
docker-compose exec app npx prisma db push     # Sincronizar esquema
docker-compose exec app npx prisma studio      # Abrir interfaz web
```

### **Mantenimiento**

```bash
./scripts/backup.sh               # Crear backup
./scripts/restore.sh backup.sql   # Restaurar backup
docker-compose build --no-cache   # Reconstruir imágenes
docker system prune               # Limpiar recursos
```

---

## **📱 URLs de Acceso**

### **Acceso Local (misma máquina):**

- **Aplicación Principal:** `http://localhost:3000`
- **Nginx (si está habilitado):** `http://localhost:80`
- **Prisma Studio:** `http://localhost:5555`
- **Base de Datos:** `localhost:5432`

### **Acceso desde Red Local:**

- **Aplicación Principal:** `http://192.168.1.100:3000`
- **Nginx (si está habilitado):** `http://192.168.1.100:80`
- **Prisma Studio:** `http://192.168.1.100:5555`
- **Base de Datos:** `192.168.1.100:5432`

### **Acceso desde Internet (si configuras port forwarding):**

- **Aplicación Principal:** `http://tu_ip_publica:3000`
- **Nginx (si está habilitado):** `http://tu_ip_publica:80`

---

## **📝 Ventajas del Despliegue con Docker**

1. **Aislamiento:** Cada servicio corre en su propio contenedor
2. **Portabilidad:** Funciona igual en cualquier sistema con Docker
3. **Escalabilidad:** Fácil de escalar horizontalmente
4. **Mantenimiento:** Actualizaciones simples y rollbacks fáciles
5. **Desarrollo:** Entorno idéntico entre desarrollo y producción
6. **Backup:** Gestión simplificada de datos y configuraciones

---

## **🚨 Consideraciones Importantes**

1. **Volúmenes:** Los datos de PostgreSQL se mantienen en volúmenes Docker
2. **Backups:** Configurar backups automáticos de los volúmenes
3. **Seguridad:** Cambiar contraseñas por defecto en `.env.docker`
4. **Recursos:** Ajustar límites de memoria y CPU según necesidades
5. **Redes:** Los contenedores se comunican por la red interna de Docker

---

## **📊 Monitoreo de Recursos**

```bash
# Ver uso de recursos en tiempo real
docker stats

# Ver logs de todos los servicios
docker-compose logs -f --tail=50

# Verificar estado de salud
curl http://localhost:3000/api/health
```

---

_Última actualización: $(date)_
_Versión del documento: 1.0_
_Método de despliegue: Docker_
