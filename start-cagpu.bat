@echo off
REM ============================================================================
REM SCRIPT DE INICIO RÁPIDO - CAGPU DOCKER (WINDOWS BATCH)
REM ============================================================================

echo 🚀 Iniciando CAGPU con Docker...
echo ==================================

REM Verificar que Docker esté ejecutándose
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Docker no está ejecutándose
    echo Por favor, inicia Docker Desktop
    pause
    exit /b 1
)

echo ✅ Docker está funcionando correctamente

REM Verificar que docker-compose esté disponible
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: docker-compose no está disponible
    echo Por favor, instala Docker Compose
    pause
    exit /b 1
)

echo ✅ Docker Compose está disponible

REM Crear directorios necesarios
echo 📁 Creando directorios necesarios...
if not exist "uploads" mkdir uploads
if not exist "logs" mkdir logs
if not exist "backups" mkdir backups

REM Construir y ejecutar
echo 🔨 Construyendo imágenes Docker...
docker-compose build

echo 🚀 Iniciando servicios...
docker-compose up -d

REM Esperar a que los servicios estén listos
echo ⏳ Esperando a que los servicios estén listos...
timeout /t 10 /nobreak >nul

REM Verificar estado
echo 📊 Verificando estado de los servicios...
docker-compose ps

echo.
echo 🎉 ¡CAGPU está iniciando!
echo.
echo 📱 URLs de acceso:
echo    • Aplicación: http://10.18.0.100:3000
echo    • Nginx: http://10.18.0.100:80
echo    • Prisma Studio: http://10.18.0.100:5555
echo.
echo 📋 Comandos útiles:
echo    • Ver logs: docker-compose logs -f
echo    • Detener: docker-compose down
echo    • Reiniciar: docker-compose restart
echo    • Backup: .\scripts\backup.sh
echo.
echo 🔍 Para ver logs en tiempo real:
echo    docker-compose logs -f
echo.
pause
