import dotenv from 'dotenv';
import { createServer } from './server.js';
import os from 'os';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function start() {
  try {
    const { httpServer, io } = createServer();

    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log('\n🏒 Sling Hockey Server');
      console.log('========================');
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`Server listening on port ${PORT}`);
      console.log(`Local: http://localhost:${PORT}`);
      
      // Obtener IP local
      const networkInterfaces = os.networkInterfaces();
      const addresses: string[] = [];
      
      for (const name of Object.keys(networkInterfaces)) {
        const nets = networkInterfaces[name];
        if (nets) {
          for (const net of nets) {
            // IPv4 y no loopback
            if (net.family === 'IPv4' && !net.internal) {
              addresses.push(net.address);
            }
          }
        }
      }
      
      if (addresses.length > 0) {
        console.log('\nLAN Access:');
        addresses.forEach(addr => {
          console.log(`  http://${addr}:${PORT}`);
        });
      }
      
      console.log('\n✅ Server ready for LAN multiplayer!');
      console.log('========================\n');
    });

    // Manejo de errores
    process.on('SIGTERM', () => {
      console.log('\nSIGTERM received, closing server...');
      httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\nSIGINT received, closing server...');
      httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();