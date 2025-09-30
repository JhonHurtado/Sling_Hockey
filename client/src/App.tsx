import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useGameStore } from '@/store/gameStore';
import { GameEventType } from '@sling-hockey/types';
import Home from '@/components/screens/Home';
import Lobby from '@/components/screens/Lobby';
import Game from '@/components/screens/Game';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';

type Screen = 'home' | 'lobby' | 'game';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const { roomCode, gameState } = useGameStore();
  const { toast } = useToast();

  const socket = useSocket({
    onGameEvent: (event) => {
      if (event.type === GameEventType.PLAYER_JOINED) {
        toast({
          title: '👋 Jugador unido',
          description: `${event.payload.player.name} se ha unido a la sala`,
        });
      } else if (event.type === GameEventType.PLAYER_LEFT) {
        toast({
          title: '🚪 Jugador salió',
          description: `${event.payload.player.name} ha salido de la sala`,
        });
      } else if (event.type === GameEventType.GAME_END) {
        toast({
          title: '🏆 Juego terminado',
          description: 'La partida ha finalizado',
        });
      }
    },
    onError: (error) => {
      if (error.code === 'KICKED') {
        toast({
          variant: 'destructive',
          title: 'Expulsado',
          description: error.message,
        });
        setCurrentScreen('home');
      }
    },
  });

  // Navegación automática basada en el estado
  useEffect(() => {
    if (roomCode && gameState) {
      if (gameState.status === 'playing') {
        setCurrentScreen('game');
      } else {
        setCurrentScreen('lobby');
      }
    } else if (!roomCode) {
      setCurrentScreen('home');
    }
  }, [roomCode, gameState?.status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {currentScreen === 'home' && <Home socket={socket} />}
        {currentScreen === 'lobby' && <Lobby socket={socket} />}
        {currentScreen === 'game' && <Game socket={socket} />}
      </div>
      <Toaster />
    </div>
  );
}

export default App;