# 🔧 Guía de Solución de Problemas

## Error: "Cannot find module '@sling-hockey/types'"

### Síntoma
```
Error: Cannot find module '/Users/.../node_modules/@sling-hockey/types/dist/index.js'
```

### Causa
El paquete de tipos compartidos no se ha construido antes de ejecutar el servidor o cliente.

### Solución Rápida

**Opción 1: Reconstruir todo (Recomendado)**
```bash
# Desde la raíz del proyecto
cd types && npm run build && cd ..
npm run dev
```

**Opción 2: Reinstalar (ejecutará postinstall automáticamente)**
```bash
npm install
npm run dev
```

**Opción 3: Construir solo tipos**
```bash
npm run build:types
npm run dev
```

---

## Error: "Failed to resolve entry for package @sling-hockey/types"

### Síntoma
```
✘ [ERROR] Failed to resolve entry for package "@sling-hockey/types"
```

Este es el mismo error que el anterior (Vite muestra el error de forma diferente).

### Solución
Sigue los pasos de la sección anterior.

---

## Error: "Port already in use"

### Síntoma
```
Error: listen EADDRINUSE: address already in use :::3001
```

### Solución

**Linux/macOS:**
```bash
# Encontrar y matar el proceso
lsof -ti:3001 | xargs kill -9

# O cambiar el puerto en server/.env
PORT=3002
```

**Windows:**
```powershell
# Encontrar el proceso
netstat -ano | findstr :3001

# Matar el proceso (reemplaza PID con el número obtenido)
taskkill /PID [PID] /F

# O cambiar el puerto en server/.env
PORT=3002
```

---

## Error: "npm: command not found"

### Causa
Node.js no está instalado o no está en el PATH.

### Solución
1. Instalar Node.js desde https://nodejs.org/ (versión 18 o superior)
2. Reiniciar la terminal
3. Verificar: `node --version` y `npm --version`

---

## Error: "EACCES: permission denied"

### Síntoma
```
Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules'
```

### Solución

**NO usar sudo con npm**. En su lugar:

```bash
# Configurar npm para usar directorio local
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Agregar al PATH (agregar a ~/.bashrc o ~/.zshrc)
export PATH=~/.npm-global/bin:$PATH

# Recargar
source ~/.bashrc  # o source ~/.zshrc
```

---

## Los jugadores no pueden conectarse en LAN

### Verificar:

#### 1. Misma red WiFi
Todos los dispositivos deben estar en la misma red local.

#### 2. IP correcta
```bash
# Obtener IP local
node scripts/get-local-ip.js

# La IP debe ser del tipo:
# 192.168.x.x
# 10.0.x.x
# 172.16.x.x a 172.31.x.x

# NO usar:
# 127.0.0.1 (solo funciona localmente)
# 0.0.0.0 (no es una IP válida para clientes)
```

#### 3. Firewall
El firewall puede estar bloqueando las conexiones.

**Windows:**
```powershell
# Permitir puerto 3001
New-NetFirewallRule -DisplayName "Sling Hockey Server" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow

# Permitir puerto 5173 (desarrollo)
New-NetFirewallRule -DisplayName "Sling Hockey Client" -Direction Inbound -Protocol TCP -LocalPort 5173 -Action Allow
```

**Linux (UFW):**
```bash
sudo ufw allow 3001/tcp
sudo ufw allow 5173/tcp
sudo ufw reload
```

**macOS:**
Por defecto, macOS permite conexiones entrantes. Si tienes problemas, verifica la configuración del firewall en Preferencias del Sistema.

#### 4. Servidor corriendo
Verifica que el servidor esté activo:
```bash
curl http://localhost:3001/health
```

Deberías ver: `{"status":"ok",...}`

#### 5. Cliente configurado correctamente

En **desarrollo**, el cliente debe apuntar al servidor:

`client/.env`:
```env
VITE_SERVER_URL=http://[TU-IP-LOCAL]:3001
```

Ejemplo:
```env
VITE_SERVER_URL=http://192.168.1.100:3001
```

Después de cambiar `.env`, reinicia el cliente:
```bash
cd client
npm run dev
```

