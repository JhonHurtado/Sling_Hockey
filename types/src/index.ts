import { z } from 'zod';

// ========== ENUMS ==========

export enum PlayerRole {
  ADMIN = 'admin',
  PLAYER = 'player',
  SPECTATOR = 'spectator'
}

export enum Team {
  RED = 'red',
  BLUE = 'blue',
  NONE = 'none'
}

export enum GameStatus {
  WAITING = 'waiting',
  PLAYING = 'playing',
  PAUSED = 'paused',
  FINISHED = 'finished'
}

export enum GameEventType {
  PUCK_SCORED = 'puck_scored',
  ROUND_END = 'round_end',
  GAME_END = 'game_end',
  PLAYER_JOINED = 'player_joined',
  PLAYER_LEFT = 'player_left'
}

// ========== TYPES ==========

export interface Vector2D {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  team: Team;
  isConnected: boolean;
  joinedAt: number;
}

export interface Puck {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  team: Team;
}

export interface GameConfig {
  maxPlayers: number;
  roundDuration: number; // seconds
  pucksPerTeam: number;
  boardWidth: number;
  boardHeight: number;
}

export interface GameState {
  status: GameStatus;
  pucks: Puck[];
  score: {
    red: number;
    blue: number;
  };
  timeRemaining: number;
  currentRound: number;
}

export interface Room {
  code: string;
  hostId: string;
  players: Map<string, Player>;
  config: GameConfig;
  gameState: GameState;
  createdAt: number;
}

// ========== SOCKET EVENT SCHEMAS (ZOD) ==========

// Client -> Server
export const CreateRoomSchema = z.object({
  hostName: z.string().min(1).max(50),
  hostPlays: z.boolean(),
  config: z.object({
    maxPlayers: z.number().min(2).max(4),
    roundDuration: z.number().min(30).max(600),
    pucksPerTeam: z.number().min(3).max(10),
    boardWidth: z.number().positive(),
    boardHeight: z.number().positive()
  }).optional()
});

export const JoinRoomSchema = z.object({
  code: z.string().length(6),
  name: z.string().min(1).max(50),
  role: z.nativeEnum(PlayerRole).optional()
});

export const InputSlingSchema = z.object({
  puckId: z.string(),
  origin: z.object({
    x: z.number(),
    y: z.number()
  }),
  pullVector: z.object({
    x: z.number(),
    y: z.number()
  })
});

export const ChatSendSchema = z.object({
  text: z.string().min(1).max(500)
});

export const AssignTeamSchema = z.object({
  playerId: z.string(),
  team: z.nativeEnum(Team)
});

export const KickPlayerSchema = z.object({
  playerId: z.string()
});

// Server -> Client
export interface RoomStatePayload {
  room: {
    code: string;
    hostId: string;
    players: Player[];
    config: GameConfig;
    gameState: GameState;
  };
}

export interface GameSnapshotPayload {
  state: GameState;
  timestamp: number;
}

export interface GameEventPayload {
  type: GameEventType;
  payload: any;
  timestamp: number;
}

export interface ChatMessagePayload {
  playerId: string;
  playerName: string;
  text: string;
  timestamp: number;
}

export interface ErrorPayload {
  code: string;
  message: string;
}

// ========== SOCKET EVENT TYPES ==========

export type CreateRoomData = z.infer<typeof CreateRoomSchema>;
export type JoinRoomData = z.infer<typeof JoinRoomSchema>;
export type InputSlingData = z.infer<typeof InputSlingSchema>;
export type ChatSendData = z.infer<typeof ChatSendSchema>;
export type AssignTeamData = z.infer<typeof AssignTeamSchema>;
export type KickPlayerData = z.infer<typeof KickPlayerSchema>;

// ========== CONSTANTS ==========

export const CONSTANTS = {
  SNAPSHOT_RATE: 20, // FPS para snapshots
  MAX_ROOM_CODE_LENGTH: 6,
  DEFAULT_CONFIG: {
    maxPlayers: 4,
    roundDuration: 180,
    pucksPerTeam: 5,
    boardWidth: 800,
    boardHeight: 600
  } as GameConfig,
  PHYSICS: {
    PUCK_RADIUS: 15,
    FRICTION: 0.98,
    RESTITUTION: 0.8,
    MAX_VELOCITY: 20
  }
};

export default {
  PlayerRole,
  Team,
  GameStatus,
  GameEventType,
  CreateRoomSchema,
  JoinRoomSchema,
  InputSlingSchema,
  ChatSendSchema,
  AssignTeamSchema,
  KickPlayerSchema,
  CONSTANTS
};