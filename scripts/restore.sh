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
