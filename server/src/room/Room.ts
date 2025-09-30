import { Player, PlayerRole, Team, GameConfig, CONSTANTS } from '@sling-hockey/types';
import { GameEngine } from '../game/GameEngine';
import { nanoid } from 'nanoid';

export class Room {
  public readonly code: string;
  public readonly hostId: string;
  public readonly createdAt: number;
  private players: Map<string, Player>;
  private config: GameConfig;
  private gameEngine: GameEngine;

  constructor(hostId: string, hostName: string, hostPlays: boolean, config?: Partial<GameConfig>) {
    this.code = nanoid(CONSTANTS.MAX_ROOM_CODE_LENGTH);
    this.hostId = hostId;
    this.createdAt = Date.now();
    this.players = new Map();
    
    // Configuración del juego
    this.config = {
      ...CONSTANTS.DEFAULT_CONFIG,
      ...config
    };

    // Agregar host
    this.addPlayer(hostId, hostName, PlayerRole.ADMIN, hostPlays ? Team.NONE : Team.NONE);
    
    // Inicializar motor de juego
    this.gameEngine = new GameEngine(this.config);
  }

  public addPlayer(id: string, name: string, role: PlayerRole, team: Team = Team.NONE): Player {
    const player: Player = {
      id,
      name,
      role,
      team,
      isConnected: true,
      joinedAt: Date.now()
    };
    
    this.players.set(id, player);
    return player;
  }

  public removePlayer(id: string): boolean {
    return this.players.delete(id);
  }

  public getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  public getPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  public updatePlayerTeam(playerId: string, team: Team): boolean {
    const player = this.players.get(playerId);
    if (!player) return false;
    
    player.team = team;
    return true;
  }

  public updatePlayerConnection(playerId: string, isConnected: boolean): boolean {
    const player = this.players.get(playerId);
    if (!player) return false;
    
    player.isConnected = isConnected;
    return true;
  }

  public canAddPlayer(): boolean {
    return this.players.size < this.config.maxPlayers;
  }

  public isHost(playerId: string): boolean {
    return playerId === this.hostId;
  }

  public getConfig(): GameConfig {
    return { ...this.config };
  }

  public getGameEngine(): GameEngine {
    return this.gameEngine;
  }

  public getRoomState() {
    return {
      code: this.code,
      hostId: this.hostId,
      players: this.getPlayers(),
      config: this.config,
      gameState: this.gameEngine.getGameState()
    };
  }

  public getPlayerCount(): number {
    return this.players.size;
  }

  public hasActivePlayers(): boolean {
    return Array.from(this.players.values()).some(p => p.isConnected);
  }
}