# 🚀 Guía Completa de Despliegue CAGPU en Ubuntu

## 📋 Tabla de Contenidos

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Preparación de Ubuntu](#preparación-de-ubuntu)
3. [Instalación de Docker](#instalación-de-docker)
4. [Configuración del Proyecto](#configuración-del-proyecto)
5. [Despliegue con Docker](#despliegue-con-docker)
6. [Configuración de Red](#configuración-de-red)
7. [Configuración de Seguridad](#configuración-de-seguridad)
8. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
9. [Solución de Problemas](#solución-de-problemas)

---

## 🖥️ Requisitos del Sistema

### Mínimos

- **Sistema Operativo**: Ubuntu 20.04 LTS o superior
- **RAM**: 2GB mínimo (4GB recomendado)
- **Almacenamiento**: 10GB mínimo
- **CPU**: 2 núcleos mínimo
- **Red**: Conexión a internet para descargas

### Recomendados

- **RAM**: 8GB o más
- **Almacenamiento**: 50GB SSD
- **CPU**: 4 núcleos o más
- **Red**: Conexión estable a internet

---

## 🔧 Preparación de Ubuntu

### 1. Actualizar el Sistema

```bash
# Actualizar lista de paquetes
sudo apt update

# Actualizar paquetes instalados
sudo apt upgrade -y

# Instalar paquetes esenciales
sudo apt install -y curl wget git nano htop ufw
```

### 2. Configurar Usuario (Opcional)

```bash
# Crear usuario para la aplicación (recomendado)
sudo adduser cagpu
sudo usermod -aG sudo cagpu

# Cambiar al usuario
su - cagpu
```

### 3. Configurar Zona Horaria

```bash
# Ver zonas horarias disponibles
timedatectl list-timezones | grep America

# Configurar zona horaria (ejemplo para México)
sudo timedatectl set-timezone America/Mexico_City

# Verificar configuración
timedatectl status
```

---

## 🐳 Instalación de Docker

### 1. Instalar Dependencias

```bash
# Instalar paquetes necesarios
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release
```

### 2. Agregar Repositorio de Docker

```bash
# Agregar clave GPG oficial de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Agregar repositorio de Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 3. Instalar Docker

```bash
# Actualizar repositorios
sudo apt update

# Instalar Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verificar instalación
sudo docker --version
```

### 4. Instalar Docker Compose

```bash
# Descargar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Dar permisos de ejecución
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker-compose --version
```

### 5. Configurar Usuario para Docker

```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Aplicar cambios (necesario reiniciar sesión)
newgrp docker

# Verificar que funciona sin sudo
docker run hello-world
```

---

## 📁 Configuración del Proyecto

### 1. Clonar el Repositorio

```bash
# Crear directorio para proyectos
mkdir -p ~/proyectos
cd ~/proyectos

# Clonar repositorio (reemplaza con tu URL)
git clone https://github.com/tu-usuario/cagpu.git
cd cagpu

# Verificar estructura
ls -la
```

### 2. Configurar Variables de Entorno

```bash
# Crear archivo .env
cp .env.example .env

# Editar variables de entorno
nano .env
```

**Contenido del archivo `.env`:**

```env
# ============================================================================
# CONFIGURACIÓN DE BASE DE DATOS
# ============================================================================
DB_PASSWORD=tu_password_seguro_aqui
DATABASE_URL=postgresql://cagpu_user:tu_password_seguro_aqui@postgres:5432/cagpu_production

# ============================================================================
# CONFIGURACIÓN DE AUTENTICACIÓN
# ============================================================================
NEXTAUTH_SECRET=tu_secret_muy_largo_y_seguro_aqui_minimo_32_caracteres
NEXTAUTH_URL=http://tu-ip-servidor:3000

# ============================================================================
# CONFIGURACIÓN JWT
# ============================================================================
JWT_SECRET=tu_jwt_secret_seguro_aqui_minimo_32_caracteres

# ============================================================================
# CONFIGURACIÓN DE PRODUCCIÓN
# ============================================================================
NODE_ENV=production
```

### 3. Generar Secretos Seguros

```bash
# Generar secretos seguros
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32

# Usar estos valores para NEXTAUTH_SECRET y JWT_SECRET
```

### 4. Configurar Nginx

```bash
# Editar configuración de Nginx
nano docker/nginx/nginx.conf
```

**Contenido actualizado:**

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
        server_name _;  # Acepta cualquier nombre de dominio

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

## 🚀 Despliegue con Docker

### 1. Construir Imágenes

```bash
# Construir todas las imágenes
docker-compose build

# Verificar imágenes creadas
docker images
```

### 2. Ejecutar Contenedores

```bash
# Ejecutar en segundo plano
docker-compose up -d

# Verificar estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f
```

### 3. Verificar Funcionamiento

```bash
# Verificar que todos los servicios estén corriendo
docker-compose ps

# Verificar logs de la aplicación
docker-compose logs app

# Verificar logs de la base de datos
docker-compose logs postgres
```

### 4. Acceder a la Aplicación

- **Aplicación principal**: `http://tu-ip-servidor`
- **Prisma Studio** (desarrollo): `http://tu-ip-servidor:5555`
- **Base de datos**: `tu-ip-servidor:5432`

---

## 🌐 Configuración de Red

### 1. Obtener IP del Servidor

```bash
# Ver IP del servidor
ip addr show

# O usar
hostname -I
```

### 2. Configurar Firewall

```bash
# Habilitar firewall
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Permitir puerto 80 (HTTP)
sudo ufw allow 80

# Permitir puerto 443 (HTTPS) si usas SSL
sudo ufw allow 443

# Permitir puerto 3000 (si no usas Nginx)
sudo ufw allow 3000

# Verificar reglas
sudo ufw status
```

### 3. Configurar Nombre de Dominio Local (Opcional)

```bash
# En el servidor, ver el nombre del host
hostname

# En el cliente, editar /etc/hosts
sudo nano /etc/hosts

# Agregar línea:
# 192.168.1.100  cagpu.local
```

---

## 🔒 Configuración de Seguridad

### 1. Cambiar Contraseñas por Defecto

```bash
# Generar contraseña segura para base de datos
openssl rand -base64 16

# Actualizar en .env
nano .env
```

### 2. Configurar SSL/HTTPS (Opcional)

```bash
# Instalar Certbot
sudo apt install -y certbot

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com

# Configurar renovación automática
sudo crontab -e

# Agregar línea:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Configurar Backups Automáticos

```bash
# Crear script de backup
nano ~/backup-cagpu.sh
```

**Contenido del script:**

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/cagpu/backups"
PROJECT_DIR="/home/cagpu/proyectos/cagpu"

# Crear directorio de backups
mkdir -p $BACKUP_DIR

# Backup de base de datos
docker-compose -f $PROJECT_DIR/docker-compose.yml exec -T postgres pg_dump -U cagpu_user cagpu_production > $BACKUP_DIR/cagpu_db_$DATE.sql

# Backup de archivos
tar -czf $BACKUP_DIR/cagpu_files_$DATE.tar.gz -C $PROJECT_DIR uploads logs

# Eliminar backups antiguos (más de 30 días)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completado: $DATE"
```

```bash
# Hacer ejecutable
chmod +x ~/backup-cagpu.sh

# Configurar cron para backups diarios
crontab -e

# Agregar línea:
# 0 2 * * * /home/cagpu/backup-cagpu.sh
```

---

## 📊 Monitoreo y Mantenimiento

### 1. Comandos Útiles

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs app
docker-compose logs postgres
docker-compose logs nginx

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Iniciar servicios
docker-compose up -d
```

### 2. Script de Inicio Automático

```bash
# Crear script de inicio
nano ~/start-cagpu.sh
```

**Contenido:**

```bash
#!/bin/bash
cd ~/proyectos/cagpu
docker-compose up -d
echo "CAGPU iniciado en $(date)"
```

```bash
# Hacer ejecutable
chmod +x ~/start-cagpu.sh
```

### 3. Configurar Servicio Systemd

```bash
# Crear archivo de servicio
sudo nano /etc/systemd/system/cagpu.service
```

**Contenido:**

```ini
[Unit]
Description=CAGPU Application
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/cagpu/proyectos/cagpu
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

```bash
# Habilitar y iniciar servicio
sudo systemctl daemon-reload
sudo systemctl enable cagpu.service
sudo systemctl start cagpu.service

# Verificar estado
sudo systemctl status cagpu.service
```

### 4. Monitoreo de Recursos

```bash
# Instalar herramientas de monitoreo
sudo apt install -y htop iotop nethogs

# Ver uso de recursos
htop
iotop
nethogs

# Ver uso de Docker
docker stats
```

---

## 🔧 Solución de Problemas

### 1. Problemas Comunes

#### Contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs app

# Verificar variables de entorno
docker-compose config

# Reconstruir imagen
docker-compose build --no-cache app
```

#### Base de datos no conecta

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose logs postgres

# Conectar a base de datos
docker-compose exec postgres psql -U cagpu_user -d cagpu_production

# Verificar migraciones
docker-compose exec app npx prisma migrate status
```

#### Nginx no funciona

```bash
# Verificar configuración
docker-compose exec nginx nginx -t

# Ver logs de Nginx
docker-compose logs nginx

# Reiniciar Nginx
docker-compose restart nginx
```

### 2. Comandos de Diagnóstico

```bash
# Verificar espacio en disco
df -h

# Verificar memoria
free -h

# Verificar procesos
ps aux | grep docker

# Verificar puertos
netstat -tulpn | grep :80
netstat -tulpn | grep :3000
netstat -tulpn | grep :5432
```

### 3. Limpieza del Sistema

```bash
# Limpiar contenedores no utilizados
docker container prune

# Limpiar imágenes no utilizadas
docker image prune

# Limpiar volúmenes no utilizados
docker volume prune

# Limpieza completa
docker system prune -a
```

---

## 📞 Soporte y Contacto

### Información del Sistema

- **Versión**: CAGPU v0.1.0
- **Tecnologías**: Next.js 14, React, TypeScript, PostgreSQL, Docker
- **Documentación**: Disponible en `http://tu-ip-servidor/documentacion`

### Comandos de Emergencia

```bash
# Detener todo
docker-compose down

# Reiniciar todo
docker-compose down && docker-compose up -d

# Ver logs completos
docker-compose logs --tail=100

# Backup de emergencia
docker-compose exec postgres pg_dump -U cagpu_user cagpu_production > backup_emergencia.sql
```

---

## ✅ Checklist de Verificación

- [ ] Ubuntu actualizado y configurado
- [ ] Docker instalado y funcionando
- [ ] Docker Compose instalado
- [ ] Repositorio clonado
- [ ] Variables de entorno configuradas
- [ ] Contenedores construidos
- [ ] Servicios ejecutándose
- [ ] Firewall configurado
- [ ] Backups configurados
- [ ] Servicio systemd habilitado
- [ ] Aplicación accesible desde red
- [ ] Documentación verificada

---

**¡Tu aplicación CAGPU está lista para usar en Ubuntu! 🎉**
