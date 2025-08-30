# ============================================================================
# SCRIPT DE INICIO RÁPIDO - CAGPU DOCKER (WINDOWS)
# ============================================================================

Write-Host "🚀 Iniciando CAGPU con Docker..." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Verificar que Docker esté ejecutándose
try {
    docker info | Out-Null
    Write-Host "✅ Docker está funcionando correctamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Docker no está ejecutándose" -ForegroundColor Red
    Write-Host "Por favor, inicia Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Verificar que docker-compose esté disponible
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose está disponible" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: docker-compose no está disponible" -ForegroundColor Red
    Write-Host "Por favor, instala Docker Compose" -ForegroundColor Yellow
    exit 1
}

# Crear directorios necesarios
Write-Host "📁 Creando directorios necesarios..." -ForegroundColor Blue
New-Item -ItemType Directory -Force -Path "uploads" | Out-Null
New-Item -ItemType Directory -Force -Path "logs" | Out-Null
New-Item -ItemType Directory -Force -Path "backups" | Out-Null

# Construir y ejecutar
Write-Host "🔨 Construyendo imágenes Docker..." -ForegroundColor Blue
docker-compose build

Write-Host "🚀 Iniciando servicios..." -ForegroundColor Blue
docker-compose up -d

# Esperar a que los servicios estén listos
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar estado
Write-Host "📊 Verificando estado de los servicios..." -ForegroundColor Blue
docker-compose ps

Write-Host ""
Write-Host "🎉 ¡CAGPU está iniciando!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 URLs de acceso:" -ForegroundColor Cyan
Write-Host "   • Aplicación: http://10.18.0.100:3000" -ForegroundColor White
Write-Host "   • Nginx: http://10.18.0.100:80" -ForegroundColor White
Write-Host "   • Prisma Studio: http://10.18.0.100:5555" -ForegroundColor White
Write-Host ""
Write-Host "📋 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   • Ver logs: docker-compose logs -f" -ForegroundColor White
Write-Host "   • Detener: docker-compose down" -ForegroundColor White
Write-Host "   • Reiniciar: docker-compose restart" -ForegroundColor White
Write-Host "   • Backup: .\scripts\backup.sh" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Para ver logs en tiempo real:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f" -ForegroundColor White
