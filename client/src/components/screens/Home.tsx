import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGameStore } from '@/store/gameStore';
import { Play, Users } from 'lucide-react';

interface HomeProps {
  socket: ReturnType<typeof import('@/hooks/useSocket').useSocket>;
}

export default function Home({ socket }: HomeProps) {
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [hostPlays, setHostPlays] = useState(true);
  const { setPlayerName, isConnected } = useGameStore();

  const handleCreateRoom = () => {
    if (!name.trim()) return;
    
    setPlayerName(name);
    socket.createRoom({
      hostName: name,
      hostPlays,
    });
  };

  const handleJoinRoom = () => {
    if (!name.trim() || !roomCode.trim()) return;
    
    setPlayerName(name);
    socket.joinRoom({
      code: roomCode.toUpperCase(),
      name,
    });
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Conectando...</CardTitle>
            <CardDescription>Estableciendo conexión con el servidor</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!mode) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
              🏒 Sling Hockey
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Juego multijugador para red local
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setMode('create')}
            >
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <Play className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-center">Crear Sala</CardTitle>
                <CardDescription className="text-center">
                  Inicia una nueva partida y comparte el código
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setMode('join')}
            >
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-center">Unirse a Sala</CardTitle>
                <CardDescription className="text-center">
                  Ingresa un código para unirte a una partida
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {mode === 'create' ? 'Crear Sala' : 'Unirse a Sala'}
          </CardTitle>
          <CardDescription>
            {mode === 'create' 
              ? 'Configura tu nombre y crea una nueva sala'
              : 'Ingresa el código de sala y tu nombre'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tu nombre</Label>
            <Input
              id="name"
              placeholder="Ingresa tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
          </div>

          {mode === 'join' && (
            <div className="space-y-2">
              <Label htmlFor="code">Código de sala</Label>
              <Input
                id="code"
                placeholder="ABC123"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
            </div>
          )}

          {mode === 'create' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hostPlays"
                checked={hostPlays}
                onChange={(e) => setHostPlays(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="hostPlays">Jugar como administrador</Label>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setMode(null)}
              className="flex-1"
            >
              Atrás
            </Button>
            <Button
              onClick={mode === 'create' ? handleCreateRoom : handleJoinRoom}
              disabled={!name.trim() || (mode === 'join' && !roomCode.trim())}
              className="flex-1"
            >
              {mode === 'create' ? 'Crear' : 'Unirse'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}