---

## Error de compilación: "Cannot find module"

### Síntoma
```
Error: Cannot find module 'some-package'
```

### Solución

**Limpiar y reinstalar:**
```bash
# Limpiar todo
rm -rf node_modules package-lock.json
rm -rf types/node_modules types/package-lock.json
rm -rf server/node_modules server/package-lock.json
rm -rf client/node_modules client/package-lock.json

# Reinstalar
npm install
cd types && npm install && cd ..
cd server && npm install && cd ..
cd client && npm install && cd ..

# Construir tipos
cd types && npm run build && cd ..
```

---

## El juego va lento en LAN

### Causas comunes:
1. **Red WiFi saturada o débil**
2. **Demasiada distancia del router**
3. **Otros dispositivos usando ancho de banda**

### Soluciones:

#### 1. Mejorar conexión WiFi
- Acércate al router
- Usa WiFi 5GHz si está disponible
- Reduce interferencias (microondas, Bluetooth, etc.)

#### 2. Reducir tasa de actualización

En `server/src/game/GameEngine.ts`, encuentra:
```typescript
setInterval(() => {
  // ...
}, 1000 / CONSTANTS.SNAPSHOT_RATE);
```

Cambia `CONSTANTS.SNAPSHOT_RATE` de 20 a 15 o 10 en `types/src/index.ts`:
```typescript
export const CONSTANTS = {
  SNAPSHOT_RATE: 15, // Reducir de 20 a 15
  // ...
};
```

Después:
```bash
cd types && npm run build && cd ..
npm run dev
```

#### 3. Usar conexión por cable
Si es posible, conecta el host por Ethernet en lugar de WiFi.

---

## Error: "Module build failed"

### Causa
Problemas con TypeScript o configuración de Vite.

### Solución

**1. Verificar versiones:**
```bash
node --version  # Debe ser >= 18
npm --version   # Debe ser >= 9
```

**2. Limpiar caché:**
```bash
# Cliente
cd client
rm -rf node_modules/.vite
npm run dev

# Servidor
cd ../server
rm -rf dist
npm run build
```

---

## Error: "WebSocket connection failed"

### Síntoma
En la consola del navegador:
```
WebSocket connection to 'ws://...' failed
```

### Solución

#### 1. Verificar que el servidor esté corriendo
```bash
curl http://localhost:3001/health
```

#### 2. Verificar URL del servidor

En `client/.env`:
```env
# Para desarrollo local
VITE_SERVER_URL=http://localhost:3001

# Para LAN
VITE_SERVER_URL=http://192.168.1.100:3001
```

#### 3. Verificar CORS

El servidor debe aceptar conexiones desde tu cliente. Verifica `server/.env`:
```env
CLIENT_URL=http://localhost:5173
```

Para LAN, puedes usar `*` temporalmente (no recomendado en producción):

En `server/src/server.ts`, cambia:
```typescript
const corsOptions = {
  origin: '*', // Permitir todos los orígenes (solo para desarrollo/LAN)
  credentials: true
};
```

---

## Más ayuda

Si ninguna de estas soluciones funciona:

1. **Revisa los logs** del servidor y cliente para más detalles
2. **Abre un issue** en GitHub: https://github.com/JhonHurtado/Sling_Hockey/issues
3. **Incluye**:
   - Sistema operativo
   - Versión de Node.js (`node --version`)
   - Mensaje de error completo
   - Pasos para reproducir el error

---

## Comandos útiles de diagnóstico

```bash
# Verificar versiones
node --version
npm --version
git --version

# Ver procesos en puertos
lsof -ti:3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Ver IP local
node scripts/get-local-ip.js

# Health check del servidor
curl http://localhost:3001/health

# Limpiar todo
rm -rf node_modules */node_modules
rm -rf package-lock.json */package-lock.json

# Reinstalar todo
npm install
cd types && npm install && cd ..
cd server && npm install && cd ..
cd client && npm install && cd ..

# Construir todo
npm run build
```

---

**¿Problemas no listados aquí?** Abre un issue en GitHub con los detalles.
