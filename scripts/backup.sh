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
