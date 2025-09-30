import Matter from 'matter-js';
import { GameStateManager } from './GameState';
import { InputSlingData, CONSTANTS, GameConfig } from '@sling-hockey/types';

export class GameEngine {
  private engine: Matter.Engine;
  private world: Matter.World;
  private gameState: GameStateManager;
  private config: GameConfig;
  private puckBodies: Map<string, Matter.Body>;
  private running: boolean = false;
  private lastUpdate: number = Date.now();

  constructor(config: GameConfig) {
    this.config = config;
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 0, scale: 0 } // Sin gravedad para hockey de mesa
    });
    this.world = this.engine.world;
    this.gameState = new GameStateManager({
      pucksPerTeam: config.pucksPerTeam,
      roundDuration: config.roundDuration
    });
    this.puckBodies = new Map();
    
    this.setupWorld();
  }

  private setupWorld(): void {
    const { boardWidth, boardHeight } = this.config;
    const wallThickness = 20;

    // Crear paredes
    const walls = [
      // Pared superior
      Matter.Bodies.rectangle(boardWidth / 2, -wallThickness / 2, boardWidth, wallThickness, { isStatic: true }),
      // Pared inferior
      Matter.Bodies.rectangle(boardWidth / 2, boardHeight + wallThickness / 2, boardWidth, wallThickness, { isStatic: true }),
      // Pared izquierda
      Matter.Bodies.rectangle(-wallThickness / 2, boardHeight / 2, wallThickness, boardHeight, { isStatic: true }),
      // Pared derecha
      Matter.Bodies.rectangle(boardWidth + wallThickness / 2, boardHeight / 2, wallThickness, boardHeight, { isStatic: true })
    ];

    Matter.World.add(this.world, walls);

    // Crear pucks físicos
    const pucks = this.gameState.getState().pucks;
    for (const puck of pucks) {
      const body = Matter.Bodies.circle(puck.position.x, puck.position.y, puck.radius, {
        restitution: CONSTANTS.PHYSICS.RESTITUTION,
        friction: 0.01,
        frictionAir: 0.02,
        density: 0.001
      });
      
      Matter.World.add(this.world, body);
      this.puckBodies.set(puck.id, body);
    }
  }

  public start(): void {
    this.gameState.start();
    this.running = true;
    this.lastUpdate = Date.now();
  }

  public pause(): void {
    this.gameState.pause();
    this.running = false;
  }

  public resume(): void {
    this.gameState.resume();
    this.running = true;
    this.lastUpdate = Date.now();
  }

  public reset(): void {
    // Limpiar mundo físico
    Matter.World.clear(this.world, false);
    this.puckBodies.clear();
    
    // Resetear estado
    this.gameState.reset(this.config.pucksPerTeam, this.config.roundDuration);
    
    // Recrear mundo
    this.setupWorld();
    this.running = false;
  }

  public update(): void {
    if (!this.running) return;

    const now = Date.now();
    const delta = (now - this.lastUpdate) / 1000; // Convertir a segundos
    this.lastUpdate = now;

    // Actualizar física
    Matter.Engine.update(this.engine, 1000 / 60); // 60 FPS para física

    // Sincronizar estado del juego con física
    for (const [puckId, body] of this.puckBodies.entries()) {
      // Aplicar fricción personalizada
      body.velocity.x *= CONSTANTS.PHYSICS.FRICTION;
      body.velocity.y *= CONSTANTS.PHYSICS.FRICTION;

      // Limitar velocidad máxima
      const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
      if (speed > CONSTANTS.PHYSICS.MAX_VELOCITY) {
        const scale = CONSTANTS.PHYSICS.MAX_VELOCITY / speed;
        Matter.Body.setVelocity(body, {
          x: body.velocity.x * scale,
          y: body.velocity.y * scale
        });
      }

      this.gameState.updatePuck(
        puckId,
        { x: body.position.x, y: body.position.y },
        { x: body.velocity.x, y: body.velocity.y }
      );
    }

    // Actualizar tiempo
    this.gameState.updateTime(delta);

    // Verificar condiciones de victoria
    const result = this.gameState.checkScoring(this.config.boardWidth);
    if (result.scored) {
      this.pause();
    }
  }

  public handleInput(input: InputSlingData): void {
    const body = this.puckBodies.get(input.puckId);
    if (!body) return;

    // Aplicar fuerza basada en el vector de jalón
    const force = {
      x: -input.pullVector.x * 0.001,
      y: -input.pullVector.y * 0.001
    };

    Matter.Body.applyForce(body, body.position, force);
  }

  public getGameState() {
    return this.gameState.getState();
  }

  public isFinished(): boolean {
    return this.gameState.isFinished();
  }
}