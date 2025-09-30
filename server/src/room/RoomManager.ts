import { Room } from './Room.js';
import { GameConfig } from '@sling-hockey/types';

export class RoomManager {
  private rooms: Map<string, Room>;
  private playerToRoom: Map<string, string>; // playerId -> roomCode

  constructor() {
    this.rooms = new Map();
    this.playerToRoom = new Map();
  }

  public createRoom(
    hostId: string,
    hostName: string,
    hostPlays: boolean,
    config?: Partial<GameConfig>
  ): Room {
    const room = new Room(hostId, hostName, hostPlays, config);
    this.rooms.set(room.code, room);
    this.playerToRoom.set(hostId, room.code);
    
    console.log(`🎮 Room created: ${room.code} by ${hostName}`);
    return room;
  }

  public getRoom(code: string): Room | undefined {
    return this.rooms.get(code);
  }

  public getRoomByPlayerId(playerId: string): Room | undefined {
    const roomCode = this.playerToRoom.get(playerId);
    return roomCode ? this.rooms.get(roomCode) : undefined;
  }

  public joinRoom(roomCode: string, playerId: string): boolean {
    const room = this.rooms.get(roomCode);
    if (!room) return false;
    
    // Verificar si la sala está llena
    if (!room.canAddPlayer()) return false;

    this.playerToRoom.set(playerId, roomCode);
    return true;
  }

  public leaveRoom(playerId: string): boolean {
    const roomCode = this.playerToRoom.get(playerId);
    if (!roomCode) return false;

    const room = this.rooms.get(roomCode);
    if (!room) return false;

    room.removePlayer(playerId);
    this.playerToRoom.delete(playerId);

    // Si el host se va, eliminar la sala
    if (room.isHost(playerId)) {
      this.deleteRoom(roomCode);
      console.log(`🚪 Room closed: ${roomCode} (host left)`);
    }
    // Si no quedan jugadores activos, eliminar la sala
    else if (!room.hasActivePlayers()) {
      this.deleteRoom(roomCode);
      console.log(`🚪 Room closed: ${roomCode} (no active players)`);
    }

    return true;
  }

  private deleteRoom(roomCode: string): void {
    const room = this.rooms.get(roomCode);
    if (!room) return;

    // Limpiar referencias de jugadores
    for (const player of room.getPlayers()) {
      this.playerToRoom.delete(player.id);
    }

    this.rooms.delete(roomCode);
  }

  public getRoomCount(): number {
    return this.rooms.size;
  }

  public getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  public cleanup(): void {
    // Limpiar salas inactivas (sin jugadores conectados)
    const roomsToDelete: string[] = [];

    for (const [code, room] of this.rooms.entries()) {
      if (!room.hasActivePlayers()) {
        roomsToDelete.push(code);
      }
    }

    for (const code of roomsToDelete) {
      this.deleteRoom(code);
      console.log(`🧹 Cleaned up inactive room: ${code}`);
    }
  }
}