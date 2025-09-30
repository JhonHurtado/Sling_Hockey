# 📊 Resumen del Proyecto - Sling Hockey

## 🎯 Información General

**Nombre:** Sling Hockey  
**Versión:** 1.0.0  
**Licencia:** MIT  
**Autor:** JhonHurtado  
**Repositorio:** https://github.com/JhonHurtado/Sling_Hockey

## 📝 Descripción

Juego multijugador tipo "Sling Hockey" diseñado para funcionar en red local (LAN) sin necesidad de conexión a internet. Soporta hasta 4 jugadores (2 por equipo) con un sistema de salas administradas por un host.

## 🛠️ Tecnologías Principales

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool y dev server
- **TypeScript** - Tipado estático
- **Zustand** - Gestión de estado
- **Tailwind CSS** - Estilos
- **Radix UI** - Componentes accesibles
- **Socket.IO Client** - Comunicación en tiempo real
- **Matter.js** - Motor de física 2D (cliente)
- **QRCode.react** - Generación de códigos QR

### Backend
- **Node.js 18+** - Runtime
- **Express** - Framework web
- **Socket.IO** - WebSockets
- **TypeScript** - Tipado estático
- **Matter.js** - Motor de física 2D (servidor autoritativo)
- **Zod** - Validación de esquemas
- **Nanoid** - Generación de códigos únicos

### Testing
- **Vitest** - Tests del cliente
- **Jest** - Tests del servidor

## 📊 Arquitectura

### Estructura de Directorios

```
Sling_Hockey/
├── types/                  # Paquete compartido de tipos
│   └── src/
│       └── index.ts       # DTOs, Schemas Zod, Enums
├── server/                 # Backend Node.js
│   └── src/
│       ├── index.ts       # Entry point
│       ├── server.ts      # Express + Socket.IO setup
│       ├── game/          # Motor de juego
│       │   ├── GameEngine.ts
│       │   └── GameState.ts
│       ├── room/          # Gestión de salas
│       │   ├── Room.ts
│       │   └── RoomManager.ts
│       └── socket/        # Handlers Socket.IO
│           └── SocketHandler.ts
└── client/                # Frontend React
    └── src/
        ├── App.tsx            # Componente principal
        ├── components/        # Componentes React
        │   ├── screens/       # Pantallas (Home, Lobby, Game)
        │   ├── game/          # Canvas y lógica de juego
        │   └── ui/            # Componentes UI reutilizables
        ├── hooks/             # Custom hooks
        │   ├── useSocket.ts   # Hook de Socket.IO
        │   └── useToast.ts    # Sistema de notificaciones
        ├── store/             # Estado global
        │   └── gameStore.ts   # Zustand store
        └── lib/               # Utilidades
```

### Flujo de Datos

```
Cliente 1 (Host)          Servidor              Cliente 2 (Jugador)
     |                       |                          |
     |--room:create-------->|                          |
     |<----room:state-------|                          |
     |                       |                          |
     |                       |<----room:join-----------|  
     |<----room:state-------|                          |
     |                       |------room:state-------->|
     |                       |                          |
     |--game:start--------->|                          |
     |                       |-- [Inicia loop] ------  |
     |<---game:snapshot-----|                          |
     |                       |-----game:snapshot------>|
     |                       |                          |
     |--input:sling-------->|                          |
     |                       |-- [Procesa física] --  |
     |<---game:snapshot-----|                          |
     |                       |-----game:snapshot------>|
```

## 📡 Eventos Socket.IO

### Cliente → Servidor

| Evento | Descripción | Payload |
|--------|-------------|--------|
| `room:create` | Crear sala nueva | `CreateRoomData` |
| `room:join` | Unirse a sala | `JoinRoomData` |
| `room:leave` | Salir de sala | - |
| `game:start` | Iniciar partida | - |
| `game:pause` | Pausar partida | - |
| `game:reset` | Reiniciar partida | - |
| `input:sling` | Enviar input de lanzamiento | `InputSlingData` |
| `chat:send` | Enviar mensaje | `ChatSendData` |
| `admin:assign-team` | Asignar equipo | `AssignTeamData` |
| `admin:kick` | Expulsar jugador | `KickPlayerData` |

