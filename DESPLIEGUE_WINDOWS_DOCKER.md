# 🚀 Despliegue de CAGPU en Windows con Docker

## **Descripción**
Guía completa para desplegar CAGPU en Windows usando Docker Desktop, incluyendo instalación desde cero.

## **📋 Prerrequisitos**

### **Requisitos del Sistema**
- Windows 10/11 (64-bit)
- Mínimo 4GB RAM (recomendado 8GB)
- 20GB de espacio libre en disco
- Procesador compatible con virtualización

### **Verificar Virtualización**
1. Abre **Administrador de tareas** (Ctrl + Shift + Esc)
2. Ve a la pestaña **Rendimiento**
3. En **CPU**, verifica que aparezca "Virtualización: Habilitada"
4. Si no está habilitada, activa en BIOS/UEFI

## **🔧 Instalación de Docker Desktop**

### **1. Descargar Docker Desktop**
1. Ve a [docker.com/products/docker-desktop](https://docker.com/products/docker-desktop)
2. Haz clic en **"Download for Windows"**
3. Descarga el instalador `.exe`

### **2. Instalar Docker Desktop**
1. **Ejecuta** el archivo descargado como administrador
2. **Acepta** los términos de licencia
3. **Selecciona** "Use WSL 2 instead of Hyper-V" (recomendado)
4. **Haz clic** en "Install"
5. **Espera** a que termine la instalación
6. **Reinicia** tu computadora

### **3. Configurar Docker Desktop**
1. **Abre** Docker Desktop
2. **Acepta** los términos de servicio
3. **Espera** a que termine la inicialización
4. Verifica que aparezca "Docker Desktop is running" en la bandeja del sistema

## **📥 Descargar el Proyecto CAGPU**

### **Opción 1: Clonar desde GitHub (Recomendado)**
```bash
# Abre PowerShell o Command Prompt
git clone https://github.com/jlrochin/cagpu.git
cd cagpu
```

### **Opción 2: Descargar ZIP**
1. Ve a [github.com/jlrochin/cagpu](https://github.com/jlrochin/cagpu)
2. Haz clic en **"Code"** → **"Download ZIP"**
3. **Extrae** el archivo en `C:\cagpu`
4. **Abre** PowerShell en esa carpeta

## **🚀 Desplegar con Docker Compose**

### **1. Verificar Docker**
```bash
# Verificar que Docker esté funcionando
docker --version
docker-compose --version
```

### **2. Configurar Variables de Entorno**
Crea un archivo `.env` en la carpeta del proyecto:

```bash
# En PowerShell
New-Item -Path ".env" -ItemType File
```

Edita el archivo `.env` con este contenido:

```env
# ============================================================================
# CONFIGURACIÓN DE CAGPU PARA WINDOWS
# ============================================================================

# Base de datos PostgreSQL
DATABASE_URL="postgresql://cagpu_user:cagpu_password@localhost:5432/cagpu_db"

# Next.js
NODE_ENV=production
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-super-seguro-para-windows

# Configuración de la aplicación
APP_NAME=CAGPU
APP_VERSION=1.0.0

# Configuración de Docker
POSTGRES_USER=cagpu_user
POSTGRES_PASSWORD=cagpu_password
POSTGRES_DB=cagpu_db
```

### **3. Construir y Desplegar**
```bash
# Construir las imágenes
docker-compose build

# Desplegar los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f
```

### **4. Verificar el Despliegue**
```bash
# Ver servicios activos
docker-compose ps

# Ver logs de la aplicación
docker-compose logs app

# Ver logs de la base de datos
docker-compose logs postgres
```

## **🌐 Acceder a la Aplicación**

### **URLs de Acceso**
- **Aplicación Web**: http://localhost:3000
- **Base de Datos**: localhost:5432
- **Adminer (opcional)**: http://localhost:8080

### **Credenciales por Defecto**
- **Usuario Admin**: admin@cagpu.local
- **Contraseña**: admin123

## **🔧 Comandos Útiles**

### **Gestión de Contenedores**
```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Ver logs
docker-compose logs -f

# Ver estado
docker-compose ps
```

### **Base de Datos**
```bash
# Acceder a PostgreSQL
docker-compose exec postgres psql -U cagpu_user -d cagpu_db

# Ejecutar migraciones
docker-compose exec app npx prisma migrate deploy

# Generar cliente Prisma
docker-compose exec app npx prisma generate
```

### **Backup y Restore**
```bash
# Crear backup
docker-compose exec postgres pg_dump -U cagpu_user cagpu_db > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U cagpu_user -d cagpu_db < backup.sql
```

## **🚨 Solución de Problemas**

### **Error: Docker no está ejecutándose**
1. Abre Docker Desktop
2. Espera a que termine la inicialización
3. Verifica que aparezca el ícono de Docker en la bandeja

### **Error: Puerto ya en uso**
```bash
# Ver qué está usando el puerto
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Terminar proceso (reemplaza PID con el número)
taskkill /PID PID /F
```

### **Error: Permisos de Docker**
1. Ejecuta PowerShell como **Administrador**
2. O agrega tu usuario al grupo "docker-users"

### **Error: WSL 2 no disponible**
1. Instala WSL 2: `wsl --install`
2. Reinicia la computadora
3. Configura Docker para usar WSL 2

### **Error: Memoria insuficiente**
1. Abre Docker Desktop
2. Ve a Settings → Resources
3. Aumenta la memoria asignada (mínimo 4GB)

## **📊 Monitoreo**

### **Recursos del Sistema**
```bash
# Ver uso de recursos
docker stats

# Ver espacio en disco
docker system df
```

### **Logs de la Aplicación**
```bash
# Ver logs en tiempo real
docker-compose logs -f app

# Ver logs de errores
docker-compose logs app | findstr ERROR
```

## **🔄 Actualizaciones**

### **Actualizar la Aplicación**
```bash
# Detener servicios
docker-compose down

# Obtener cambios del repositorio
git pull origin main

# Reconstruir y desplegar
docker-compose build --no-cache
docker-compose up -d
```

### **Limpiar Recursos**
```bash
# Limpiar imágenes no utilizadas
docker image prune -a

# Limpiar contenedores detenidos
docker container prune

# Limpiar todo
docker system prune -a
```

## **🔒 Seguridad**

### **Cambiar Contraseñas por Defecto**
1. Accede a la aplicación
2. Ve a Configuración → Usuarios
3. Cambia la contraseña del admin
4. Actualiza las variables de entorno

### **Firewall**
- Asegúrate de que los puertos 3000 y 5432 estén abiertos
- Considera usar un firewall para restringir acceso

## **📞 Soporte**

### **Comandos de Diagnóstico**
```bash
# Información del sistema
docker version
docker info

# Estado de los servicios
docker-compose ps
docker-compose logs

# Verificar conectividad
docker-compose exec app ping postgres
```

### **Enlaces Útiles**
- [Docker Desktop para Windows](https://docs.docker.com/desktop/install/windows/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Repositorio CAGPU](https://github.com/jlrochin/cagpu)

---

**¡Tu aplicación CAGPU estará funcionando en Windows en minutos! 🎉**
