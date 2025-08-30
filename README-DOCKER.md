# 🐳 **CAGPU - Despliegue con Docker**

## **Descripción**

Este directorio contiene todos los archivos necesarios para desplegar CAGPU usando Docker en tu red local.

---

## **📁 Estructura de Archivos**

```
├── Dockerfile                    # Imagen de la aplicación
├── docker-compose.yml           # Orquestación de servicios
├── env.docker                   # Variables de entorno (renombrar a .env.docker)
├── docker/
│   ├── postgres/
│   │   └── init.sql            # Script de inicialización de BD
│   └── nginx/
│       └── nginx.conf          # Configuración de Nginx
├── scripts/
│   ├── backup.sh               # Script de backup
│   └── restore.sh              # Script de restauración
├── start-cagpu.sh              # Script de inicio (Linux/macOS)
├── start-cagpu.ps1             # Script de inicio (Windows)
└── README-DOCKER.md            # Este archivo
```

---

## **🚀 Inicio Rápido**

### **1. Configurar IP Estática**

```bash
# Configurar tu máquina con IP: 10.18.0.100
# Ver guía completa en DESPLIEGUE_DOCKER_LOCAL.md
```

### **2. Configurar Variables de Entorno**

```bash
# Renombrar env.docker a .env.docker
mv env.docker .env.docker

# Editar .env.docker y cambiar las contraseñas
nano .env.docker
```

### **3. Ejecutar (Linux/macOS)**

```bash
# Dar permisos de ejecución
chmod +x start-cagpu.sh

# Ejecutar
./start-cagpu.sh
```

### **4. Ejecutar (Windows)**

```powershell
# Ejecutar como administrador
.\start-cagpu.ps1
```

---

## **📱 URLs de Acceso**

### **Desde tu máquina:**

- **Aplicación:** `http://localhost:3000`
- **Nginx:** `http://localhost:80`
- **Prisma Studio:** `http://localhost:5555`

### **Desde la red local:**

- **Aplicación:** `http://10.18.0.100:3000`
- **Nginx:** `http://10.18.0.100:80`
- **Prisma Studio:** `http://10.18.0.100:5555`

---

## **🔧 Comandos Útiles**

### **Gestión de Servicios**

```bash
# Iniciar
docker-compose up -d

# Detener
docker-compose down

# Reiniciar
docker-compose restart

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f
```

### **Base de Datos**

```bash
# Ejecutar migraciones
docker-compose exec app npx prisma migrate deploy

# Verificar estado
docker-compose exec app npx prisma db push

# Abrir Prisma Studio
docker-compose exec app npx prisma studio --hostname 0.0.0.0 --port 5555
```

### **Backup y Restauración**

```bash
# Crear backup
./scripts/backup.sh

# Restaurar backup
./scripts/restore.sh backups/archivo_backup.sql
```

---

## **⚠️ Configuración Importante**

### **1. Cambiar Contraseñas**

Editar `env.docker` y cambiar:

- `DB_PASSWORD`
- `NEXTAUTH_SECRET`
- `JWT_SECRET`

### **2. Configurar IP Estática**

Tu máquina debe tener IP: `10.18.0.100`

### **3. Configurar Firewall**

Permitir puertos: 3000, 5555, 80

---

## **🚨 Solución de Problemas**

### **Contenedor no inicia**

```bash
# Ver logs
docker-compose logs [servicio]

# Verificar variables de entorno
docker-compose exec [servicio] env
```

### **Error de base de datos**

```bash
# Verificar estado
docker-compose exec postgres pg_isready -U cagpu_user

# Ver logs
docker-compose logs postgres
```

### **Problemas de red**

```bash
# Verificar puertos
netstat -tlnp | grep :3000

# Verificar conectividad
ping 192.168.1.100
```

---

## **📊 Monitoreo**

### **Ver recursos en tiempo real**

```bash
docker stats
```

### **Ver logs de todos los servicios**

```bash
docker-compose logs -f --tail=50
```

---

## **🔄 Actualización**

### **Actualizar aplicación**

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

---

## **📞 Soporte**

- **Documentación completa:** `DESPLIEGUE_DOCKER_LOCAL.md`
- **Guía Windows:** `DESPLIEGUE_WINDOWS_10.md`
- **Logs:** `docker-compose logs -f`

---

_¡CAGPU está listo para usar en tu red local! 🎉_
