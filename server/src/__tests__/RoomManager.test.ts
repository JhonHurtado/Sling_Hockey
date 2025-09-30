import { RoomManager } from '../room/RoomManager';
import { PlayerRole } from '@sling-hockey/types';

describe('RoomManager', () => {
  let roomManager: RoomManager;

  beforeEach(() => {
    roomManager = new RoomManager();
  });

  describe('createRoom', () => {
    it('should create a new room with unique code', () => {
      const room = roomManager.createRoom('host1', 'Alice', true);
      
      expect(room.code).toBeDefined();
      expect(room.code).toHaveLength(6);
      expect(room.hostId).toBe('host1');
    });

    it('should add host as player', () => {
      const room = roomManager.createRoom('host1', 'Alice', true);
      const players = room.getPlayers();
      
      expect(players).toHaveLength(1);
      expect(players[0].name).toBe('Alice');
      expect(players[0].role).toBe(PlayerRole.ADMIN);
    });
  });

  describe('joinRoom', () => {
    it('should allow player to join existing room', () => {
      const room = roomManager.createRoom('host1', 'Alice', true);
      const result = roomManager.joinRoom(room.code, 'player1');
      
      expect(result).toBe(true);
    });

    it('should return false for non-existent room', () => {
      const result = roomManager.joinRoom('INVALID', 'player1');
      
      expect(result).toBe(false);
    });
  });

  describe('leaveRoom', () => {
    it('should remove player from room', () => {
      const room = roomManager.createRoom('host1', 'Alice', true);
      roomManager.joinRoom(room.code, 'player1');
      room.addPlayer('player1', 'Bob', PlayerRole.PLAYER);
      
      const result = roomManager.leaveRoom('player1');
      
      expect(result).toBe(true);
      expect(room.getPlayers()).toHaveLength(1);
    });

    it('should delete room when host leaves', () => {
      const room = roomManager.createRoom('host1', 'Alice', true);
      const roomCode = room.code;
      
      roomManager.leaveRoom('host1');
      
      expect(roomManager.getRoom(roomCode)).toBeUndefined();
    });
  });

  describe('getRoomByPlayerId', () => {
    it('should return room for player', () => {
      const room = roomManager.createRoom('host1', 'Alice', true);
      
      const foundRoom = roomManager.getRoomByPlayerId('host1');
      
      expect(foundRoom).toBeDefined();
      expect(foundRoom?.code).toBe(room.code);
    });

    it('should return undefined for non-existent player', () => {
      const foundRoom = roomManager.getRoomByPlayerId('nonexistent');
      
      expect(foundRoom).toBeUndefined();
    });
  });
});