import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '@/store/gameStore';
import {
  RoomStatePayload,
  GameSnapshotPayload,
  GameEventPayload,
  ChatMessagePayload,
  ErrorPayload,
  CreateRoomData,
  JoinRoomData,
  InputSlingData,
  ChatSendData,
  AssignTeamData,
  KickPlayerData,
} from '@sling-hockey/types';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

interface UseSocketOptions {
  onGameEvent?: (event: GameEventPayload) => void;
  onChatMessage?: (message: ChatMessagePayload) => void;
  onError?: (error: ErrorPayload) => void;
}

export function useSocket(options?: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const { setRoomState, setGameState, setPlayerId, setConnected, setError } = useGameStore();

  useEffect(() => {
    // Conectar al servidor
    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Event handlers
    socket.on('connect', () => {
      console.log('✅ Connected to server:', socket.id);
      setConnected(true);
      setPlayerId(socket.id!);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setConnected(false);
    });

    socket.on('room:state', (payload: RoomStatePayload) => {
      console.log('📦 Room state updated:', payload);
      setRoomState(payload);
    });

    socket.on('game:snapshot', (payload: GameSnapshotPayload) => {
      setGameState(payload.state);
    });

    socket.on('game:event', (event: GameEventPayload) => {
      console.log('🎮 Game event:', event);
      options?.onGameEvent?.(event);
    });

    socket.on('chat:msg', (message: ChatMessagePayload) => {
      options?.onChatMessage?.(message);
    });

    socket.on('error', (error: ErrorPayload) => {
      console.error('❌ Socket error:', error);
      setError(error.message);
      options?.onError?.(error);
    });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

  // API methods
  const createRoom = (data: CreateRoomData) => {
    socketRef.current?.emit('room:create', data);
  };

  const joinRoom = (data: JoinRoomData) => {
    socketRef.current?.emit('room:join', data);
  };

  const leaveRoom = () => {
    socketRef.current?.emit('room:leave');
  };

  const startGame = () => {
    socketRef.current?.emit('game:start');
  };

  const pauseGame = () => {
    socketRef.current?.emit('game:pause');
  };

  const resetGame = () => {
    socketRef.current?.emit('game:reset');
  };

  const sendInput = (data: InputSlingData) => {
    socketRef.current?.emit('input:sling', data);
  };

  const sendChatMessage = (data: ChatSendData) => {
    socketRef.current?.emit('chat:send', data);
  };

  const assignTeam = (data: AssignTeamData) => {
    socketRef.current?.emit('admin:assign-team', data);
  };

  const kickPlayer = (data: KickPlayerData) => {
    socketRef.current?.emit('admin:kick', data);
  };

  return {
    socket: socketRef.current,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    pauseGame,
    resetGame,
    sendInput,
    sendChatMessage,
    assignTeam,
    kickPlayer,
  };
}