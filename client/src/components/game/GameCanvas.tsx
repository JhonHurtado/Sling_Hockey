import { useRef, useEffect, useState } from 'react';
import { GameState, GameConfig, Team } from '@sling-hockey/types';

interface GameCanvasProps {
  gameState: GameState;
  config: GameConfig;
  onSling: (puckId: string, origin: { x: number; y: number }, pullVector: { x: number; y: number }) => void;
}

export default function GameCanvas({ gameState, config, onSling }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragPuckId, setDragPuckId] = useState<string | null>(null);

  // Renderizar el juego
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar fondo
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar línea central
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dibujar zonas de equipo
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)'; // Rojo
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height);
    
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'; // Azul
    ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);

    // Dibujar pucks
    for (const puck of gameState.pucks) {
      ctx.beginPath();
      ctx.arc(puck.position.x, puck.position.y, puck.radius, 0, Math.PI * 2);
      
      // Color según equipo
      if (puck.team === Team.RED) {
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#dc2626';
      } else {
        ctx.fillStyle = '#3b82f6';
        ctx.strokeStyle = '#2563eb';
      }
      
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.stroke();

      // Agregar brillo
      const gradient = ctx.createRadialGradient(
        puck.position.x - puck.radius / 3,
        puck.position.y - puck.radius / 3,
        0,
        puck.position.x,
        puck.position.y,
        puck.radius
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Dibujar línea de arrastre
    if (isDragging && dragStart && dragPuckId) {
      const puck = gameState.pucks.find(p => p.id === dragPuckId);
      if (puck) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(puck.position.x, puck.position.y);
        ctx.lineTo(dragStart.x, dragStart.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Dibujar punto de inicio del arrastre
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(dragStart.x, dragStart.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [gameState, isDragging, dragStart, dragPuckId]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getPuckAtPosition = (x: number, y: number) => {
    return gameState.pucks.find(puck => {
      const dx = puck.position.x - x;
      const dy = puck.position.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= puck.radius;
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState.status !== 'playing') return;

    const pos = getMousePos(e);
    const puck = getPuckAtPosition(pos.x, pos.y);

    if (puck) {
      setIsDragging(true);
      setDragStart(pos);
      setDragPuckId(puck.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setDragStart(getMousePos(e));
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragStart || !dragPuckId) return;

    const puck = gameState.pucks.find(p => p.id === dragPuckId);
    if (puck) {
      const pullVector = {
        x: dragStart.x - puck.position.x,
        y: dragStart.y - puck.position.y,
      };

      onSling(dragPuckId, { x: puck.position.x, y: puck.position.y }, pullVector);
    }

    setIsDragging(false);
    setDragStart(null);
    setDragPuckId(null);
  };

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={config.boardWidth}
        height={config.boardHeight}
        className="border border-gray-300 rounded-lg shadow-lg cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDragging) {
            setIsDragging(false);
            setDragStart(null);
            setDragPuckId(null);
          }
        }}
      />
    </div>
  );
}