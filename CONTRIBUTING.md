# Contribuir a Sling Hockey

¡Gracias por tu interés en contribuir! 🎉

## Cómo Contribuir

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/TU-USUARIO/Sling_Hockey.git
cd Sling_Hockey
```

### 2. Crear una Rama

```bash
git checkout -b feature/mi-nueva-caracteristica
# o
git checkout -b fix/corregir-bug
```

### 3. Hacer Cambios

- Escribe código limpio y bien documentado
- Sigue las convenciones de estilo del proyecto
- Agrega tests si es necesario
- Asegúrate de que los tests pasen: `npm test`

### 4. Commit

```bash
git add .
git commit -m "feat: agregar nueva característica"
```

**Formato de commits:**
- `feat:` - Nueva característica
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato (sin afectar código)
- `refactor:` - Refactorización de código
- `test:` - Agregar o corregir tests
- `chore:` - Cambios en build, herramientas, etc.

### 5. Push y Pull Request

```bash
git push origin feature/mi-nueva-caracteristica
```

Luego abre un Pull Request en GitHub.

## Guía de Estilo

### TypeScript
- Usa tipos explícitos cuando sea posible
- Evita `any`
- Usa interfaces para objetos complejos

### React
- Componentes funcionales con hooks
- Props bien tipadas
- Nombres descriptivos

### CSS
- Usa Tailwind CSS
- Clases semánticas
- Responsive design

## Estructura de Código

```
Sling_Hockey/
├── types/          # Tipos compartidos
├── server/         # Backend Node.js
│   ├── src/
│   │   ├── game/    # Lógica del juego
│   │   ├── room/    # Gestión de salas
│   │   └── socket/  # Handlers Socket.IO
└── client/         # Frontend React
    └── src/
        ├── components/  # Componentes UI
        ├── hooks/       # Custom hooks
        └── store/       # Estado global
```

## Reportar Bugs

Usa GitHub Issues con:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica
- Información del sistema

## Solicitar Características

Abre un Issue con:
- Descripción de la característica
- Por qué sería útil
- Posibles implementaciones

## Preguntas

¿Tienes preguntas? Abre un Discussion en GitHub.

¡Gracias por contribuir! 🚀