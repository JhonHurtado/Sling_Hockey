# Script de configuración para Windows PowerShell

Write-Host "🏒 Configurando Sling Hockey..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Verificar Node.js
Write-Host "`nVerificando Node.js..." -ForegroundColor Yellow

try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm -v
    Write-Host "✅ npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no está instalado" -ForegroundColor Red
    exit 1
}

# Instalar dependencias
Write-Host "`nInstalando dependencias..." -ForegroundColor Yellow

Write-Host "📦 Instalando dependencias raíz..."
npm install

Write-Host "📦 Instalando dependencias de types..."
Set-Location types
npm install
Set-Location ..

Write-Host "📦 Instalando dependencias del servidor..."
Set-Location server
npm install
Set-Location ..

Write-Host "📦 Instalando dependencias del cliente..."
Set-Location client
npm install
Set-Location ..

# Crear archivos .env
Write-Host "`nConfigurando variables de entorno..." -ForegroundColor Yellow

if (-not (Test-Path "server/.env")) {
    Write-Host "📝 Creando server/.env"
    Copy-Item "server/.env.example" "server/.env"
}

if (-not (Test-Path "client/.env")) {
    Write-Host "📝 Creando client/.env"
    Copy-Item "client/.env.example" "client/.env"
}

# Construir types
Write-Host "`nConstruyendo tipos compartidos..." -ForegroundColor Yellow
Set-Location types
npm run build
Set-Location ..

Write-Host "`n✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar en desarrollo:"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Para más información:"
Write-Host "  Get-Content QUICK_START.md"
Write-Host ""
Write-Host "🎮 ¡Disfruta Sling Hockey!" -ForegroundColor Cyan