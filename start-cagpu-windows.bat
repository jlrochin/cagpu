@echo off
REM ============================================================================
REM SCRIPT DE DESPLIEGUE DE CAGPU EN WINDOWS
REM ============================================================================

echo 🚀 Iniciando despliegue de CAGPU en Windows...
echo.

REM Verificar si PowerShell está disponible
powershell -Command "Get-Host" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PowerShell no está disponible
    echo 🔧 Instala PowerShell o usa Windows 10/11
    pause
    exit /b 1
)

REM Ejecutar el script de PowerShell
echo 📋 Ejecutando script de despliegue...
powershell -ExecutionPolicy Bypass -File "start-cagpu-windows.ps1"

REM Verificar si el script se ejecutó correctamente
if %errorlevel% neq 0 (
    echo.
    echo ❌ Error al ejecutar el script
    echo 📞 Consulta DESPLIEGUE_WINDOWS_DOCKER.md para solución de problemas
    pause
    exit /b 1
)

echo.
echo 🎉 ¡Proceso completado!
echo.
echo 📋 Para acceder a la aplicación:
echo    🌐 Abre tu navegador y ve a: http://localhost:3000
echo.
echo 🔧 Para detener la aplicación:
echo    🛑 Ejecuta: docker-compose down
echo.
pause
