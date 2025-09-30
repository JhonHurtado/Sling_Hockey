#!/bin/bash

# Script de configuración inicial para Sling Hockey

echo "🏒 Configurando Sling Hockey..."
echo "================================"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
echo -e "\n${YELLOW}Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versión 18 o superior requerida. Versión actual: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v)${NC}"

# Instalar dependencias
echo -e "\n${YELLOW}Instalando dependencias...${NC}"

echo "📦 Instalando dependencias raíz..."
npm install

echo "📦 Instalando dependencias de types..."
cd types && npm install && cd ..

echo "📦 Instalando dependencias del servidor..."
cd server && npm install && cd ..

echo "📦 Instalando dependencias del cliente..."
cd client && npm install && cd ..

# Crear archivos .env si no existen
echo -e "\n${YELLOW}Configurando variables de entorno...${NC}"

if [ ! -f server/.env ]; then
    echo "📝 Creando server/.env"
    cp server/.env.example server/.env
fi

if [ ! -f client/.env ]; then
    echo "📝 Creando client/.env"
    cp client/.env.example client/.env
fi

# Construir types
echo -e "\n${YELLOW}Construyendo tipos compartidos...${NC}"
cd types && npm run build && cd ..

echo -e "\n${GREEN}✅ ¡Configuración completada!${NC}"
echo ""
echo "Para iniciar en desarrollo:"
echo "  npm run dev"
echo ""
echo "Para más información:"
echo "  cat QUICK_START.md"
echo ""
echo "🎮 ¡Disfruta Sling Hockey!"