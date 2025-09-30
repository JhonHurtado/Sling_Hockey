# 🏒 Sling Hockey - Juego Multijugador LAN

Juego multijugador tipo "Sling Hockey" para jugar en red local (LAN) sin necesidad de internet.

## 🎯 Características

- **Multijugador en LAN**: Hasta 4 jugadores (2 por equipo)
- **Sistema de Salas**: Código único o QR para unirse
- **Roles**: Administrador, Jugadores y Observadores
- **Física Realista**: Implementado con Matter.js
- **Tiempo Real**: Comunicación con Socket.IO (WebSockets)
- **Sin Internet**: Funciona completamente en red local

## 🛠️ Stack Tecnológico

### Cliente
- React 19 + Vite
- TypeScript
- Zustand (gestión de estado)
- Tailwind CSS + shadcn/ui
- Matter.js (física 2D)
- Socket.IO Client
- QR Code React

### Servidor
- Node.js + Express
- TypeScript
- Socket.IO (WebSockets)
- Nanoid (códigos de sala)
- Zod (validación)

## 📦 Instalación

### Requisitos previos
- Node.js 18+ y npm/yarn/pnpm
- Git

### Clonar el repositorio

```bash
git clone https://github.com/JhonHurtado/Sling_Hockey.git
cd Sling_Hockey
```

### Instalar dependencias

```bash
# Instalar dependencias de todos los paquetes
npm install

# O instalar por separado
cd types && npm install && cd ..
cd server && npm install && cd ..
cd client && npm install && cd ..
```

## 🚀 Uso

### Modo Desarrollo

**Opción 1: Ejecutar todo desde la raíz**
```bash
npm run dev
```

**Opción 2: Ejecutar por separado**

```bash
# Terminal 1 - Servidor
cd server
npm run dev

# Terminal 2 - Cliente
cd client
npm run dev
```

### Modo Producción

```bash
# Construir cliente
cd client
npm run build

# Iniciar servidor (sirve el cliente construido)
cd ../server
npm run build
npm start
```

## 🌐 Configuración LAN

### Para el Host (quien crea la sala):

1. **Encontrar tu IP local**:

   **Windows:**
   ```bash
   ipconfig
   # Busca "IPv4 Address" en tu adaptador de red activo
   ```

   **Mac/Linux:**
   ```bash
   ifconfig
   # O
   ip addr show
   # Busca la IP que empiece con 192.168.x.x o 10.0.x.x
   ```

2. **Iniciar el servidor**:
   ```bash
   cd server
   npm start
   ```
   
   El servidor escuchará en `0.0.0.0:3001` (accesible en toda la red local)

3. **Abrir el cliente**:
   - Desarrollo: `http://localhost:5173`
   - Producción: `http://localhost:3001`

4. **Crear una sala** y compartir:
   - El código de 6 caracteres
   - O el QR code generado
   - Tu IP local (ej: `192.168.1.100`)

### Para los Jugadores:

1. **Conectarse a la misma red WiFi** que el host

2. **Abrir el navegador** en:
   - Desarrollo: `http://[IP-DEL-HOST]:5173`
   - Producción: `http://[IP-DEL-HOST]:3001`
   
   Ejemplo: `http://192.168.1.100:3001`

3. **Unirse con código** o escanear el QR

## 🎮 Cómo Jugar

### Roles

- **Administrador (Host)**:
  - Crea la sala
  - Decide si juega o solo observa
  - Asigna equipos
  - Inicia/pausa/reinicia partidas
  - Puede expulsar jugadores

- **Jugadores**:
  - Se unen por código o QR
  - Seleccionan equipo (Rojo o Azul)
  - Juegan moviendo las fichas

- **Observadores**:
  - Ven la partida sin interactuar

### Reglas del Juego

1. Tablero rectangular dividido por una ranura central
2. Cada equipo inicia con fichas (pucks) en su lado
3. **Objetivo**: Pasar todas tus fichas al lado contrario
4. **Fin de ronda**: Cuando un equipo queda sin fichas o expira el tiempo
5. Gana el equipo que complete el objetivo primero

