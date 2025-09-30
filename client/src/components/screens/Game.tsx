import { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';
import { Team } from '@sling-hockey/types';
import { ArrowLeft } from 'lucide-react';
import GameCanvas from '@/components/game/GameCanvas';

interface GameProps {
  socket: ReturnType<typeof import('@/hooks/useSocket').useSocket>;
}

export default function Game({ socket }: GameProps) {
  const { gameState, config, players, playerId, hostId } = useGameStore();
  const isHost = playerId === hostId;

  if (!gameState || !config) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card>
          <CardContent className="p-6">
            <p>Cargando juego...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Scoreboard */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Equipo Rojo */}
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">🔴 Equipo Rojo</div>
              <div className="text-4xl font-bold text-red-600">{gameState.score.red}</div>
            </div>

            {/* Tiempo */}
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Tiempo</div>
              <div className="text-3xl font-mono font-bold">
                {formatTime(gameState.timeRemaining)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Ronda {gameState.currentRound}
              </div>
            </div>

            {/* Equipo Azul */}
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">🔵 Equipo Azul</div>
              <div className="text-4xl font-bold text-blue-600">{gameState.score.blue}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Canvas */}
      <Card>
        <CardContent className="p-4">
          <GameCanvas 
            gameState={gameState}
            config={config}
            onSling={(puckId, origin, pullVector) => {
              socket.sendInput({ puckId, origin, pullVector });
            }}
          />
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => socket.leaveRoom()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Lobby
        </Button>

        {isHost && (
          <div className="flex gap-2">
            {gameState.status === 'playing' && (
              <Button onClick={() => socket.pauseGame()}>
                Pausar
              </Button>
            )}
            {gameState.status === 'paused' && (
              <Button onClick={() => socket.startGame()}>
                Reanudar
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Game Status */}
      {gameState.status === 'paused' && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="p-4 text-center">
            <p className="text-yellow-700 dark:text-yellow-300 font-medium">
              ⏸️ Juego en pausa
            </p>
          </CardContent>
        </Card>
      )}

      {gameState.status === 'finished' && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">🏆 Juego Terminado</h2>
            <p className="text-lg">
              {gameState.score.red > gameState.score.blue
                ? '🔴 Equipo Rojo gana!'
                : gameState.score.blue > gameState.score.red
                ? '🔵 Equipo Azul gana!'
                : '🤝 Empate!'}
            </p>
            {isHost && (
              <Button className="mt-4" onClick={() => socket.resetGame()}>
                Jugar de nuevo
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}