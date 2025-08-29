# Mantenimiento y Operaciones - Sistema CAGPU

## Visión General

Esta sección documenta las operaciones de mantenimiento del sistema CAGPU, incluyendo scripts de mantenimiento, limpieza de datos, respaldo y restauración, y troubleshooting común.

## Scripts de Mantenimiento

### 1. Limpieza de Datos Duplicados

```javascript
// scripts/clean-duplicates.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function cleanDuplicateUsers() {
  console.log("🧹 Limpiando usuarios duplicados...");

  // Encontrar usuarios duplicados por email
  const duplicates = await prisma.$queryRaw`
    SELECT email, COUNT(*) as count
    FROM users
    GROUP BY email
    HAVING COUNT(*) > 1
  `;

  for (const dup of duplicates) {
    const users = await prisma.user.findMany({
      where: { email: dup.email },
      orderBy: { createdAt: "asc" },
    });

    // Mantener el usuario más antiguo, eliminar los demás
    for (let i = 1; i < users.length; i++) {
      await prisma.user.delete({
        where: { id: users[i].id },
      });
      console.log(`❌ Usuario duplicado eliminado: ${users[i].email}`);
    }
  }

  console.log("✅ Limpieza de duplicados completada");
}

async function main() {
  try {
    await cleanDuplicateUsers();
  } catch (error) {
    console.error("❌ Error durante la limpieza:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

### 2. Verificación de Integridad de Datos

```javascript
// scripts/verify-data-integrity.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function verifyDataIntegrity() {
  console.log("🔍 Verificando integridad de datos...");

  // Verificar usuarios sin departamento
  const usersWithoutDept = await prisma.user.findMany({
    where: { department: null },
  });

  if (usersWithoutDept.length > 0) {
    console.log(`⚠️ ${usersWithoutDept.length} usuarios sin departamento`);
  }

  // Verificar servicios sin dirección
  const servicesWithoutDirection = await prisma.service.findMany({
    where: { directionId: null },
  });

  if (servicesWithoutDirection.length > 0) {
    console.log(
      `⚠️ ${servicesWithoutDirection.length} servicios sin dirección`
    );
  }

  // Verificar notificaciones huérfanas
  const orphanNotifications = await prisma.notification.findMany({
    where: {
      OR: [
        { userId: null, serviceId: null },
        { userId: { not: null }, user: null },
        { serviceId: { not: null }, service: null },
      ],
    },
  });

  if (orphanNotifications.length > 0) {
    console.log(`⚠️ ${orphanNotifications.length} notificaciones huérfanas`);
  }

  console.log("✅ Verificación de integridad completada");
}