### Servidor → Cliente

| Evento | Descripción | Frecuencia | Payload |
|--------|-------------|------------|--------|
| `room:state` | Estado de la sala | On change | `RoomStatePayload` |
| `game:snapshot` | Snapshot del juego | 20 FPS | `GameSnapshotPayload` |
| `game:event` | Eventos del juego | On event | `GameEventPayload` |
| `chat:msg` | Mensaje de chat | On message | `ChatMessagePayload` |
| `error` | Errores | On error | `ErrorPayload` |

## 🎮 Características Implementadas

### ✅ Core
- [x] Sistema de salas con códigos únicos
- [x] Generación de QR para unirse
- [x] Máximo 4 jugadores por sala
- [x] Roles: Admin, Jugador, Espectador
- [x] Asignación de equipos (Rojo/Azul)
- [x] Motor de física con Matter.js
- [x] Servidor autoritativo
- [x] Snapshots a 20 FPS
- [x] Sistema de puntuación
- [x] Temporizador de ronda
- [x] Detección de victoria

### ✅ UI/UX
- [x] Pantalla de inicio
- [x] Lobby con gestión de equipos
- [x] Canvas interactivo de juego
- [x] Sistema de notificaciones (Toast)
- [x] Responsive design
- [x] Dark mode compatible

### ✅ Admin
- [x] Controles de host
- [x] Iniciar/Pausar/Reiniciar juego
- [x] Asignar equipos
- [x] Expulsar jugadores
- [x] Cerrar sala

### ✅ Red
- [x] Socket.IO para toda la comunicación
- [x] Sin endpoints REST
- [x] Reconexiones automáticas
- [x] Validación con Zod
- [x] Manejo de errores

## 📊 Métricas del Proyecto

### Archivos
- **Tipos**: 1 archivo principal
- **Servidor**: 8 archivos principales
- **Cliente**: 15+ componentes
- **Tests**: 2 suites principales
- **Documentación**: 5 archivos markdown

### Líneas de Código (aproximado)
- **TypeScript**: ~3000 líneas
- **React/TSX**: ~2000 líneas
- **CSS**: ~200 líneas
- **Documentación**: ~1500 líneas

## 🚀 Comandos Rápidos

```bash
# Desarrollo
npm run dev              # Todo en desarrollo

# Producción
npm run build            # Construir todo
npm start                # Iniciar producción

# Tests
npm test                 # Ejecutar todos los tests

# Docker
docker-compose up        # Levantar con Docker
```

## 💻 Requisitos del Sistema

- **Node.js**: 18.0.0 o superior
- **npm**: 9.0.0 o superior
- **RAM**: 512MB mínimo
- **Red**: WiFi local o Ethernet
- **Navegadores**: Chrome, Firefox, Safari, Edge (modernos)

## 🔒 Seguridad

- Sin autenticación (juego local)
- Validación de inputs con Zod
- Servidor autoritativo previene trampas
- Sin almacenamiento de datos personales
- Códigos de sala temporales

## 📈 Posibles Mejoras Futuras

### Alta Prioridad
- [ ] Soporte táctil mejorado (mobile)
- [ ] Efectos de sonido
- [ ] Power-ups
- [ ] Diferentes modos de juego

### Media Prioridad
- [ ] Sistema de ranking
- [ ] Replay de partidas
- [ ] Customización de avatares
- [ ] Más tableros temáticos

### Baja Prioridad
- [ ] Integración con Discord
- [ ] Torneos
- [ ] Estadísticas persistentes
- [ ] Modo espectador mejorado

## 📝 Licencia

MIT License - Libre para uso personal y comercial

## 👥 Contribuidores

- **JhonHurtado** - Creador y mantenedor principal

## 🔗 Enlaces Útiles

- **Repositorio**: https://github.com/JhonHurtado/Sling_Hockey
- **Issues**: https://github.com/JhonHurtado/Sling_Hockey/issues
- **Socket.IO Docs**: https://socket.io/docs/
- **Matter.js Docs**: https://brm.io/matter-js/
- **React Docs**: https://react.dev/

---

Última actualización: Septiembre 2025  
Versión del documento: 1.0