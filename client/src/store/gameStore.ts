import { create } from 'zustand';
import { Player, GameState, GameConfig, RoomStatePayload } from '@sling-hockey/types';

interface GameStore {
  // Room state
  roomCode: string | null;
  hostId: string | null;
  players: Player[];
  config: GameConfig | null;
  
  // Game state
  gameState: GameState | null;
  
  // Local player
  playerId: string | null;
  playerName: string | null;
  
  // Connection
  isConnected: boolean;
  error: string | null;
  
  // Actions
  setRoomState: (payload: RoomStatePayload) => void;
  setGameState: (state: GameState) => void;
  setPlayerId: (id: string) => void;
  setPlayerName: (name: string) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // Initial state
  roomCode: null,
  hostId: null,
  players: [],
  config: null,
  gameState: null,
  playerId: null,
  playerName: null,
  isConnected: false,
  error: null,
  
  // Actions
  setRoomState: (payload: RoomStatePayload) => {
    set({
      roomCode: payload.room.code,
      hostId: payload.room.hostId,
      players: payload.room.players,
      config: payload.room.config,
      gameState: payload.room.gameState,
    });
  },
  
  setGameState: (state: GameState) => {
    set({ gameState: state });
  },
  
  setPlayerId: (id: string) => {
    set({ playerId: id });
  },
  
  setPlayerName: (name: string) => {
    set({ playerName: name });
  },
  
  setConnected: (connected: boolean) => {
    set({ isConnected: connected });
  },
  
  setError: (error: string | null) => {
    set({ error });
  },
  
  reset: () => {
    set({
      roomCode: null,
      hostId: null,
      players: [],
      config: null,
      gameState: null,
      error: null,
    });
  },
}));