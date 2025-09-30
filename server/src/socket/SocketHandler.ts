import { Server as SocketServer, Socket } from 'socket.io';
import { RoomManager } from '../room/RoomManager';
import {
  CreateRoomSchema,
  JoinRoomSchema,
  InputSlingSchema,
  ChatSendSchema,
  AssignTeamSchema,
  KickPlayerSchema,
  PlayerRole,
  GameEventType,
  CONSTANTS
} from '@sling-hockey/types';
import { ZodError } from 'zod';

export class SocketHandler {
  private io: SocketServer;
  private roomManager: RoomManager;
  private snapshotIntervals: Map<string, NodeJS.Timeout>;

  constructor(io: SocketServer, roomManager: RoomManager) {
    this.io = io;
    this.roomManager = roomManager;
    this.snapshotIntervals = new Map();
    this.setupEventHandlers();
    this.startCleanupTask();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`🔗 Client connected: ${socket.id}`);

      // Crear sala
      socket.on('room:create', (data) => this.handleCreateRoom(socket, data));

      // Unirse a sala
      socket.on('room:join', (data) => this.handleJoinRoom(socket, data));

      // Salir de sala
      socket.on('room:leave', () => this.handleLeaveRoom(socket));

      // Controles de juego (solo admin)
      socket.on('game:start', () => this.handleGameStart(socket));
      socket.on('game:pause', () => this.handleGamePause(socket));
      socket.on('game:reset', () => this.handleGameReset(socket));

      // Input de juego
      socket.on('input:sling', (data) => this.handleInputSling(socket, data));

      // Chat
      socket.on('chat:send', (data) => this.handleChatSend(socket, data));

      // Admin: asignar equipo
      socket.on('admin:assign-team', (data) => this.handleAssignTeam(socket, data));

      // Admin: expulsar jugador
      socket.on('admin:kick', (data) => this.handleKickPlayer(socket, data));

