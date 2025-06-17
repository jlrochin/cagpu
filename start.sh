#!/bin/bash

echo "🚀 Iniciando CAGPU con Docker..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor, instala Docker primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor, instala Docker Compose primero."
    exit 1
fi

# Generar script de inicialización de base de datos si no existe
if [ ! -f "init-db.sql" ]; then
    echo "📝 Generando script de inicialización de base de datos..."
    node scripts/init-db.js
fi

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down

# Construir y ejecutar contenedores
echo "🔨 Construyendo y ejecutando contenedores..."
docker-compose up -d --build

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar el estado de los contenedores
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "✅ CAGPU está ejecutándose!"
echo ""
echo "🌐 Acceso a la aplicación:"
echo "   - Aplicación: http://localhost:3000"
echo "   - pgAdmin: http://localhost:5050"
echo ""
echo "🔐 Credenciales de prueba:"
echo "   - Admin: admin / admin123"
echo "   - Usuario: user / user123"
echo ""
echo "📋 Comandos útiles:"
echo "   - Ver logs: docker-compose logs -f"
echo "   - Detener: docker-compose down"
echo "   - Reiniciar: docker-compose restart"
echo "" 