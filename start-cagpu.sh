#!/bin/bash
# ============================================================================
# SCRIPT DE INICIO RÁPIDO - CAGPU DOCKER
# ============================================================================

echo "🚀 Iniciando CAGPU con Docker..."
echo "=================================="

# Verificar que Docker esté ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está ejecutándose"
    echo "Por favor, inicia Docker Desktop o Docker Engine"
    exit 1
fi

# Verificar que docker-compose esté disponible
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose no está disponible"
    echo "Por favor, instala Docker Compose"
    exit 1
fi

echo "✅ Docker está funcionando correctamente"

# Crear directorios necesarios
echo "📁 Creando directorios necesarios..."
mkdir -p uploads logs backups

# Construir y ejecutar
echo "🔨 Construyendo imágenes Docker..."
docker-compose build

echo "🚀 Iniciando servicios..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado
echo "📊 Verificando estado de los servicios..."
docker-compose ps

echo ""
echo "🎉 ¡CAGPU está iniciando!"
echo ""
echo "📱 URLs de acceso:"
echo "   • Aplicación: http://10.18.0.100:3000"
echo "   • Nginx: http://10.18.0.100:80"
echo "   • Prisma Studio: http://10.18.0.100:5555"
echo ""
echo "📋 Comandos útiles:"
echo "   • Ver logs: docker-compose logs -f"
echo "   • Detener: docker-compose down"
echo "   • Reiniciar: docker-compose restart"
echo "   • Backup: ./scripts/backup.sh"
echo ""
echo "🔍 Para ver logs en tiempo real:"
echo "   docker-compose logs -f"
