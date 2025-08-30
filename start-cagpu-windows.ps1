# ============================================================================
# SCRIPT DE DESPLIEGUE AUTOMATIZADO DE CAGPU EN WINDOWS
# ============================================================================

Write-Host "🚀 Iniciando despliegue de CAGPU en Windows..." -ForegroundColor Green

# Verificar si Docker está instalado
Write-Host "📋 Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker encontrado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está instalado" -ForegroundColor Red
    Write-Host "📥 Descarga Docker Desktop desde: https://docker.com/products/docker-desktop" -ForegroundColor Yellow
    Write-Host "🔧 Instala Docker Desktop y reinicia PowerShell" -ForegroundColor Yellow
    exit 1
}

# Verificar si Docker está ejecutándose
Write-Host "🔍 Verificando que Docker esté ejecutándose..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✅ Docker está ejecutándose" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está ejecutándose" -ForegroundColor Red
    Write-Host "🔧 Abre Docker Desktop y espera a que termine la inicialización" -ForegroundColor Yellow
    exit 1
}

# Verificar si docker-compose está disponible
Write-Host "📋 Verificando Docker Compose..." -ForegroundColor Yellow
try {
    $composeVersion = docker-compose --version
    Write-Host "✅ Docker Compose encontrado: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose no está disponible" -ForegroundColor Red
    Write-Host "🔧 Instala Docker Compose o actualiza Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Verificar si existe el archivo .env
Write-Host "📋 Verificando configuración..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creando archivo .env..." -ForegroundColor Yellow
    
    $envContent = @"
# ============================================================================
# CONFIGURACIÓN DE CAGPU PARA WINDOWS
# ============================================================================

# Base de datos PostgreSQL
DATABASE_URL="postgresql://cagpu_user:cagpu_password@localhost:5432/cagpu_db"

# Next.js
NODE_ENV=production
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-super-seguro-para-windows-$(Get-Random -Minimum 1000 -Maximum 9999)

# Configuración de la aplicación
APP_NAME=CAGPU
APP_VERSION=1.0.0

# Configuración de Docker
POSTGRES_USER=cagpu_user
POSTGRES_PASSWORD=cagpu_password
POSTGRES_DB=cagpu_db
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
} else {
    Write-Host "✅ Archivo .env ya existe" -ForegroundColor Green
}

# Verificar si existe docker-compose.yml
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "❌ Archivo docker-compose.yml no encontrado" -ForegroundColor Red
    Write-Host "📥 Descarga el proyecto desde GitHub: https://github.com/jlrochin/cagpu" -ForegroundColor Yellow
    exit 1
}

# Detener contenedores existentes si los hay
Write-Host "🛑 Deteniendo contenedores existentes..." -ForegroundColor Yellow
docker-compose down 2>$null

# Construir las imágenes
Write-Host "🔨 Construyendo imágenes Docker..." -ForegroundColor Yellow
docker-compose build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al construir las imágenes" -ForegroundColor Red
    exit 1
}

# Desplegar los servicios
Write-Host "🚀 Desplegando servicios..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al desplegar los servicios" -ForegroundColor Red
    exit 1
}

# Esperar a que los servicios estén listos
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar el estado de los servicios
Write-Host "📊 Verificando estado de los servicios..." -ForegroundColor Yellow
docker-compose ps

# Verificar que la aplicación esté respondiendo
Write-Host "🔍 Verificando que la aplicación esté respondiendo..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

do {
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/ping" -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Aplicación CAGPU está funcionando correctamente!" -ForegroundColor Green
            break
        }
    } catch {
        if ($attempt -eq $maxAttempts) {
            Write-Host "❌ La aplicación no está respondiendo después de $maxAttempts intentos" -ForegroundColor Red
            Write-Host "📋 Revisa los logs con: docker-compose logs app" -ForegroundColor Yellow
            break
        }
        Write-Host "⏳ Intentando conectar... ($attempt/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
} while ($attempt -lt $maxAttempts)

# Mostrar información final
Write-Host ""
Write-Host "🎉 ¡Despliegue completado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Información de acceso:" -ForegroundColor Cyan
Write-Host "   🌐 Aplicación Web: http://localhost:3000" -ForegroundColor White
Write-Host "   🗄️  Base de Datos: localhost:5432" -ForegroundColor White
Write-Host "   👤 Usuario Admin: admin@cagpu.local" -ForegroundColor White
Write-Host "   🔑 Contraseña: admin123" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   📊 Ver logs: docker-compose logs -f" -ForegroundColor White
Write-Host "   🛑 Detener: docker-compose down" -ForegroundColor White
Write-Host "   🔄 Reiniciar: docker-compose restart" -ForegroundColor White
Write-Host "   📋 Estado: docker-compose ps" -ForegroundColor White
Write-Host ""
Write-Host "📞 Para soporte, consulta: DESPLIEGUE_WINDOWS_DOCKER.md" -ForegroundColor Yellow
