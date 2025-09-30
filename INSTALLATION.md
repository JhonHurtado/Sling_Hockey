# 📥 Guía de Instalación Detallada - Sling Hockey

## Tabla de Contenidos

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Instalación Básica](#instalación-básica)
3. [Instalación con Script Automático](#instalación-con-script-automático)
4. [Verificación de la Instalación](#verificación-de-la-instalación)
5. [Configuración](#configuración)
6. [Solución de Problemas](#solución-de-problemas)

---

## Requisitos del Sistema

### Software Necesario

- **Node.js**: Versión 18.0.0 o superior
  - Descargar de: https://nodejs.org/
  - Verificar versión: `node --version`

- **npm**: Versión 9.0.0 o superior (incluido con Node.js)
  - Verificar versión: `npm --version`

- **Git**: Para clonar el repositorio
  - Descargar de: https://git-scm.com/
  - Verificar versión: `git --version`

### Hardware Recomendado

- **CPU**: Procesador de 2 núcleos o superior
- **RAM**: 2GB mínimo, 4GB recomendado
- **Almacenamiento**: 500MB de espacio libre
- **Red**: Conexión WiFi o Ethernet para LAN

### Sistemas Operativos Compatibles

- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 20.04+, Debian, Fedora, etc.)

---

## Instalación Básica

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/JhonHurtado/Sling_Hockey.git
cd Sling_Hockey
```

### Paso 2: Instalar Dependencias

**Opción A: Instalar todo a la vez**

```bash
npm install
cd types && npm install && cd ..
cd server && npm install && cd ..
cd client && npm install && cd ..
```

**Opción B: Usar el comando raíz (si está configurado)**

```bash
npm run install:all
```

### Paso 3: Configurar Variables de Entorno

**Servidor:**

```bash
cd server
cp .env.example .env
```

Editar `server/.env` si es necesario:
```env
PORT=3001
NODE_ENV=development
```

**Cliente:**

```bash
cd client
cp .env.example .env
```

Editar `client/.env` si es necesario:
```env
VITE_SERVER_URL=http://localhost:3001
```

### Paso 4: Construir Tipos Compartidos

```bash
cd types
npm run build
cd ..
```

---

## Instalación con Script Automático

### Linux / macOS

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Windows (PowerShell)

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\setup.ps1
```

---

## Verificación de la Instalación

### 1. Verificar que las dependencias se instalaron

```bash
# Verificar node_modules en cada paquete
ls types/node_modules
ls server/node_modules
ls client/node_modules
```

### 2. Ejecutar tests

```bash
# Tests del servidor
cd server
npm test

# Tests del cliente
cd ../client
npm test
```

### 3. Construir el proyecto

```bash
npm run build
```

Si todo funciona sin errores, ¡la instalación fue exitosa! ✅

---

## Configuración

### Configuración para Red Local

#### 1. Obtener tu IP Local

**Automático:**
```bash
node scripts/get-local-ip.js
```

**Manual - Windows:**
```bash
ipconfig
# Buscar "Dirección IPv4"
```

**Manual - macOS/Linux:**
```bash
ifconfig
# o
ip addr show
```

#### 2. Actualizar Variables de Entorno para LAN

En `client/.env`:
```env
VITE_SERVER_URL=http://[TU-IP-LOCAL]:3001
```

Ejemplo:
```env
VITE_SERVER_URL=http://192.168.1.100:3001
```

### Configuración del Firewall

#### Windows

**Opción 1: GUI**
1. Abrir "Firewall de Windows Defender"
2. Clic en "Configuración avanzada"
3. Reglas de entrada → Nueva regla
4. Puerto → TCP → 3001 → Permitir

**Opción 2: PowerShell (como Administrador)**
```powershell
New-NetFirewallRule -DisplayName "Sling Hockey" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
```

#### macOS

macOS generalmente permite conexiones entrantes por defecto.

#### Linux (UFW)

```bash
sudo ufw allow 3001/tcp
sudo ufw reload
```

---

## Solución de Problemas

### Error: "npm: command not found"

**Solución:**
- Instalar Node.js desde https://nodejs.org/
- Reiniciar la terminal después de instalar

### Error: "Cannot find module"

**Solución:**
```bash
rm -rf node_modules package-lock.json
rm -rf */node_modules */package-lock.json
npm install
cd types && npm install && cd ..
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### Error: "Port 3001 already in use"

**Solución:**

**Linux/macOS:**
```bash
lsof -ti:3001 | xargs kill -9
```

**Windows:**
```bash
netstat -ano | findstr :3001
taskkill /PID [PID_NUMBER] /F
```

### Error: "EACCES: permission denied"

**Solución:**
- No usar `sudo` con npm
- Configurar npm para no requerir permisos de root:
  ```bash
  mkdir ~/.npm-global
  npm config set prefix '~/.npm-global'
  export PATH=~/.npm-global/bin:$PATH
  ```

### Los jugadores no pueden conectarse

**Verificar:**

1. ✅ Todos en la misma red WiFi
2. ✅ IP correcta (no 127.0.0.1)
3. ✅ Firewall permite puerto 3001
4. ✅ Servidor está corriendo
5. ✅ URL correcta en cliente

### El build falla

**Verificar:**

1. Node.js versión 18+
2. Tipos construidos primero:
   ```bash
   cd types && npm run build
   ```
3. Limpiar y reinstalar:
   ```bash
   npm run build
   ```

---

## Siguientes Pasos

Después de instalar:

1. 📖 Leer [QUICK_START.md](./QUICK_START.md) para empezar a jugar
2. 🚀 Leer [DEPLOYMENT.md](./DEPLOYMENT.md) para producción
3. 🤝 Leer [CONTRIBUTING.md](./CONTRIBUTING.md) para contribuir

---

## Soporte

¿Problemas durante la instalación?

- 🐛 Reportar en: https://github.com/JhonHurtado/Sling_Hockey/issues
- 💬 Discusiones: https://github.com/JhonHurtado/Sling_Hockey/discussions

---

✅ **¡Instalación completada exitosamente!**