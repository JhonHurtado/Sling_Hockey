// Constantes del cliente

export const ROUTES = {
  HOME: '/',
  LOBBY: '/lobby',
  GAME: '/game',
} as const;

export const STORAGE_KEYS = {
  PLAYER_NAME: 'sling_hockey_player_name',
  THEME: 'sling_hockey_theme',
} as const;

export const COLORS = {
  RED_TEAM: '#ef4444',
  BLUE_TEAM: '#3b82f6',
  BOARD_BG: '#1e293b',
  LINE_COLOR: '#ffffff',
} as const;

export const GAME_CONFIG = {
  CANVAS: {
    MIN_WIDTH: 600,
    MIN_HEIGHT: 400,
    MAX_WIDTH: 1200,
    MAX_HEIGHT: 800,
  },
  PUCK: {
    MIN_DRAG_DISTANCE: 10,
    MAX_DRAG_DISTANCE: 150,
  },
} as const;

export const MESSAGES = {
  ERRORS: {
    CONNECTION_FAILED: 'No se pudo conectar al servidor',
    ROOM_NOT_FOUND: 'Sala no encontrada',
    ROOM_FULL: 'La sala está llena',
    INVALID_CODE: 'Código de sala inválido',
    KICKED: 'Has sido expulsado de la sala',
  },
  SUCCESS: {
    ROOM_CREATED: 'Sala creada exitosamente',
    JOINED_ROOM: 'Te has unido a la sala',
    CODE_COPIED: 'Código copiado al portapapeles',
  },
} as const;