async function main() {
  try {
    await verifyDataIntegrity();
  } catch (error) {
    console.error("❌ Error durante la verificación:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

### 3. Optimización de Base de Datos

```javascript
// scripts/optimize-database.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function optimizeDatabase() {
  console.log("⚡ Optimizando base de datos...");

  // Actualizar contadores de servicios por dirección
  const directions = await prisma.direction.findMany();

  for (const direction of directions) {
    const serviceCount = await prisma.service.count({
      where: { directionId: direction.id, isActive: true },
    });

    await prisma.direction.update({
      where: { id: direction.id },
      data: { servicesCount: serviceCount },
    });

    console.log(`📊 Dirección ${direction.name}: ${serviceCount} servicios`);
  }

  // Limpiar logs antiguos (más de 90 días)
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);

  const deletedAuditLogs = await prisma.auditLog.deleteMany({
    where: { createdAt: { lt: cutoffDate } },
  });

  const deletedChangeHistory = await prisma.userChangeHistory.deleteMany({
    where: { createdAt: { lt: cutoffDate } },
  });

  console.log(`🗑️ ${deletedAuditLogs.count} logs de auditoría eliminados`);
  console.log(
    `🗑️ ${deletedChangeHistory.count} entradas de historial eliminadas`
  );

  console.log("✅ Optimización de base de datos completada");
}

async function main() {
  try {
    await optimizeDatabase();
  } catch (error) {
    console.error("❌ Error durante la optimización:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

## Respaldo y Restauración

### 1. Script de Respaldo Automático

```bash
#!/bin/bash
# scripts/auto-backup.sh

DB_NAME="cagpu"
BACKUP_DIR="/var/backups/cagpu"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

echo "💾 Iniciando respaldo automático..."

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Backup de base de datos
echo "🗄️ Respaldando base de datos..."
pg_dump -h localhost -U postgres $DB_NAME > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Backup de archivos de la aplicación
echo "📁 Respaldando archivos de la aplicación..."
tar -czf "$BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz" -C /var/www/cagpu .

# Verificar integridad del backup
echo "🔍 Verificando integridad del backup..."
if pg_restore --list "$BACKUP_DIR/db_backup_$TIMESTAMP.sql" > /dev/null 2>&1; then
    echo "✅ Backup de base de datos verificado"
else
    echo "❌ Error en backup de base de datos"
    rm "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
    exit 1
fi

# Limpiar backups antiguos
echo "🧹 Limpiando backups antiguos..."
find $BACKUP_DIR -name "*.sql" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Comprimir backup de base de datos
echo "🗜️ Comprimiendo backup de base de datos..."
gzip "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

echo "✅ Respaldo automático completado: $BACKUP_DIR"
echo "📊 Tamaño total: $(du -sh $BACKUP_DIR | cut -f1)"
```

### 2. Script de Restauración Selectiva

```bash
#!/bin/bash
# scripts/selective-restore.sh

if [ $# -lt 2 ]; then
    echo "Uso: $0 <tipo> <archivo> [opciones]"
    echo "Tipos: db, app, full"
    echo "Ejemplo: $0 db backup_20241201_120000.sql.gz"
    exit 1
fi

RESTORE_TYPE=$1
BACKUP_FILE=$2
DB_NAME="cagpu"
BACKUP_DIR="/var/backups/cagpu"
FULL_BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

echo "🔄 Iniciando restauración selectiva: $RESTORE_TYPE"

# Verificar que el archivo existe
if [ ! -f "$FULL_BACKUP_PATH" ]; then
    echo "❌ Archivo de backup no encontrado: $FULL_BACKUP_PATH"
    exit 1
fi

case $RESTORE_TYPE in
    "db")
        echo "🗄️ Restaurando solo base de datos..."

        # Detener aplicación
        sudo systemctl stop cagpu

        # Restaurar base de datos
        if [[ $BACKUP_FILE == *.gz ]]; then
            gunzip -c "$FULL_BACKUP_PATH" | psql -h localhost -U postgres -d $DB_NAME
        else
            psql -h localhost -U postgres -d $DB_NAME < "$FULL_BACKUP_PATH"
        fi

        # Reiniciar aplicación
        sudo systemctl start cagpu
        ;;

    "app")
        echo "📁 Restaurando solo archivos de la aplicación..."

        # Detener aplicación
        sudo systemctl stop cagpu

        # Restaurar archivos
        tar -xzf "$FULL_BACKUP_PATH" -C /var/www/cagpu

        # Instalar dependencias
        cd /var/www/cagpu
        pnpm install --prod

        # Reiniciar aplicación
        sudo systemctl start cagpu
        ;;

    "full")
        echo "🔄 Restauración completa..."

        # Detener aplicación
        sudo systemctl stop cagpu

        # Restaurar base de datos
        if [[ $BACKUP_FILE == *.gz ]]; then
            gunzip -c "$FULL_BACKUP_PATH" | psql -h localhost -U postgres -d $DB_NAME
        else
            psql -h localhost -U postgres -d $DB_NAME < "$FULL_BACKUP_PATH"
        fi

        # Restaurar archivos
        tar -xzf "$BACKUP_DIR/app_backup_${BACKUP_FILE%.*}.tar.gz" -C /var/www/cagpu

        # Instalar dependencias y reiniciar
        cd /var/www/cagpu
        pnpm install --prod
        sudo systemctl start cagpu
        ;;

    *)
        echo "❌ Tipo de restauración no válido: $RESTORE_TYPE"
        exit 1
        ;;
