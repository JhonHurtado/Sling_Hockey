import { GameState, GameStatus, Team, Puck, CONSTANTS } from '@sling-hockey/types';
import { nanoid } from 'nanoid';

export class GameStateManager {
  private state: GameState;

  constructor(config: { pucksPerTeam: number; roundDuration: number }) {
    this.state = {
      status: GameStatus.WAITING,
      pucks: [],
      score: { red: 0, blue: 0 },
      timeRemaining: config.roundDuration,
      currentRound: 0
    };
    
    this.initializePucks(config.pucksPerTeam);
  }

  private initializePucks(pucksPerTeam: number): void {
    const pucks: Puck[] = [];
    const spacing = 60;
    const startY = 300;

    // Pucks del equipo rojo (izquierda)
    for (let i = 0; i < pucksPerTeam; i++) {
      pucks.push({
        id: nanoid(8),
        position: { x: 150, y: startY - (pucksPerTeam / 2) * spacing + i * spacing },
        velocity: { x: 0, y: 0 },
        radius: CONSTANTS.PHYSICS.PUCK_RADIUS,
        team: Team.RED
      });
    }

    // Pucks del equipo azul (derecha)
    for (let i = 0; i < pucksPerTeam; i++) {
      pucks.push({
        id: nanoid(8),
        position: { x: 650, y: startY - (pucksPerTeam / 2) * spacing + i * spacing },
        velocity: { x: 0, y: 0 },
        radius: CONSTANTS.PHYSICS.PUCK_RADIUS,
        team: Team.BLUE
      });
    }

    this.state.pucks = pucks;
  }

  public getState(): GameState {
    return JSON.parse(JSON.stringify(this.state));
  }

  public start(): void {
    this.state.status = GameStatus.PLAYING;
    this.state.currentRound++;
  }

  public pause(): void {
    if (this.state.status === GameStatus.PLAYING) {
      this.state.status = GameStatus.PAUSED;
    }
  }

  public resume(): void {
    if (this.state.status === GameStatus.PAUSED) {
      this.state.status = GameStatus.PLAYING;
    }
  }

  public reset(pucksPerTeam: number, roundDuration: number): void {
    this.state.status = GameStatus.WAITING;
    this.state.score = { red: 0, blue: 0 };
    this.state.timeRemaining = roundDuration;
    this.state.currentRound = 0;
    this.initializePucks(pucksPerTeam);
  }

  public updatePuck(puckId: string, position: { x: number; y: number }, velocity: { x: number; y: number }): void {
    const puck = this.state.pucks.find(p => p.id === puckId);
    if (puck) {
      puck.position = position;
      puck.velocity = velocity;
    }
  }

  public updateTime(delta: number): void {
    if (this.state.status === GameStatus.PLAYING && this.state.timeRemaining > 0) {
      this.state.timeRemaining = Math.max(0, this.state.timeRemaining - delta);
      
      if (this.state.timeRemaining === 0) {
        this.endRound();
      }
    }
  }

  public checkScoring(boardWidth: number): { scored: boolean; team?: Team } {
    let redPucksLeft = 0;
    let bluePucksLeft = 0;

    for (const puck of this.state.pucks) {
      // Lado izquierdo (rojo)
      if (puck.position.x < boardWidth / 2) {
        if (puck.team === Team.RED) redPucksLeft++;
      } 
      // Lado derecho (azul)
      else {
        if (puck.team === Team.BLUE) bluePucksLeft++;
      }
    }

    // Equipo azul gana si no quedan pucks rojos en el lado izquierdo
    if (redPucksLeft === 0 && this.state.pucks.some(p => p.team === Team.RED)) {
      this.state.score.blue++;
      return { scored: true, team: Team.BLUE };
    }

    // Equipo rojo gana si no quedan pucks azules en el lado derecho
    if (bluePucksLeft === 0 && this.state.pucks.some(p => p.team === Team.BLUE)) {
      this.state.score.red++;
      return { scored: true, team: Team.RED };
    }

    return { scored: false };
  }

  private endRound(): void {
    this.state.status = GameStatus.FINISHED;
  }

  public isFinished(): boolean {
    return this.state.status === GameStatus.FINISHED;
  }
}