# 🚀 **Guía de Despliegue en Red Local - CAGPU**

## **Descripción General**
Esta guía detalla el proceso completo para desplegar la aplicación CAGPU (Catálogo de Atención) en una red local, manteniendo todos los datos existentes y configuraciones.

---

## **📋 Tabla de Contenidos**
1. [Preparación del Servidor](#1-preparación-del-servidor)
2. [Configuración de Base de Datos](#2-configuración-de-base-de-datos)
3. [Migración de Datos](#3-migración-de-datos)
4. [Despliegue de la Aplicación](#4-despliegue-de-la-aplicación)
5. [Configuración del Servidor](#5-configuración-del-servidor)
6. [Configuración de Red](#6-configuración-de-red)
7. [Acceso y Verificación](#7-acceso-y-verificación)
8. [Mantenimiento](#8-mantenimiento)
9. [Solución de Problemas](#9-solución-de-problemas)

---

## **1. Preparación del Servidor**

### **1.1 Requisitos del Sistema**
- **Sistema Operativo:** macOS, Linux o Windows Server
- **RAM:** Mínimo 4GB, recomendado 8GB+
- **Almacenamiento:** 20GB+ disponible
- **Red:** Acceso a la red local con IP estática
- **Procesador:** Dual-core mínimo

### **1.2 Software Requerido**
```bash
# Instalar Node.js (versión 18+)
# macOS
brew install node

# Linux (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 (gestor de procesos)
npm install -g pm2

# Verificar instalaciones
node --version
npm --version
pm2 --version
```

---

## **2. Configuración de Base de Datos**

### **2.1 Instalación de PostgreSQL**

#### **macOS (Homebrew)**
```bash
brew install postgresql
brew services start postgresql
```

#### **Linux (Ubuntu/Debian)**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### **2.2 Configuración de Base de Datos**
```bash
# Acceder a PostgreSQL
sudo -u postgres psql

# Crear usuario y base de datos
CREATE USER cagpu_user WITH PASSWORD 'tu_contraseña_segura';
CREATE DATABASE cagpu_production OWNER cagpu_user;
GRANT ALL PRIVILEGES ON DATABASE cagpu_production TO cagpu_user;
\q
```

### **2.3 Variables de Entorno**
Crear archivo `.env.production` en el servidor:
```env
# ============================================================================
# CONFIGURACIÓN DE PRODUCCIÓN - CAGPU
# ============================================================================

# Base de Datos PostgreSQL
DATABASE_URL="postgresql://cagpu_user:tu_contraseña_segura@localhost:5432/cagpu_production"

# Next.js
NODE_ENV=production
NEXTAUTH_SECRET=tu_secreto_super_seguro_aqui_generar_con_openssl_rand_base64_32
NEXTAUTH_URL=http://IP_SERVIDOR:3000

# Configuración de Red
HOSTNAME=0.0.0.0
PORT=3000

# Configuración de Seguridad
JWT_SECRET=otro_secreto_jwt_seguro_aqui
```

---

## **3. Migración de Datos**

### **3.1 Exportar Base de Datos Actual**
```bash
# Desde tu máquina de desarrollo
# Si usas PostgreSQL
pg_dump -h localhost -U tu_usuario cagpu > backup_cagpu_$(date +%Y%m%d_%H%M%S).sql

# Si usas SQLite (desarrollo)
sqlite3 prisma/dev.db .dump > backup_cagpu_$(date +%Y%m%d_%H%M%S).sql

# Comprimir backup
gzip backup_cagpu_*.sql
```

### **3.2 Transferir Backup al Servidor**
```bash
# Usando SCP
scp backup_cagpu_*.sql.gz usuario@IP_SERVIDOR:/tmp/

# Usando SFTP
sftp usuario@IP_SERVIDOR
put backup_cagpu_*.sql.gz /tmp/
```

### **3.3 Importar en el Servidor**
```bash
# En el servidor
cd /tmp
gunzip backup_cagpu_*.sql.gz

# Importar a PostgreSQL
psql -h localhost -U cagpu_user -d cagpu_production < backup_cagpu_*.sql

# Verificar importación
psql -h localhost -U cagpu_user -d cagpu_production -c "\dt"
```

---

## **4. Despliegue de la Aplicación**

### **4.1 Transferir Código**

#### **Opción 1: Git (Recomendado)**
```bash
# En el servidor
cd /opt
sudo git clone https://tu-repositorio.git cagpu
sudo chown -R $USER:$USER cagpu
cd cagpu
```

#### **Opción 2: SCP/SFTP**
```bash
# Desde tu máquina de desarrollo
scp -r /ruta/local/cagpu usuario@IP_SERVIDOR:/opt/
ssh usuario@IP_SERVIDOR
cd /opt/cagpu
```

### **4.2 Instalación y Construcción**
```bash
# Instalar dependencias
npm install --production

# Construir aplicación
npm run build

# Verificar construcción
ls -la .next/
```

### **4.3 Configuración de Prisma**
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Verificar estado de la base de datos
npx prisma db push

# Verificar conexión
npx prisma studio --port 5555 &
```

---

## **5. Configuración del Servidor**

### **5.1 Archivo de Configuración PM2**
Crear `ecosystem.config.js` en `/opt/cagpu/`:
```javascript
// ============================================================================
// CONFIGURACIÓN PM2 PARA CAGPU
// ============================================================================
module.exports = {
  apps: [{
    name: 'cagpu',
    script: 'npm',
    args: 'start',
    cwd: '/opt/cagpu',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/cagpu/error.log',
    out_file: '/var/log/cagpu/out.log',
    log_file: '/var/log/cagpu/combined.log',
    time: true
  }]
}
```

### **5.2 Directorios de Logs**
```bash
# Crear directorios de logs
sudo mkdir -p /var/log/cagpu
sudo chown -R $USER:$USER /var/log/cagpu
```

### **5.3 Iniciar Aplicación**
```bash
# Iniciar con PM2
pm2 start ecosystem.config.js

# Configurar inicio automático
pm2 startup
pm2 save

# Verificar estado
pm2 status
pm2 logs cagpu
```

---

## **6. Configuración de Red**

### **6.1 Configurar IP Estática**

#### **macOS**
1. Ir a **System Preferences > Network**
2. Seleccionar interfaz de red activa
3. Configurar **Configure IPv4: Manually**
4. Establecer IP: `192.168.1.100`
5. Subnet Mask: `255.255.255.0`
6. Router: `192.168.1.1`

#### **Linux**
```bash
# Editar configuración de red
sudo nano /etc/netplan/01-netcfg.yaml

# Configuración ejemplo:
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: no
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]

# Aplicar configuración
sudo netplan apply
```

### **6.2 Configurar Firewall**

#### **macOS**
```bash
# Permitir puerto 3000
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblock /usr/bin/node
```

#### **Linux (UFW)**
```bash
# Permitir puerto 3000
sudo ufw allow 3000
sudo ufw allow 5555  # Para Prisma Studio
sudo ufw enable
sudo ufw status
```

### **6.3 Configurar DNS Local (Opcional)**
```bash
# En el router o servidor DNS local
# Agregar entrada: cagpu.local -> 192.168.1.100

# O editar /etc/hosts en cada máquina cliente
echo "192.168.1.100 cagpu.local" | sudo tee -a /etc/hosts
```

---

## **7. Acceso y Verificación**

### **7.1 URLs de Acceso**
- **Aplicación Principal:** `http://192.168.1.100:3000`
- **Prisma Studio:** `http://192.168.1.100:5555`
- **Logs PM2:** `pm2 logs cagpu`

### **7.2 Checklist de Verificación**
- [ ] Base de datos migrada y funcionando
- [ ] Aplicación construida y ejecutándose
- [ ] PM2 configurado con auto-reinicio
- [ ] Firewall configurado
- [ ] Acceso desde red local funcionando
- [ ] Logs sin errores críticos
- [ ] Backup automático configurado

### **7.3 Comandos de Verificación**
```bash
# Verificar estado de la aplicación
pm2 status
pm2 logs cagpu --lines 50

# Verificar base de datos
npx prisma db push

# Verificar puertos abiertos
netstat -tlnp | grep :3000
lsof -i :3000

# Verificar logs del sistema
tail -f /var/log/syslog | grep cagpu
```

---

## **8. Mantenimiento**

### **8.1 Scripts de Backup Automático**
Crear `/opt/cagpu/scripts/backup_daily.sh`:
```bash
#!/bin/bash
# ============================================================================
# SCRIPT DE BACKUP DIARIO - CAGPU
# ============================================================================

# Configuración
BACKUP_DIR="/backups/cagpu"
DB_NAME="cagpu_production"
DB_USER="cagpu_user"
RETENTION_DAYS=7

# Crear directorio de backup si no existe
mkdir -p $BACKUP_DIR

# Generar nombre de archivo con timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/cagpu_$TIMESTAMP.sql"

# Realizar backup
echo "Iniciando backup de $DB_NAME..."
pg_dump -h localhost -U $DB_USER $DB_NAME > $BACKUP_FILE

# Comprimir backup
gzip $BACKUP_FILE

# Limpiar backups antiguos
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completado: $BACKUP_FILE.gz"
echo "Backups antiguos eliminados (más de $RETENTION_DAYS días)"
```

### **8.2 Script de Actualización**
Crear `/opt/cagpu/scripts/update_app.sh`:
```bash
#!/bin/bash
# ============================================================================
# SCRIPT DE ACTUALIZACIÓN - CAGPU
# ============================================================================

echo "Iniciando actualización de CAGPU..."

# Cambiar al directorio de la aplicación
cd /opt/cagpu

# Hacer backup antes de actualizar
echo "Creando backup de seguridad..."
./scripts/backup_daily.sh

# Actualizar código desde Git
echo "Actualizando código desde Git..."
git pull origin main

# Instalar dependencias
echo "Instalando dependencias..."
npm install --production

# Construir aplicación
echo "Construyendo aplicación..."
npm run build

# Reiniciar aplicación
echo "Reiniciando aplicación..."
pm2 restart cagpu

echo "Actualización completada exitosamente!"
pm2 status
```

### **8.3 Configurar Cron Jobs**
```bash
# Editar crontab
crontab -e

# Agregar entradas:
# Backup diario a las 2:00 AM
0 2 * * * /opt/cagpu/scripts/backup_daily.sh >> /var/log/cagpu/backup.log 2>&1

# Verificar estado cada hora
0 * * * * pm2 status >> /var/log/cagpu/status.log 2>&1
```

---

## **9. Solución de Problemas**

### **9.1 Problemas Comunes**

#### **Aplicación no inicia**
```bash
# Verificar logs
pm2 logs cagpu --lines 100

# Verificar variables de entorno
cat .env.production

# Verificar puerto
lsof -i :3000

# Reiniciar aplicación
pm2 restart cagpu
```

#### **Error de base de datos**
```bash
# Verificar conexión
npx prisma db push

# Verificar estado de PostgreSQL
sudo systemctl status postgresql

# Verificar logs de PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### **Problemas de red**
```bash
# Verificar IP
ip addr show

# Verificar conectividad
ping 192.168.1.1

# Verificar firewall
sudo ufw status
```

### **9.2 Comandos de Emergencia**
```bash
# Reiniciar aplicación
pm2 restart cagpu

# Reiniciar base de datos
sudo systemctl restart postgresql

# Reiniciar servicios de red
sudo systemctl restart networking

# Ver estado completo
pm2 status
pm2 logs cagpu
sudo systemctl status postgresql
```

### **9.3 Logs y Monitoreo**
```bash
# Logs en tiempo real
pm2 logs cagpu --lines 100 -f

# Monitoreo de recursos
htop
df -h
free -h

# Estado de PM2
pm2 monit
```

---

## **🔧 Comandos Rápidos de Referencia**

### **Gestión de PM2**
```bash
pm2 start ecosystem.config.js    # Iniciar aplicación
pm2 stop cagpu                   # Detener aplicación
pm2 restart cagpu                # Reiniciar aplicación
pm2 status                       # Ver estado
pm2 logs cagpu                   # Ver logs
pm2 monit                        # Monitoreo en tiempo real
```

### **Base de Datos**
```bash
npx prisma generate              # Generar cliente
npx prisma migrate deploy        # Ejecutar migraciones
npx prisma db push               # Sincronizar esquema
npx prisma studio                # Abrir interfaz web
```

### **Sistema**
```bash
sudo systemctl status postgresql # Estado de PostgreSQL
sudo ufw status                  # Estado del firewall
netstat -tlnp | grep :3000      # Verificar puerto
lsof -i :3000                    # Procesos en puerto
```

---

## **📱 Acceso desde Dispositivos**

### **URLs de Acceso:**
- **Aplicación:** `http://192.168.1.100:3000`
- **Prisma Studio:** `http://192.168.1.100:5555`
- **Logs:** `pm2 logs cagpu`

### **Dispositivos Soportados:**
- ✅ Computadoras Windows/macOS/Linux
- ✅ Tablets iOS/Android
- ✅ Smartphones iOS/Android
- ✅ Navegadores web modernos

---

## **📞 Soporte y Contacto**

### **Información del Sistema:**
- **Aplicación:** CAGPU - Catálogo de Atención
- **Versión:** 0.1.0
- **Framework:** Next.js 14.2.16
- **Base de Datos:** PostgreSQL
- **Gestor de Procesos:** PM2

### **Archivos de Configuración Importantes:**
- `ecosystem.config.js` - Configuración PM2
- `.env.production` - Variables de entorno
- `prisma/schema.prisma` - Esquema de base de datos
- `next.config.mjs` - Configuración Next.js

---

## **📝 Notas Importantes**

1. **Seguridad:** Cambiar todas las contraseñas por defecto
2. **Backups:** Configurar backups automáticos diarios
3. **Monitoreo:** Revisar logs regularmente
4. **Actualizaciones:** Mantener sistema operativo actualizado
5. **Red:** Usar IP estática para evitar problemas de conectividad

---

*Última actualización: $(date)*
*Versión del documento: 1.0*