esac

echo "✅ Restauración completada"
```

## Troubleshooting

### 1. Problemas Comunes de Base de Datos

```bash
#!/bin/bash
# scripts/troubleshoot-db.sh

echo "🔍 Diagnóstico de problemas de base de datos..."

# Verificar conexión
echo "📡 Verificando conexión a la base de datos..."
if pg_isready -h localhost -U postgres; then
    echo "✅ Conexión a base de datos exitosa"
else
    echo "❌ Error de conexión a base de datos"
    echo "Verificar:"
    echo "  - Servicio PostgreSQL ejecutándose"
    echo "  - Credenciales correctas"
    echo "  - Puerto 5432 abierto"
fi

# Verificar espacio en disco
echo "💾 Verificando espacio en disco..."
df -h /var/lib/postgresql

# Verificar logs de PostgreSQL
echo "📋 Últimos errores de PostgreSQL:"
sudo tail -n 20 /var/log/postgresql/postgresql-*.log | grep -i error

# Verificar conexiones activas
echo "🔗 Conexiones activas:"
psql -h localhost -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Verificar locks
echo "🔒 Locks activos:"
psql -h localhost -U postgres -c "SELECT * FROM pg_locks WHERE NOT granted;"
```

### 2. Problemas de Aplicación

```bash
#!/bin/bash
# scripts/troubleshoot-app.sh

echo "🔍 Diagnóstico de problemas de la aplicación..."

# Verificar estado del servicio
echo "📊 Estado del servicio CAGPU:"
sudo systemctl status cagpu

# Verificar logs de la aplicación
echo "📋 Últimos logs de la aplicación:"
sudo journalctl -u cagpu -n 50 --no-pager

# Verificar puerto
echo "🔌 Verificando puerto 3000:"
netstat -tlnp | grep :3000

# Verificar memoria
echo "🧠 Uso de memoria:"
free -h

# Verificar procesos Node.js
echo "🟢 Procesos Node.js:"
ps aux | grep node

# Verificar archivos de la aplicación
echo "📁 Verificando archivos de la aplicación:"
ls -la /var/www/cagpu/
```

### 3. Script de Recuperación Automática

```bash
#!/bin/bash
# scripts/auto-recovery.sh

echo "🚨 Iniciando recuperación automática..."

# Verificar si la aplicación responde
if curl -f http://localhost:3000/api/ping > /dev/null 2>&1; then
    echo "✅ La aplicación está funcionando correctamente"
    exit 0
fi

echo "❌ La aplicación no responde, iniciando recuperación..."

# Intentar reiniciar el servicio
echo "🔄 Reiniciando servicio..."
sudo systemctl restart cagpu

# Esperar y verificar
sleep 10
if curl -f http://localhost:3000/api/ping > /dev/null 2>&1; then
    echo "✅ Recuperación exitosa - servicio reiniciado"
    exit 0
fi

# Si el reinicio no funciona, verificar base de datos
echo "🗄️ Verificando base de datos..."
if pg_isready -h localhost -U postgres; then
    echo "✅ Base de datos funcionando"
else
    echo "❌ Problema con la base de datos"
    sudo systemctl restart postgresql
    sleep 5
fi

# Último intento de reinicio
echo "🔄 Último intento de reinicio..."
sudo systemctl restart cagpu
sleep 15

if curl -f http://localhost:3000/api/ping > /dev/null 2>&1; then
    echo "✅ Recuperación exitosa"
else
    echo "❌ Recuperación fallida - intervención manual requerida"
    exit 1
fi
```

## Monitoreo de Performance

### 1. Script de Métricas del Sistema

```bash
#!/bin/bash
# scripts/system-metrics.sh

echo "📊 Métricas del Sistema CAGPU - $(date)"

# CPU
echo "🖥️ CPU:"
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}'

# Memoria
echo "🧠 Memoria:"
free -h | grep Mem | awk '{print $3"/"$2}'

