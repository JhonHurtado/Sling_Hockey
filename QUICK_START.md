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

### 2️⃣ Construir Tipos Compartidos

**⚠️ IMPORTANTE: Este paso es necesario antes de ejecutar el proyecto**

```bash
# Construir el paquete de tipos (requerido por servidor y cliente)
cd types
npm run build
cd ..
```

O desde la raíz:
```bash
npm run build:types
```

### 3️⃣ Configurar Variables de Entorno

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

### 4️⃣ Ejecutar en Desarrollo

**Opción A: Todo en uno (recomendado)**
```bash
# Desde la raíz del proyecto
# Nota: El comando ya construye los tipos automáticamente
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

### 5️⃣ Acceder a la Aplicación

- Abre tu navegador en: **http://localhost:5173**
- El servidor estará en: **http://localhost:3001**

---

## 🌐 Jugar en Red Local (LAN)

### Para el Anfitrión (Host)

1. **Encontrar tu IP local**

   **Automático (recomendado):**
   ```bash
   node scripts/get-local-ip.js
   ```

   **Manual - Windows:**
   ```bash
   ipconfig
   ```
   Busca "Dirección IPv4" (ej: 192.168.1.100)

   **Manual - Mac:**
   ```bash
   ifconfig | grep "inet "
   ```

   **Manual - Linux:**
   ```bash
   ip addr show | grep "inet "
   ```

2. **Iniciar el servidor**
   ```bash
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
npm run dev              # Ejecutar todo (construye tipos automáticamente)
npm run dev:server       # Solo servidor
npm run dev:client       # Solo cliente

# Construir
npm run build            # Construir todo
npm run build:types      # Solo tipos compartidos
npm run build:server     # Solo servidor
npm run build:client     # Solo cliente

# Producción
npm start                # Servidor + cliente estático

# Tests
npm test                 # Todos los tests
npm run test:server      # Tests del servidor
npm run test:client      # Tests del cliente

# Utilidades
node scripts/get-local-ip.js  # Ver tu IP local para LAN
```

---

## 🐛 Problemas Comunes

### Error: "Cannot find module '@sling-hockey/types'"

**Este es el error más común al primer arranque.**

✅ **Solución Rápida:**
```bash
# Opción 1: Construir tipos manualmente
cd types && npm run build && cd ..
npm run dev

# Opción 2: Reinstalar (ejecuta postinstall automáticamente)
npm install
npm run dev
```

**Causa:** El paquete de tipos no se construyó antes de ejecutar servidor/cliente.

### Los jugadores no se pueden conectar

✅ **Solución:**
- Verifica que todos estén en la **misma red WiFi**
- Usa la **IP local** (192.168.x.x), no 127.0.0.1
- Verifica el **firewall** (puerto 3001 y 5173)

**Windows - Abrir puertos:**
```powershell
netsh advfirewall firewall add rule name="Sling Hockey Server" dir=in action=allow protocol=TCP localport=3001
netsh advfirewall firewall add rule name="Sling Hockey Client" dir=in action=allow protocol=TCP localport=5173
```

**Linux (UFW):**
```bash
sudo ufw allow 3001/tcp
sudo ufw allow 5173/tcp
sudo ufw reload
```

### Error de compilación

✅ **Solución:**
```bash
# Limpiar y reinstalar todo
rm -rf node_modules package-lock.json
rm -rf */node_modules */package-lock.json

npm install
cd types && npm install && cd ..
cd server && npm install && cd ..
cd client && npm install && cd ..

# Construir tipos
cd types && npm run build && cd ..
```

### El juego va lento

✅ **Solución:**
- Mejora la señal WiFi (acércate al router)
- Usa WiFi 5GHz si está disponible
- Cierra aplicaciones que usen mucho la red
- Considera reducir la tasa de snapshots (ver [TROUBLESHOOTING.md](TROUBLESHOOTING.md))

---

## 📚 Más Información

- 📖 [README.md](./README.md) - Documentación completa
- 🔧 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Solución de problemas detallada
- 📥 [INSTALLATION.md](./INSTALLATION.md) - Instalación paso a paso
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Despliegue y producción
- 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md) - Cómo contribuir

---

## ✅ Checklist de Instalación

- [ ] Node.js 18+ instalado
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (`npm install` en todos los paquetes)
- [ ] **Tipos construidos** (`cd types && npm run build`)
- [ ] Variables de entorno configuradas (.env copiados)
- [ ] Servidor corriendo sin errores
- [ ] Cliente abierto en el navegador
- [ ] Sala creada y código compartido (para LAN)

---

🎮 **¡Diviértete jugando Sling Hockey!**

💡 **Tip:** Si encuentras problemas, consulta [TROUBLESHOOTING.md](TROUBLESHOOTING.md) para soluciones detalladas.
