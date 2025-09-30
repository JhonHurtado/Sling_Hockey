import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';
import { Team, PlayerRole } from '@sling-hockey/types';
import { Play, Pause, RotateCcw, Copy, QrCode, Users, Crown } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface LobbyProps {
  socket: ReturnType<typeof import('@/hooks/useSocket').useSocket>;
}

export default function Lobby({ socket }: LobbyProps) {
  const { roomCode, players, config, gameState, playerId, hostId } = useGameStore();
  const [showQR, setShowQR] = useState(false);
  const isHost = playerId === hostId;

  const copyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      // Podrías agregar un toast aquí
    }
  };

  const getRoomURL = () => {
    return `${window.location.origin}?room=${roomCode}`;
  };

  const getTeamPlayers = (team: Team) => {
    return players.filter(p => p.team === team && p.role === PlayerRole.PLAYER);
  };

  const redTeam = getTeamPlayers(Team.RED);
  const blueTeam = getTeamPlayers(Team.BLUE);
  const spectators = players.filter(p => p.role === PlayerRole.SPECTATOR);
  const unassigned = players.filter(p => p.team === Team.NONE && p.role === PlayerRole.PLAYER);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">🏒 Sala de Juego</CardTitle>
              <CardDescription>Código de sala: <span className="font-mono font-bold text-lg">{roomCode}</span></CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={copyRoomCode}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setShowQR(!showQR)}>
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        {showQR && (
          <CardContent className="flex justify-center">
            <QRCodeSVG value={getRoomURL()} size={200} />
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipos */}
        <div className="lg:col-span-2 space-y-4">
          {/* Equipo Rojo */}
          <Card className="border-red-200 bg-red-50 dark:bg-red-950">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">
                🔴 Equipo Rojo ({redTeam.length}/{config ? Math.floor(config.maxPlayers / 2) : 2})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {redTeam.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin jugadores</p>
              ) : (
                <div className="space-y-2">
                  {redTeam.map(player => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                      <div className="flex items-center gap-2">
                        {player.id === hostId && <Crown className="h-4 w-4 text-yellow-500" />}
                        <span>{player.name}</span>
                      </div>
                      {isHost && player.id !== hostId && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => socket.kickPlayer({ playerId: player.id })}
                        >
                          Expulsar
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Equipo Azul */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">
                🔵 Equipo Azul ({blueTeam.length}/{config ? Math.floor(config.maxPlayers / 2) : 2})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {blueTeam.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin jugadores</p>
              ) : (
                <div className="space-y-2">
                  {blueTeam.map(player => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                      <div className="flex items-center gap-2">
                        {player.id === hostId && <Crown className="h-4 w-4 text-yellow-500" />}
                        <span>{player.name}</span>
                      </div>
                      {isHost && player.id !== hostId && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => socket.kickPlayer({ playerId: player.id })}
                        >
                          Expulsar
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sin asignar */}
          {unassigned.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sin equipo asignado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {unassigned.map(player => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                      <span>{player.name}</span>
                      {isHost && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => socket.assignTeam({ playerId: player.id, team: Team.RED })}
                          >
                            🔴 Rojo
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => socket.assignTeam({ playerId: player.id, team: Team.BLUE })}
                          >
                            🔵 Azul
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel de control */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jugadores:</span>
                <span className="font-medium">{players.length}/{config?.maxPlayers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duración:</span>
                <span className="font-medium">{config?.roundDuration}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fichas:</span>
                <span className="font-medium">{config?.pucksPerTeam} por equipo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado:</span>
                <span className="font-medium capitalize">{gameState?.status}</span>
              </div>
            </CardContent>
          </Card>

          {spectators.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Espectadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {spectators.map(player => (
                    <div key={player.id} className="text-sm">{player.name}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {isHost && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Controles de Admin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {gameState?.status === 'waiting' && (
                  <Button 
                    className="w-full" 
                    onClick={() => socket.startGame()}
                    disabled={redTeam.length === 0 || blueTeam.length === 0}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar Juego
                  </Button>
                )}
                {gameState?.status === 'playing' && (
                  <Button 
                    className="w-full" 
                    variant="secondary"
                    onClick={() => socket.pauseGame()}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
                  </Button>
                )}
                {gameState?.status === 'paused' && (
                  <Button 
                    className="w-full" 
                    onClick={() => socket.startGame()}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Reanudar
                  </Button>
                )}
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => socket.resetGame()}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reiniciar
                </Button>
                <Button 
                  className="w-full" 
                  variant="destructive"
                  onClick={() => socket.leaveRoom()}
                >
                  Cerrar Sala
                </Button>
              </CardContent>
            </Card>
          )}

          {!isHost && (
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => socket.leaveRoom()}
            >
              Salir de la Sala
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}