# Disco
echo "💾 Disco:"
df -h / | awk 'NR==2 {print $5}'

# Red
echo "🌐 Red:"
netstat -i | grep -E "(eth0|wlan0)" | awk '{print $3"/"$2}'

# Procesos de la aplicación
echo "🟢 Procesos CAGPU:"
ps aux | grep cagpu | grep -v grep | wc -l

# Conexiones de base de datos
echo "🗄️ Conexiones DB:"
psql -h localhost -U postgres -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null || echo "N/A"

# Uptime
echo "⏱️ Uptime:"
uptime -p
```

### 2. Script de Alertas

```bash
#!/bin/bash
# scripts/check-alerts.sh

THRESHOLD_CPU=80
THRESHOLD_MEMORY=85
THRESHOLD_DISK=90

echo "🚨 Verificando alertas del sistema..."

# Verificar CPU
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
if (( $(echo "$CPU_USAGE > $THRESHOLD_CPU" | bc -l) )); then
    echo "⚠️ ALERTA: CPU alto: ${CPU_USAGE}%"
fi

# Verificar memoria
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [ $MEMORY_USAGE -gt $THRESHOLD_MEMORY ]; then
    echo "⚠️ ALERTA: Memoria alta: ${MEMORY_USAGE}%"
fi

# Verificar disco
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt $THRESHOLD_DISK ]; then
    echo "⚠️ ALERTA: Disco alto: ${DISK_USAGE}%"
fi

# Verificar aplicación
if ! curl -f http://localhost:3000/api/ping > /dev/null 2>&1; then
    echo "🚨 ALERTA CRÍTICA: La aplicación no responde"
fi

# Verificar base de datos
if ! pg_isready -h localhost -U postgres > /dev/null 2>&1; then
    echo "🚨 ALERTA CRÍTICA: Base de datos no responde"
fi
```

## Mantenimiento Programado

### 1. Script de Mantenimiento Nocturno

```bash
#!/bin/bash
# scripts/nightly-maintenance.sh

echo "🌙 Iniciando mantenimiento nocturno..."

# Crear backup
echo "💾 Creando backup nocturno..."
./scripts/auto-backup.sh

# Limpiar logs antiguos
echo "🧹 Limpiando logs antiguos..."
find /var/log -name "*.log" -mtime +7 -delete
find /var/log -name "*.gz" -mtime +30 -delete

# Optimizar base de datos
echo "⚡ Optimizando base de datos..."
node scripts/optimize-database.js

# Limpiar cache
echo "🗑️ Limpiando cache..."
rm -rf /tmp/*
rm -rf /var/www/cagpu/.next/cache/*

# Verificar integridad
echo "🔍 Verificando integridad de datos..."
node scripts/verify-data-integrity.js

# Reiniciar servicios
echo "🔄 Reiniciando servicios..."
sudo systemctl restart cagpu

echo "✅ Mantenimiento nocturno completado"
```

### 2. Cron Jobs

```bash
# /etc/crontab
# Backup diario a las 2:00 AM
0 2 * * * root /var/www/cagpu/scripts/auto-backup.sh

# Mantenimiento nocturno a las 3:00 AM
0 3 * * * root /var/www/cagpu/scripts/nightly-maintenance.sh

# Verificación de alertas cada 5 minutos
*/5 * * * * root /var/www/cagpu/scripts/check-alerts.sh

# Métricas del sistema cada hora
0 * * * * root /var/www/cagpu/scripts/system-metrics.sh

# Limpieza de logs semanal (domingo a las 4:00 AM)
0 4 * * 0 root /var/www/cagpu/scripts/clean-logs.sh
```

## Próximas Mejoras

### 1. Automatización Avanzada

- Auto-scaling basado en métricas
- Recuperación automática de fallos
- Predicción de problemas

### 2. Monitoreo Inteligente

- Machine Learning para detección de anomalías
- Alertas predictivas
- Dashboard de métricas en tiempo real

### 3. DevOps Avanzado

- Pipeline de CI/CD completo
- Infraestructura como código
- Monitoreo distribuido
