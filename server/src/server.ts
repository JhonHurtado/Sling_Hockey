import express from 'express';
import { createServer as createHttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { SocketHandler } from './socket/SocketHandler';
import { RoomManager } from './room/RoomManager';

export function createServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  
  // Configurar CORS
  const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  };
  
  app.use(cors(corsOptions));
  app.use(express.json());

  // Socket.IO con CORS
  const io = new SocketServer(httpServer, {
    cors: corsOptions,
    transports: ['websocket', 'polling']
  });

  // Inicializar gestores
  const roomManager = new RoomManager();
  const socketHandler = new SocketHandler(io, roomManager);

  // Servir cliente en producción
  if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../../client/dist');
    app.use(express.static(clientBuildPath));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      rooms: roomManager.getRoomCount(),
      timestamp: Date.now()
    });
  });

  return { app, httpServer, io, roomManager, socketHandler };
}

export default createServer;