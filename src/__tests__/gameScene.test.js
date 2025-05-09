
import { GameScene } from '../scenes/gameScene';

describe('GameScene', () => {
  let gameScene;

  beforeEach(() => {
    gameScene = new GameScene();
  });

  test('deve inicializar com valores padrão', () => {
    expect(gameScene.gridSize).toBe(50);
    expect(gameScene.gridWidth).toBe(50);
    expect(gameScene.gridHeight).toBe(50);
  });

  test('deve converter coordenadas da tela para grade', () => {
    gameScene.canvas = {
      width: 800,
      height: 600
    };
    gameScene.camera = {
      offset: { x: 0, y: 0 },
      scale: 1
    };
    
    const gridPos = gameScene.screenToGrid(400, 300);
    expect(gridPos).toBeDefined();
  });
});
