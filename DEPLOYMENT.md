# 🚀 Guía de Deployment - Sling Hockey

## Producción Local (LAN)

### Opción 1: Servidor Todo-en-Uno

Esta es la forma más simple para jugar en LAN.

```bash
# 1. Construir el cliente
cd client
npm run build

# 2. Construir el servidor
cd ../server
npm run build

# 3. Iniciar servidor (sirve cliente + backend)
npm start
```

El servidor servirá el cliente en el puerto 3001.

**Acceso:**
- Host: `http://localhost:3001`
- Jugadores en LAN: `http://[IP-LOCAL]:3001`

### Opción 2: Servidor y Cliente Separados

```bash
# Terminal 1 - Servidor
cd server
npm run build
NODE_ENV=production npm start

# Terminal 2 - Cliente (con servidor de desarrollo)
cd client
npm run preview
```

---

## Docker (Opcional)

### Crear Dockerfile

**server/Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar tipos compartidos
COPY types /app/types
WORKDIR /app/types
RUN npm install && npm run build

# Copiar y construir servidor
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server ./
RUN npm run build

# Copiar cliente construido
COPY client/dist /app/client/dist

EXPOSE 3001

CMD ["npm", "start"]
```

### Construir y ejecutar

```bash
# Construir imagen
docker build -t sling-hockey .

# Ejecutar contenedor
docker run -p 3001:3001 sling-hockey
```

---

## Configuración para Producción

### Variables de Entorno

**server/.env**
```env
PORT=3001
NODE_ENV=production
CLIENT_URL=http://[TU-IP-LOCAL]:3001
```

**client/.env.production**
```env
VITE_SERVER_URL=http://[TU-IP-LOCAL]:3001
```

### Optimizaciones

1. **Compresión Gzip**
   ```bash
   npm install compression
   ```
   
   En `server/src/server.ts`:
   ```typescript
   import compression from 'compression';
   app.use(compression());
   ```

2. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

3. **Logging**
   ```bash
   npm install winston
   ```

---

## Firewall y Seguridad

### Windows

```powershell
# Permitir puerto 3001
netsh advfirewall firewall add rule name="Sling Hockey" dir=in action=allow protocol=TCP localport=3001
```

### Linux (UFW)

```bash
sudo ufw allow 3001/tcp
sudo ufw reload
```

### Mac (pf)

MacOS generalmente permite conexiones salientes por defecto.

---

## Monitoreo

### Health Check

```bash
curl http://localhost:3001/health
```

Respuesta:
```json
{
  "status": "ok",
  "uptime": 123.45,
  "rooms": 2,
  "timestamp": 1234567890
}
```

### Logs

Los logs se mostrarán en la consola. Para producción, considera usar:
- Winston para logging estructurado
- PM2 para gestión de procesos

---

## PM2 (Recomendado para Producción)

### Instalación

```bash
npm install -g pm2
```

### Configuración

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'sling-hockey',
    script: './server/dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

### Comandos

```bash
# Iniciar
pm2 start ecosystem.config.js

# Ver estado
pm2 status

# Ver logs
pm2 logs sling-hockey

# Reiniciar
pm2 restart sling-hockey

# Detener
pm2 stop sling-hockey

# Eliminar
pm2 delete sling-hockey
```

---

## Backup y Persistencia

Actualmente el juego no requiere base de datos. Si quieres agregar persistencia:

1. **SQLite** para estadísticas locales
2. **Redis** para estado de sesiones (si escalas)

---

## Troubleshooting Producción

### Error: Cannot find module

```bash
cd server
npm ci
npm run build
```

### Puerto en uso

```bash
# Linux/Mac
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID [PID] /F
```

### Problemas de memoria

Aumenta el límite de memoria de Node:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

---

## Escalabilidad

Para soportar más jugadores:

1. **Multiple instances con Load Balancer**
2. **Redis para compartir estado entre instancias**
3. **Socket.IO con Redis adapter**

```bash
npm install @socket.io/redis-adapter
```

---

🎉 **¡Listo para jugar en producción!**