      // Desconexión
      socket.on('disconnect', () => this.handleDisconnect(socket));
    });
  }

  private handleCreateRoom(socket: Socket, data: any): void {
    try {
      const validated = CreateRoomSchema.parse(data);
      
      const room = this.roomManager.createRoom(
        socket.id,
        validated.hostName,
        validated.hostPlays,
        validated.config
      );

      socket.join(room.code);
      
      // Enviar estado de la sala
      socket.emit('room:state', { room: room.getRoomState() });
      
      console.log(`✅ Room ${room.code} created by ${validated.hostName}`);
    } catch (error) {
      this.handleError(socket, error, 'CREATE_ROOM_FAILED');
    }
  }

  private handleJoinRoom(socket: Socket, data: any): void {
    try {
      const validated = JoinRoomSchema.parse(data);
      const room = this.roomManager.getRoom(validated.code);

      if (!room) {
        throw new Error('Room not found');
      }

      if (!room.canAddPlayer()) {
        throw new Error('Room is full');
      }

      // Añadir jugador a la sala
      const player = room.addPlayer(
        socket.id,
        validated.name,
        validated.role || PlayerRole.PLAYER
      );

      this.roomManager.joinRoom(validated.code, socket.id);
      socket.join(validated.code);

      // Notificar a todos en la sala
      this.io.to(validated.code).emit('room:state', { room: room.getRoomState() });
      
      this.io.to(validated.code).emit('game:event', {
        type: GameEventType.PLAYER_JOINED,
        payload: { player },
        timestamp: Date.now()
      });

      console.log(`✅ ${validated.name} joined room ${validated.code}`);
    } catch (error) {
      this.handleError(socket, error, 'JOIN_ROOM_FAILED');
    }
  }

  private handleLeaveRoom(socket: Socket): void {
    const room = this.roomManager.getRoomByPlayerId(socket.id);
    if (!room) return;

    const player = room.getPlayer(socket.id);
    const roomCode = room.code;

    this.roomManager.leaveRoom(socket.id);
    socket.leave(roomCode);

    // Detener snapshots si el host se va
    if (room.isHost(socket.id)) {
      this.stopSnapshotLoop(roomCode);
    }

    // Notificar a otros jugadores
    if (player) {
      this.io.to(roomCode).emit('game:event', {
        type: GameEventType.PLAYER_LEFT,
        payload: { player },
        timestamp: Date.now()
      });
    }

    // Si la sala aún existe, actualizar estado
    const updatedRoom = this.roomManager.getRoom(roomCode);
    if (updatedRoom) {
      this.io.to(roomCode).emit('room:state', { room: updatedRoom.getRoomState() });
    }

    console.log(`🚪 ${player?.name || socket.id} left room ${roomCode}`);
  }

  private handleGameStart(socket: Socket): void {
    const room = this.roomManager.getRoomByPlayerId(socket.id);
    if (!room || !room.isHost(socket.id)) {
      this.sendError(socket, 'UNAUTHORIZED', 'Only host can start the game');
      return;
    }

    const gameEngine = room.getGameEngine();
    gameEngine.start();

    // Iniciar loop de snapshots
    this.startSnapshotLoop(room.code);

    this.io.to(room.code).emit('room:state', { room: room.getRoomState() });
    console.log(`▶️ Game started in room ${room.code}`);
  }

  private handleGamePause(socket: Socket): void {
    const room = this.roomManager.getRoomByPlayerId(socket.id);
    if (!room || !room.isHost(socket.id)) {
      this.sendError(socket, 'UNAUTHORIZED', 'Only host can pause the game');
      return;
    }

    const gameEngine = room.getGameEngine();
    gameEngine.pause();

    this.stopSnapshotLoop(room.code);

    this.io.to(room.code).emit('room:state', { room: room.getRoomState() });
    console.log(`⏸️ Game paused in room ${room.code}`);
  }

  private handleGameReset(socket: Socket): void {
    const room = this.roomManager.getRoomByPlayerId(socket.id);
    if (!room || !room.isHost(socket.id)) {
      this.sendError(socket, 'UNAUTHORIZED', 'Only host can reset the game');
      return;
    }

    const gameEngine = room.getGameEngine();
    gameEngine.reset();

    this.stopSnapshotLoop(room.code);

    this.io.to(room.code).emit('room:state', { room: room.getRoomState() });
    console.log(`🔄 Game reset in room ${room.code}`);
  }

  private handleInputSling(socket: Socket, data: any): void {
    try {
      const validated = InputSlingSchema.parse(data);
      const room = this.roomManager.getRoomByPlayerId(socket.id);
      
      if (!room) return;

      const gameEngine = room.getGameEngine();
      gameEngine.handleInput(validated);
    } catch (error) {
      this.handleError(socket, error, 'INVALID_INPUT');
    }
  }

  private handleChatSend(socket: Socket, data: any): void {
    try {
      const validated = ChatSendSchema.parse(data);
      const room = this.roomManager.getRoomByPlayerId(socket.id);
      
      if (!room) return;

      const player = room.getPlayer(socket.id);
      if (!player) return;

      this.io.to(room.code).emit('chat:msg', {
        playerId: player.id,
        playerName: player.name,
        text: validated.text,
        timestamp: Date.now()
      });
    } catch (error) {
      this.handleError(socket, error, 'CHAT_FAILED');
    }
  }

  private handleAssignTeam(socket: Socket, data: any): void {
    try {
      const validated = AssignTeamSchema.parse(data);
      const room = this.roomManager.getRoomByPlayerId(socket.id);
      
      if (!room || !room.isHost(socket.id)) {
        this.sendError(socket, 'UNAUTHORIZED', 'Only host can assign teams');
        return;
      }

      room.updatePlayerTeam(validated.playerId, validated.team);
      this.io.to(room.code).emit('room:state', { room: room.getRoomState() });
    } catch (error) {
      this.handleError(socket, error, 'ASSIGN_TEAM_FAILED');
    }
  }

  private handleKickPlayer(socket: Socket, data: any): void {
    try {
      const validated = KickPlayerSchema.parse(data);
      const room = this.roomManager.getRoomByPlayerId(socket.id);
      
      if (!room || !room.isHost(socket.id)) {
        this.sendError(socket, 'UNAUTHORIZED', 'Only host can kick players');
        return;
      }

      const playerToKick = room.getPlayer(validated.playerId);
      if (!playerToKick) return;

      // Enviar notificación al jugador expulsado
      this.io.to(validated.playerId).emit('error', {
        code: 'KICKED',
        message: 'You have been kicked from the room'
      });

      // Remover jugador
      room.removePlayer(validated.playerId);
      this.roomManager.leaveRoom(validated.playerId);
      
      // Actualizar estado
      this.io.to(room.code).emit('room:state', { room: room.getRoomState() });
    } catch (error) {
      this.handleError(socket, error, 'KICK_FAILED');
    }
  }

  private handleDisconnect(socket: Socket): void {
    const room = this.roomManager.getRoomByPlayerId(socket.id);
    if (room) {
      room.updatePlayerConnection(socket.id, false);
      this.handleLeaveRoom(socket);
    }
    console.log(`🔗 Client disconnected: ${socket.id}`);
  }

  private startSnapshotLoop(roomCode: string): void {
    // Si ya existe un loop, detenerlo
    this.stopSnapshotLoop(roomCode);

    const interval = setInterval(() => {
      const room = this.roomManager.getRoom(roomCode);
      if (!room) {
        this.stopSnapshotLoop(roomCode);
        return;
      }

      const gameEngine = room.getGameEngine();
      gameEngine.update();

      // Enviar snapshot
      this.io.to(roomCode).emit('game:snapshot', {
        state: gameEngine.getGameState(),
        timestamp: Date.now()
      });

      // Si el juego terminó, detener loop
      if (gameEngine.isFinished()) {
        this.stopSnapshotLoop(roomCode);
        this.io.to(roomCode).emit('game:event', {
          type: GameEventType.GAME_END,
          payload: { state: gameEngine.getGameState() },
          timestamp: Date.now()
        });
      }
    }, 1000 / CONSTANTS.SNAPSHOT_RATE);

    this.snapshotIntervals.set(roomCode, interval);
  }

  private stopSnapshotLoop(roomCode: string): void {
    const interval = this.snapshotIntervals.get(roomCode);
    if (interval) {
      clearInterval(interval);
      this.snapshotIntervals.delete(roomCode);
    }
  }

  private startCleanupTask(): void {
    // Limpiar salas inactivas cada 5 minutos
    setInterval(() => {
      this.roomManager.cleanup();
    }, 5 * 60 * 1000);
  }

  private handleError(socket: Socket, error: any, code: string): void {
    console.error(`❌ ${code}:`, error);
    
    let message = 'An error occurred';
    
    if (error instanceof ZodError) {
      message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    } else if (error instanceof Error) {
      message = error.message;
    }

    this.sendError(socket, code, message);
  }

  private sendError(socket: Socket, code: string, message: string): void {
    socket.emit('error', { code, message });
  }
}