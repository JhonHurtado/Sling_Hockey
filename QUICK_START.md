# 🚀 Guía de Inicio Rápido - Sling Hockey

## 💻 Configuración en 5 Minutos

### 1️⃣ Instalación
```bash
# Clonar el repositorio
git clone https://github.com/JhonHurtado/Sling_Hockey.git
cd Sling_Hockey

# Instalar dependencias de todos los paquetes
npm install
cd types && npm install && cd ..
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2️⃣ Configurar Variables de Entorno

**Server (.env)**
```bash
cd server
cp .env.example .env
# Editar .env si es necesario (valores por defecto funcionan)
```

**Client (.env)**
```bash
cd client
cp .env.example .env
# Para desarrollo local, dejar como está
```

### 3️⃣ Ejecutar en Desarrollo

**Opción A: Todo en uno (recomendado)**
```bash
# Desde la raíz del proyecto
npm run dev
```

**Opción B: Por separado**
```bash
# Terminal 1 - Servidor
cd server
npm run dev

# Terminal 2 - Cliente
cd client
npm run dev
```

### 4️⃣ Acceder a la Aplicación
- Abre tu navegador en: **http://localhost:5173**
- El servidor estará en: **http://localhost:3001**

---

## 🌐 Jugar en Red Local (LAN)

### Para el Anfitrion (Host)

1. **Encontrar tu IP local**

   **Windows:**
   ```bash
   ipconfig
   ```
   Busca "Dirección IPv4" (ej: 192.168.1.100)

   **Mac:**
   ```bash
   ifconfig | grep "inet "
   ```

   **Linux:**
   ```bash
   ip addr show | grep "inet "
   ```

2. **Iniciar el servidor**
   ```bash
   cd server
   npm run dev
   ```
   
   El servidor mostrará tu IP local automáticamente.

3. **Abrir el cliente**
   - En tu computadora: `http://localhost:5173`
   - Crear una sala
   - Compartir el código de 6 caracteres o el QR

### Para los Jugadores

1. **Conectarse a la misma red WiFi** que el host

2. **Abrir en el navegador**:
   ```
   http://[IP-DEL-HOST]:5173
   ```
   Ejemplo: `http://192.168.1.100:5173`

3. **Ingresar el código de sala** o escanear el QR

---

## 🏁 Jugar

1. **El host crea la sala** → Comparte el código
2. **Jugadores se unen** → Seleccionan equipo (Rojo/Azul)
3. **Host inicia el juego**
4. **¡A jugar!** Arrastra las fichas con el mouse

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev              # Ejecutar todo
npm run dev:server       # Solo servidor
npm run dev:client       # Solo cliente

# Construir para producción
npm run build            # Construir todo

# Ejecutar en producción
npm start                # Servidor + cliente estático

# Tests
npm test                 # Todos los tests
npm run test:server      # Tests del servidor
npm run test:client      # Tests del cliente
```

---

## 🐛 Problemas Comunes

### Los jugadores no se pueden conectar

✅ **Solución:**
- Verifica que todos estén en la **misma red WiFi**
- Usa la **IP local** (192.168.x.x), no 127.0.0.1
- Verifica el **firewall** (puerto 3001 y 5173)

**Windows - Abrir puertos:**
```bash
netsh advfirewall firewall add rule name="Sling Hockey Server" dir=in action=allow protocol=TCP localport=3001
netsh advfirewall firewall add rule name="Sling Hockey Client" dir=in action=allow protocol=TCP localport=5173
```

### Error de compilación

✅ **Solución:**
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
rm -rf */node_modules */package-lock.json
npm install
cd types && npm install && cd ..
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### El juego va lento

✅ **Solución:**
- Reduce la tasa de snapshots en `server/src/game/GameEngine.ts`
- Mejora la señal WiFi (acércate al router)
- Cierra aplicaciones que usen mucho la red

---

## 📚 Más Información

Consulta el [README.md](./README.md) completo para:
- Arquitectura detallada
- API de Socket.IO
- Configuración avanzada
- Contribuir al proyecto

---

🎮 **¡Diviértete jugando Sling Hockey!**