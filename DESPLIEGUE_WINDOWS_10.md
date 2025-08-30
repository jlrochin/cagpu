# 🚀 **Guía de Despliegue en Windows 10 - CAGPU**

## **Descripción General**

Esta guía detalla el proceso completo para desplegar la aplicación CAGPU (Catálogo de Atención) en Windows 10, manteniendo todos los datos existentes y configuraciones.

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

- **Sistema Operativo:** Windows 10 Pro/Enterprise (recomendado)
- **RAM:** Mínimo 4GB, recomendado 8GB+
- **Almacenamiento:** 20GB+ disponible
- **Red:** Acceso a la red local con IP estática
- **Procesador:** Dual-core mínimo

### **1.2 Software Requerido**

#### **Instalar Node.js**

1. Descargar desde [nodejs.org](https://nodejs.org/)
2. Instalar versión LTS (18.x o superior)
3. Verificar en PowerShell:

```powershell
node --versionzz
npm --version
```

#### **Instalar PM2**

```powershell
npm install -g pm2
pm2 --version
```

#### **Instalar PostgreSQL**

1. Descargar desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. Ejecutar instalador como administrador
3. Configurar contraseña para usuario `postgres`
4. Mantener puerto por defecto (5432)

---

## **2. Configuración de Base de Datos**

### **2.1 Instalación de PostgreSQL**

#### **Windows 10**

1. Descargar instalador desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. Ejecutar como administrador
3. Configurar contraseña para usuario `postgres`
4. Mantener puerto por defecto (5432)
5. Instalar pgAdmin (opcional pero recomendado)

### **2.2 Configuración de Base de Datos**

```powershell
# Abrir pgAdmin (instalado con PostgreSQL)
# O usar línea de comandos:
cd "C:\Program Files\PostgreSQL\15\bin"
.\psql.exe -U postgres

# Crear usuario y base de datos
CREATE USER cagpu_user WITH PASSWORD 'tu_contraseña_segura';
CREATE DATABASE cagpu_production OWNER cagpu_user;
GRANT ALL PRIVILEGES ON DATABASE cagpu_production TO cagpu_user;
\q
```

### **2.3 Variables de Entorno**

Crear archivo `.env.production` en `C:\cagpu\`:

```env
# ============================================================================
# CONFIGURACIÓN DE PRODUCCIÓN - CAGPU (WINDOWS)
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

```powershell
# Desde tu máquina de desarrollo
# Si usas PostgreSQL
pg_dump -h localhost -U tu_usuario cagpu > backup_cagpu_$(Get-Date -Format "yyyyMMdd_HHmmss").sql

# Si usas SQLite (desarrollo)
sqlite3 prisma/dev.db .dump > backup_cagpu_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

### **3.2 Transferir Backup al Servidor Windows**

```powershell
# Usando SCP (si tienes OpenSSH instalado)
scp backup_cagpu_*.sql usuario@IP_SERVIDOR:C:\temp\

# O copiar manualmente por red
# \\IP_SERVIDOR\C$\temp\
```

### **3.3 Importar en el Servidor Windows**

```powershell
# En el servidor Windows
cd "C:\Program Files\PostgreSQL\15\bin"
.\psql.exe -h localhost -U cagpu_user -d cagpu_production -f C:\temp\backup_cagpu_*.sql

# Verificar importación
.\psql.exe -h localhost -U cagpu_user -d cagpu_production -c "\dt"
```

---

## **4. Despliegue de la Aplicación**

### **4.1 Transferir Código**

#### **Opción 1: Git (Recomendado)**

```powershell
# En el servidor Windows
cd C:\
git clone https://tu-repositorio.git cagpu
cd cagpu
```

#### **Opción 2: Copia Manual**

```powershell
# Crear directorio
mkdir C:\cagpu
cd C:\cagpu

# Copiar archivos desde tu máquina de desarrollo
# Usar explorador de archivos o comandos de red
```

### **4.2 Instalación y Construcción**

```powershell
# Instalar dependencias
npm install --production

# Construir aplicación
npm run build

# Verificar construcción
dir .next
```

### **4.3 Configuración de Prisma**

```powershell
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

Crear `ecosystem.config.js` en `C:\cagpu\`:

```javascript
// ============================================================================
// CONFIGURACIÓN PM2 PARA CAGPU (WINDOWS)
// ============================================================================
module.exports = {
  apps: [
    {
      name: "cagpu",
      script: "npm",
      args: "start",
      cwd: "C:\\cagpu",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      error_file: "C:\\logs\\cagpu\\error.log",
      out_file: "C:\\logs\\cagpu\\out.log",
      log_file: "C:\\logs\\cagpu\\combined.log",
      time: true,
    },
  ],
};
```

### **5.2 Directorios de Logs**

```powershell
# Crear directorios de logs
mkdir C:\logs\cagpu
```

### **5.3 Iniciar Aplicación**

```powershell
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

#### **Windows 10**

1. **Abrir Configuración de Red:**
   - `Win + I` → Red e Internet → Estado → Cambiar opciones del adaptador
2. **Configurar IP:**
   - Clic derecho en adaptador activo → Propiedades
   - Protocolo de Internet versión 4 (TCP/IPv4) → Propiedades
   - Usar la siguiente dirección IP:
     - IP: `192.168.1.100`
     - Máscara de subred: `255.255.255.0`
     - Puerta de enlace: `192.168.1.1`
     - DNS: `8.8.8.8`

### **6.2 Configurar Firewall de Windows**

```powershell
# Permitir puerto 3000
netsh advfirewall firewall add rule name="CAGPU App" dir=in action=allow protocol=TCP localport=3000

# Permitir puerto 5555 (Prisma Studio)
netsh advfirewall firewall add rule name="CAGPU Prisma" dir=in action=allow protocol=TCP localport=5555

# Verificar reglas
netsh advfirewall firewall show rule name="CAGPU*"
```

### **6.3 Configurar DNS Local (Opcional)**

```powershell
# Editar C:\Windows\System32\drivers\etc\hosts como administrador
# Agregar línea:
# 192.168.1.100 cagpu.local
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

```powershell
# Verificar estado de la aplicación
pm2 status
pm2 logs cagpu --lines 50

# Verificar base de datos
npx prisma db push

# Verificar puertos abiertos
netstat -an | findstr :3000

# Verificar procesos
tasklist | findstr node
```

---

## **8. Mantenimiento**

### **8.1 Scripts de Backup Automático**

Crear `C:\cagpu\scripts\backup_daily.bat`:

```batch
@echo off
REM ============================================================================
REM SCRIPT DE BACKUP DIARIO - CAGPU (WINDOWS)
REM ============================================================================

set BACKUP_DIR=C:\backups\cagpu
set DB_NAME=cagpu_production
set DB_USER=cagpu_user
set RETENTION_DAYS=7

REM Crear directorio de backup si no existe
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM Generar nombre de archivo con timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "datestamp=%YYYY%%MM%%DD%_%HH%%Min%%Sec%"

set BACKUP_FILE=%BACKUP_DIR%\cagpu_%datestamp%.sql

REM Realizar backup
echo Iniciando backup de %DB_NAME%...
"C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" -h localhost -U %DB_USER% %DB_NAME% > "%BACKUP_FILE%"

echo Backup completado: %BACKUP_FILE%
```

### **8.2 Script de Actualización**

Crear `C:\cagpu\scripts\update_app.bat`:

```batch
@echo off
REM ============================================================================
REM SCRIPT DE ACTUALIZACIÓN - CAGPU (WINDOWS)
REM ============================================================================

echo Iniciando actualización de CAGPU...

REM Cambiar al directorio de la aplicación
cd /d C:\cagpu

REM Hacer backup antes de actualizar
echo Creando backup de seguridad...
call scripts\backup_daily.bat

REM Actualizar código desde Git
echo Actualizando código desde Git...
git pull origin main

REM Instalar dependencias
echo Instalando dependencias...
npm install --production

REM Construir aplicación
echo Construyendo aplicación...
npm run build

REM Reiniciar aplicación
echo Reiniciando aplicación...
pm2 restart cagpu

echo Actualización completada exitosamente!
pm2 status
pause
```

### **8.3 Configurar Tareas Programadas**

1. **Abrir Programador de tareas:**
   - `Win + R` → `taskschd.msc`
2. **Crear tarea básica:**
   - Nombre: "CAGPU Backup Diario"
   - Frecuencia: Diaria
   - Acción: Iniciar programa
   - Programa: `C:\cagpu\scripts\backup_daily.bat`
   - Hora: 2:00 AM

---

## **9. Solución de Problemas**

### **9.1 Problemas Comunes**

#### **Aplicación no inicia**

```powershell
# Verificar logs
pm2 logs cagpu --lines 100

# Verificar variables de entorno
Get-Content .env.production

# Verificar puerto
netstat -an | findstr :3000

# Reiniciar aplicación
pm2 restart cagpu
```

#### **Error de base de datos**

```powershell
# Verificar conexión
npx prisma db push

# Verificar estado de PostgreSQL
Get-Service postgresql*

# Verificar logs de PostgreSQL
Get-Content "C:\Program Files\PostgreSQL\15\data\pg_log\postgresql-*.log" | Select-Object -Last 50
```

#### **Problemas de red**

```powershell
# Verificar IP
ipconfig /all

# Verificar conectividad
ping 192.168.1.1

# Verificar firewall
netsh advfirewall show allprofiles
```

### **9.2 Comandos de Emergencia**

```powershell
# Reiniciar aplicación
pm2 restart cagpu

# Reiniciar base de datos
Restart-Service postgresql*

# Reiniciar servicios de red
Restart-Service -Name "Netman"

# Ver estado completo
pm2 status
pm2 logs cagpu
Get-Service postgresql*
```

### **9.3 Logs y Monitoreo**

```powershell
# Logs en tiempo real
pm2 logs cagpu --lines 100 -f

# Monitoreo de recursos
Get-Process | Where-Object {$_.ProcessName -like "*node*"}

# Estado de PM2
pm2 monit
```

---

## **🔧 Comandos Rápidos de Referencia**

### **Gestión de PM2**

```powershell
pm2 start ecosystem.config.js    # Iniciar aplicación
pm2 stop cagpu                   # Detener aplicación
pm2 restart cagpu                # Reiniciar aplicación
pm2 status                       # Ver estado
pm2 logs cagpu                   # Ver logs
pm2 monit                        # Monitoreo en tiempo real
```

### **Base de Datos**

```powershell
npx prisma generate              # Generar cliente
npx prisma migrate deploy        # Ejecutar migraciones
npx prisma db push               # Sincronizar esquema
npx prisma studio                # Abrir interfaz web
```

### **Sistema Windows**

```powershell
Get-Service postgresql*          # Estado de PostgreSQL
netsh advfirewall show allprofiles # Estado del firewall
netstat -an | findstr :3000      # Verificar puerto
tasklist | findstr node          # Procesos Node.js
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
- **Sistema Operativo:** Windows 10

### **Archivos de Configuración Importantes:**

- `ecosystem.config.js` - Configuración PM2
- `.env.production` - Variables de entorno
- `prisma/schema.prisma` - Esquema de base de datos
- `next.config.mjs` - Configuración Next.js

---

## **📝 Notas Importantes para Windows 10**

1. **Ejecutar como Administrador:** Muchos comandos requieren privilegios de administrador
2. **Antivirus:** Configurar excepciones para Node.js y la aplicación
3. **Windows Defender:** Permitir la aplicación en el firewall
4. **Servicios:** Configurar PostgreSQL para inicio automático
5. **Rutas:** Usar rutas absolutas en configuraciones (C:\cagpu\)
6. **Backups:** Programar tareas con el Programador de tareas de Windows
7. **Permisos:** Verificar permisos de escritura en directorios de logs
8. **Servicios:** Configurar PM2 como servicio de Windows

---

## **🚨 Solución de Problemas Específicos de Windows**

### **Error de Permisos**

```powershell
# Ejecutar PowerShell como administrador
# Verificar permisos en directorios
icacls C:\cagpu /grant "Users":(OI)(CI)F
icacls C:\logs /grant "Users":(OI)(CI)F
```

### **Problemas con PM2 en Windows**

```powershell
# Reinstalar PM2 globalmente
npm uninstall -g pm2
npm install -g pm2

# Configurar PM2 para Windows
pm2 install pm2-windows-startup
pm2 startup
pm2 save
```

### **Problemas de Puerto en Uso**

```powershell
# Ver qué proceso usa el puerto 3000
netstat -ano | findstr :3000

# Terminar proceso específico
taskkill /PID [PID_NUMBER] /F
```

---

_Última actualización: $(Get-Date)_
_Versión del documento: 1.0_
_Sistema objetivo: Windows 10_
