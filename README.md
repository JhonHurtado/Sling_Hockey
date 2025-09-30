# 🏒 Sling Hockey - Juego Multijugador LAN

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)

**Juego multijugador tipo "Sling Hockey" para red local (LAN) sin internet**

[Demo](#) • [Documentación](#documentación) • [Instalación](#-instalación-rápida) • [Contribuir](CONTRIBUTING.md)

</div>

---

## ✨ Características

- 🎮 **Multijugador Local**: Hasta 4 jugadores (2 por equipo)
- 🔐 **Sistema de Salas**: Códigos únicos y QR para unirse fácilmente
- 👥 **Roles Flexibles**: Administrador, Jugadores y Espectadores
- ⚡ **Tiempo Real**: Comunicación fluida con Socket.IO
- 🎯 **Física Realista**: Motor Matter.js para mecánicas suaves
- 📱 **Sin Internet**: Funciona 100% en red local
- 🎨 **UI Moderna**: Interfaz limpia con Tailwind CSS y Radix UI
- 🔒 **Servidor Autoritativo**: Previene trampas

## 🎬 Preview

```
┌─────────────────────────────────────────────────┐
│  🏒 SLING HOCKEY                                │
│  ┌──────────────┐         ┌──────────────┐     │
│  │ Crear Sala   │         │ Unirse      │     │
│  └──────────────┘         └──────────────┘     │
│                                                 │
│  Código de sala: ABC123                        │
│  [QR CODE]                                     │
│                                                 │
│  🔴 Equipo Rojo: 2    vs    🔵 Equipo Azul: 3  │
│  Tiempo: 2:45                                  │
│  ┌─────────────────────────────────────────┐  │
│  │     ╔═══════════════════════════╗       │  │
│  │     ║  🔴  🔴  ║  🔵  🔵  🔵  ║       │  │
│  │     ╚═══════════════════════════╝       │  │
│  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## 🚀 Instalación Rápida

### Prerequisitos

- Node.js 18+ ([Descargar](https://nodejs.org/))
- npm 9+
- Git

### Instalación Automática

**Linux/macOS:**
```bash
git clone https://github.com/JhonHurtado/Sling_Hockey.git
cd Sling_Hockey
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**Windows PowerShell:**
```powershell
git clone https://github.com/JhonHurtado/Sling_Hockey.git
cd Sling_Hockey
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\setup.ps1
```

### Instalación Manual

```bash
# 1. Clonar repositorio
git clone https://github.com/JhonHurtado/Sling_Hockey.git
cd Sling_Hockey

# 2. Instalar dependencias
npm install
cd types && npm install && cd ..
cd server && npm install && cd ..
cd client && npm install && cd ..

# 3. Configurar entorno
cp server/.env.example server/.env
cp client/.env.example client/.env

# 4. Construir tipos
cd types && npm run build && cd ..
```

## 🎮 Inicio Rápido

### Desarrollo

```bash
# Opción 1: Todo en uno (recomendado)
npm run dev

# Opción 2: Separado
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

**Acceso:**
- Cliente: http://localhost:5173
- Servidor: http://localhost:3001

### Producción

```bash
npm run build
npm start
```

## 🌐 Jugar en LAN

### 1️⃣ Host (Anfitrión)

1. **Encontrar IP local:**
   ```bash
   # Automático
   node scripts/get-local-ip.js
   
   # Manual
   # Windows: ipconfig
   # Mac/Linux: ifconfig
   ```

2. **Iniciar servidor:**
   ```bash
   cd server && npm run dev
   ```

3. **Crear sala** y compartir código/QR

### 2️⃣ Jugadores

1. Conectarse a la **misma red WiFi**
2. Abrir navegador en: `http://[IP-HOST]:5173`
3. Ingresar código de sala

## 📚 Documentación

- 📖 [README Completo](README.md) - Documentación completa
- ⚡ [Quick Start](QUICK_START.md) - Inicio en 5 minutos
- 📥 [Instalación Detallada](INSTALLATION.md) - Guía paso a paso
- 🚀 [Deployment](DEPLOYMENT.md) - Producción y Docker
- 🤝 [Contribuir](CONTRIBUTING.md) - Cómo colaborar
- 📊 [Project Summary](PROJECT_SUMMARY.md) - Resumen técnico

## 🛠️ Stack Tecnológico

### Frontend
- React 18 + Vite
- TypeScript
- Zustand (Estado)
- Tailwind CSS + Radix UI
- Socket.IO Client
- Matter.js (Física)
- QR Code React

### Backend
- Node.js + Express
- TypeScript
- Socket.IO (WebSockets)
- Matter.js (Física)
- Zod (Validación)
- Nanoid (Códigos únicos)

### Testing
- Vitest (Cliente)
- Jest (Servidor)

## 📁 Estructura del Proyecto

```
Sling_Hockey/
├── types/              # Tipos TypeScript compartidos
│   └── src/index.ts
├── server/             # Backend Node.js + Socket.IO
│   └── src/
│       ├── game/       # Motor de juego y física
│       ├── room/       # Gestión de salas
│       └── socket/     # Handlers WebSocket
└── client/             # Frontend React + Vite
    └── src/
        ├── components/ # Componentes React
        ├── hooks/      # Custom hooks
        └── store/      # Estado global (Zustand)
```

## 🎯 Comandos Principales

```bash
# Desarrollo
npm run dev              # Ejecutar todo
npm run dev:server       # Solo servidor
npm run dev:client       # Solo cliente

# Build
npm run build            # Construir todo
npm run build:types      # Solo tipos
npm run build:server     # Solo servidor
npm run build:client     # Solo cliente

# Producción
npm start                # Iniciar servidor producción

# Tests
npm test                 # Todos los tests
npm run test:server      # Tests servidor
npm run test:client      # Tests cliente

# Docker
docker-compose up        # Levantar con Docker
```

## 🐛 Troubleshooting

### Jugadores no pueden conectarse

✅ **Verificar:**
- Misma red WiFi
- IP local correcta (no 127.0.0.1)
- Firewall permite puerto 3001

**Windows - Abrir puerto:**
```powershell
netsh advfirewall firewall add rule name="Sling Hockey" dir=in action=allow protocol=TCP localport=3001
```

### Error de compilación

```bash
rm -rf node_modules package-lock.json
rm -rf */node_modules */package-lock.json
npm install
```

Más soluciones en [INSTALLATION.md](INSTALLATION.md#solución-de-problemas)

## 🗺️ Roadmap

### v1.1 (Próxima)
- [ ] Soporte táctil mejorado (móviles)
- [ ] Efectos de sonido
- [ ] Power-ups
- [ ] Diferentes modos de juego

### v2.0 (Futuro)
- [ ] Sistema de ranking
- [ ] Replay de partidas
- [ ] Customización de avatares
- [ ] Más tableros temáticos

Ver [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) para más detalles.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para detalles sobre:

- Cómo reportar bugs
- Cómo sugerir características
- Proceso de Pull Requests
- Guía de estilo de código

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más información.

## 👨‍💻 Autor

**JhonHurtado**
- GitHub: [@JhonHurtado](https://github.com/JhonHurtado)
- Repositorio: [Sling_Hockey](https://github.com/JhonHurtado/Sling_Hockey)

## 🙏 Agradecimientos

- [React](https://react.dev/) + [Vite](https://vitejs.dev/) - Excelente DX
- [Socket.IO](https://socket.io/) - WebSockets en tiempo real
- [Matter.js](https://brm.io/matter-js/) - Motor de física 2D
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Componentes accesibles
- La comunidad open source 🌟

## 📞 Soporte

- 🐛 Reportar bugs: [GitHub Issues](https://github.com/JhonHurtado/Sling_Hockey/issues)
- 💬 Discusiones: [GitHub Discussions](https://github.com/JhonHurtado/Sling_Hockey/discussions)
- 📧 Contacto: [GitHub Profile](https://github.com/JhonHurtado)

---

<div align="center">

**¡Diviértete jugando Sling Hockey! 🏒🎮**

Si te gusta el proyecto, ¡dale una ⭐ en GitHub!

[⬆ Volver arriba](#-sling-hockey---juego-multijugador-lan)

</div>