### Controles

- **Mouse/Touch**: Click y arrastra una ficha para lanzarla (efecto resortera)
- El servidor es autoritativo (previene trampas)

## 📡 Arquitectura de Red

### Todo funciona con Socket.IO (WebSockets)

**Cliente → Servidor:**
- `room:create` - Crear sala
- `room:join` - Unirse a sala
- `room:leave` - Salir de sala
- `game:start` - Iniciar partida
- `game:pause` - Pausar partida
- `game:reset` - Reiniciar partida
- `input:sling` - Enviar input de lanzamiento
- `chat:send` - Enviar mensaje de chat

**Servidor → Cliente:**
- `room:state` - Estado actual de la sala
- `game:snapshot` - Snapshot del estado del juego (15-20 FPS)
- `game:event` - Eventos del juego (gol, fin de ronda, etc.)
- `chat:msg` - Mensaje de chat
- `error` - Errores

### Sin endpoints REST
- No se usan llamadas HTTP para el flujo del juego
- El servidor solo sirve el build de React en producción
- Todo lo demás es comunicación WebSocket

## 🧪 Testing

```bash
# Tests del cliente
cd client
npm test

# Tests del servidor
cd server
npm test
```

## 📁 Estructura del Proyecto

```
Sling_Hockey/
├── types/              # Tipos TypeScript compartidos
│   └── index.ts        # DTOs y contratos de eventos
├── server/             # Servidor Node.js
│   └── src/
│       ├── index.ts    # Punto de entrada
│       ├── server.ts   # Configuración Express + Socket.IO
│       ├── game/       # Motor de juego y física
│       ├── room/       # Gestión de salas
│       └── socket/     # Handlers de Socket.IO
└── client/             # Cliente React
    └── src/
        ├── components/ # Componentes React
        ├── store/      # Estado global (Zustand)
        ├── hooks/      # Custom hooks (useSocket)
        └── lib/        # Utilidades
```

## 🔧 Variables de Entorno

### Server (.env)
```env
PORT=3001
NODE_ENV=development
```

### Client (.env)
```env
VITE_SERVER_URL=http://localhost:3001
```

**Para LAN en producción**, cambia la URL del servidor a la IP local:
```env
VITE_SERVER_URL=http://192.168.1.100:3001
```

## 🐛 Troubleshooting

### Los jugadores no pueden conectarse

1. **Verifica que todos estén en la misma red WiFi**
2. **Revisa el firewall**: Asegúrate que el puerto 3001 esté abierto
   - Windows: `netsh advfirewall firewall add rule name="Sling Hockey" dir=in action=allow protocol=TCP localport=3001`
3. **Usa la IP correcta**: Debe ser la IP local (192.168.x.x o 10.0.x.x), no 127.0.0.1

### El juego va lento

1. Reduce la tasa de snapshots en `server/src/game/GameEngine.ts`
2. Verifica la calidad de tu red WiFi
3. Cierra otras aplicaciones que usen la red

### Errores de compilación

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
rm -rf */node_modules */package-lock.json
npm install
```

## 📝 Próximas Características

- [ ] Diferentes modos de juego
- [ ] Power-ups y obstáculos
- [ ] Sistema de ranking
- [ ] Replay de partidas
- [ ] Personalización de avatares
- [ ] Audio y efectos de sonido
- [ ] Diferentes tableros temáticos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver el archivo LICENSE para más detalles

## 👤 Autor

**JhonHurtado**
- GitHub: [@JhonHurtado](https://github.com/JhonHurtado)

## 🙏 Agradecimientos

- React + Vite por el excelente setup de desarrollo
- Socket.IO por la comunicación en tiempo real
- Matter.js por el motor de física
- La comunidad open source

---

¡Diviértete jugando Sling Hockey! 🏒🎮
