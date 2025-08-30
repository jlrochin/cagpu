#!/bin/bash
# ============================================================================
# SCRIPT DE MIGRACIÓN DE DATOS - CAGPU DOCKER
# ============================================================================

echo "🔄 Iniciando migración de datos a Docker..."
echo "============================================="

# Verificar que Docker esté ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está ejecutándose"
    exit 1
fi

echo "📋 Opciones de migración:"
echo "1. Migrar desde SQLite (desarrollo)"
echo "2. Migrar desde PostgreSQL local"
echo "3. Migrar desde archivo SQL existente"
echo "4. Solo crear estructura (sin datos)"

read -p "Selecciona una opción (1-4): " choice

case $choice in
    1)
        echo "🔄 Migrando desde SQLite..."
        if [ -f "prisma/dev.db" ]; then
            echo "📁 Archivo SQLite encontrado en prisma/dev.db"
            echo "💾 Exportando datos..."
            sqlite3 prisma/dev.db .dump > temp_migration.sql
            echo "✅ Datos exportados a temp_migration.sql"
        else
            echo "❌ No se encontró prisma/dev.db"
            exit 1
        fi
        ;;
    2)
        echo "🔄 Migrando desde PostgreSQL local..."
        read -p "Usuario PostgreSQL: " pg_user
        read -p "Base de datos: " pg_db
        echo "💾 Exportando datos..."
        pg_dump -h localhost -U $pg_user $pg_db > temp_migration.sql
        echo "✅ Datos exportados a temp_migration.sql"
        ;;
    3)
        echo "🔄 Migrando desde archivo SQL existente..."
        read -p "Ruta del archivo SQL: " sql_file
        if [ -f "$sql_file" ]; then
            cp "$sql_file" temp_migration.sql
            echo "✅ Archivo copiado como temp_migration.sql"
        else
            echo "❌ Archivo no encontrado"
            exit 1
        fi
        ;;
    4)
        echo "🔄 Solo creando estructura..."
        echo "✅ No se migrarán datos existentes"
        exit 0
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

# Verificar que el archivo de migración existe
if [ -f "temp_migration.sql" ]; then
    echo ""
    echo "🚀 Iniciando servicios Docker..."
    docker-compose up -d postgres
    
    echo "⏳ Esperando a que PostgreSQL esté listo..."
    sleep 15
    
    echo "🔄 Importando datos..."
    docker-compose exec -T postgres psql -U cagpu_user -d cagpu_production < temp_migration.sql
    
    if [ $? -eq 0 ]; then
        echo "✅ Migración completada exitosamente!"
        echo "🧹 Limpiando archivo temporal..."
        rm temp_migration.sql
    else
        echo "❌ Error durante la migración"
        echo "📁 Archivo temp_migration.sql se mantiene para revisión"
    fi
else
    echo "❌ No se pudo crear el archivo de migración"
    exit 1
fi

echo ""
echo "🎉 ¡Migración completada!"
echo "📱 Ahora puedes acceder a CAGPU en:"
echo "   • http://10.18.0.100:3000"
echo "   • http://localhost:3000"
