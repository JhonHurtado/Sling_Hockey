// Helper para localStorage

import { STORAGE_KEYS } from './constants';

export const localStorageHelper = {
  getPlayerName: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.PLAYER_NAME);
    } catch {
      return null;
    }
  },

  setPlayerName: (name: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name);
    } catch {
      console.warn('No se pudo guardar el nombre en localStorage');
    }
  },

  clearPlayerName: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PLAYER_NAME);
    } catch {
      console.warn('No se pudo limpiar el nombre de localStorage');
    }
  },

  getTheme: (): 'light' | 'dark' | null => {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      return theme as 'light' | 'dark' | null;
    } catch {
      return null;
    }
  },

  setTheme: (theme: 'light' | 'dark'): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      console.warn('No se pudo guardar el tema en localStorage');
    }
  },
};