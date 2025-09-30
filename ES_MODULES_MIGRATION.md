# 🔧 Solución: Error de Exportaciones de Módulos

## Problema Identificado

```
Uncaught SyntaxError: The requested module does not provide an export named 'PlayerRole'
```

### Causa

El paquete `@sling-hockey/types` estaba configurado para **CommonJS**, pero Vite requiere **módulos ES (ESM)**. Esto causaba incompatibilidad en las exportaciones.

## Solución Implementada

### 1. **Actualizado `types/tsconfig.json`**

Cambiado de CommonJS a ESNext:

```json
{
  "compilerOptions": {
    "module": "ESNext",  // ← Era "commonjs"
    "moduleResolution": "node"
  }
}
```

### 2. **Actualizado `types/package.json`**

Agregado soporte para ES modules:

```json
{
  "type": "module",  // ← Nuevo
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    }
  }
}
```

### 3. **Actualizado `server/package.json` y `server/tsconfig.json`**

El servidor también necesita ser compatible con ES modules:

**package.json:**
```json
{
  "type": "module"
}
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "module": "ESNext"
  }
}
```

### 4. **Archivos del servidor actualizados con extensiones .js**

En ES modules, las importaciones deben incluir la extensión `.js`:

```typescript
// ❌ Antes (sin extensión)
import { createServer } from './server';

// ✅ Ahora (con extensión)
import { createServer } from './server.js';
```

## Pasos Para Aplicar la Solución

### En tu máquina local:

```bash
# 1. Pull los últimos cambios
git pull origin main

# 2. Limpiar instalaciones anteriores
rm -rf types/dist
rm -rf server/dist
rm -rf client/dist
rm -rf node_modules */node_modules

# 3. Reinstalar dependencias
npm install
cd types && npm install && cd ..
cd server && npm install && cd ..
cd client && npm install && cd ..

# 4. Reconstruir el paquete de tipos
cd types
npm run build
cd ..

# 5. Verificar que se generó correctamente
ls -la types/dist/
# Deberías ver: index.js e index.d.ts

# 6. Ejecutar el proyecto
npm run dev
```

## Verificación

### 1. Comprobar que los tipos se compilaron:

```bash
cat types/dist/index.js | head -n 20
```

Deberías ver exportaciones ES module como:
```javascript
export var PlayerRole;
(function (PlayerRole) {
    PlayerRole["ADMIN"] = "admin";
    PlayerRole["PLAYER"] = "player";
    PlayerRole["SPECTATOR"] = "spectator";
})(PlayerRole || (PlayerRole = {}));
```

### 2. Verificar que el servidor inicia sin errores:

```bash
cd server
npm run dev
```

### 3. Verificar que el cliente inicia sin errores:

```bash
cd client
npm run dev
```

## Archivos Modificados

✅ `types/tsconfig.json` - Configurado para ES modules  
✅ `types/package.json` - Agregado `"type": "module"` y exports  
✅ `server/tsconfig.json` - Configurado para ES modules  
✅ `server/package.json` - Agregado `"type": "module"`  
✅ `server/src/index.ts` - Actualizado imports con `.js`  
✅ `server/src/server.ts` - Actualizado imports con `.js`  

## ⚠️ Nota Importante

**Los archivos del servidor que importan otros módulos locales necesitan actualización:**

Todos los imports en:
- `server/src/game/` 
- `server/src/room/`
- `server/src/socket/`

Deben usar la extensión `.js`:

```typescript
// Ejemplo en SocketHandler.ts
import { RoomManager } from '../room/RoomManager.js';  // ← Agregar .js
import { CreateRoomSchema } from '@sling-hockey/types';  // ← Sin .js (es paquete npm)
```

## Si Aún Tienes Problemas

### Problema: "Cannot find module"

```bash
# Asegúrate de que los tipos estén construidos
cd types && npm run build && cd ..

# Verifica que el archivo existe
ls types/dist/index.js

# Si no existe, hay un error de compilación
cd types
npx tsc --noEmit  # Ver errores sin generar archivos
```

### Problema: "Unexpected token 'export'"

Esto significa que Node.js está interpretando archivos ES como CommonJS.

**Solución:**
- Verifica que `package.json` tenga `"type": "module"`
- O renombra archivos `.ts` a `.mts` (TypeScript ES Module)

### Problema: Cliente funciona pero servidor no

El servidor puede estar usando imports sin extensión `.js`.

**Solución:**
Busca y reemplaza todos los imports locales:

```bash
cd server/src
# Buscar imports sin .js
grep -r "from '\\./" . | grep -v ".js'"

# Agregar .js a todos los imports locales
```

## Comandos de Diagnóstico

```bash
# Ver configuración de module en package.json
cat types/package.json | grep "type"
cat server/package.json | grep "type"

# Ver qué módulos exporta types
node -e "import('@sling-hockey/types').then(m => console.log(Object.keys(m)))"

# Verificar sintaxis TypeScript
cd types && npx tsc --noEmit
cd ../server && npx tsc --noEmit

# Verificar que Node.js soporta ES modules
node --version  # Debe ser >= 14
```

## Recursos Adicionales

- [Node.js ES Modules](https://nodejs.org/api/esm.html)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Vite SSR External](https://vitejs.dev/guide/ssr.html#ssr-externals)

---

**Última actualización:** Septiembre 30, 2025  
**Versión:** 1.0.1 (con soporte completo para ES modules)
