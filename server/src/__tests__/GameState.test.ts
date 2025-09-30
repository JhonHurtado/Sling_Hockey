import { GameStateManager } from '../game/GameState';
import { GameStatus, Team } from '@sling-hockey/types';

describe('GameStateManager', () => {
  let gameState: GameStateManager;

  beforeEach(() => {
    gameState = new GameStateManager({
      pucksPerTeam: 5,
      roundDuration: 180
    });
  });

  describe('initialization', () => {
    it('should initialize with waiting status', () => {
      const state = gameState.getState();
      
      expect(state.status).toBe(GameStatus.WAITING);
      expect(state.currentRound).toBe(0);
      expect(state.timeRemaining).toBe(180);
    });

    it('should create pucks for both teams', () => {
      const state = gameState.getState();
      
      expect(state.pucks).toHaveLength(10); // 5 per team
      
      const redPucks = state.pucks.filter(p => p.team === Team.RED);
      const bluePucks = state.pucks.filter(p => p.team === Team.BLUE);
      
      expect(redPucks).toHaveLength(5);
      expect(bluePucks).toHaveLength(5);
    });
  });

  describe('start', () => {
    it('should change status to playing', () => {
      gameState.start();
      const state = gameState.getState();
      
      expect(state.status).toBe(GameStatus.PLAYING);
      expect(state.currentRound).toBe(1);
    });
  });

  describe('pause and resume', () => {
    it('should pause when playing', () => {
      gameState.start();
      gameState.pause();
      const state = gameState.getState();
      
      expect(state.status).toBe(GameStatus.PAUSED);
    });

    it('should resume when paused', () => {
      gameState.start();
      gameState.pause();
      gameState.resume();
      const state = gameState.getState();
      
      expect(state.status).toBe(GameStatus.PLAYING);
    });
  });

  describe('updateTime', () => {
    it('should decrease time remaining', () => {
      gameState.start();
      gameState.updateTime(10);
      const state = gameState.getState();
      
      expect(state.timeRemaining).toBe(170);
    });

    it('should not go below zero', () => {
      gameState.start();
      gameState.updateTime(200);
      const state = gameState.getState();
      
      expect(state.timeRemaining).toBe(0);
    });

    it('should finish game when time reaches zero', () => {
      gameState.start();
      gameState.updateTime(180);
      const state = gameState.getState();
      
      expect(state.status).toBe(GameStatus.FINISHED);
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      gameState.start();
      gameState.updateTime(50);
      gameState.reset(5, 180);
      
      const state = gameState.getState();
      
      expect(state.status).toBe(GameStatus.WAITING);
      expect(state.currentRound).toBe(0);
      expect(state.timeRemaining).toBe(180);
      expect(state.score).toEqual({ red: 0, blue: 0 });
    });
  });
});