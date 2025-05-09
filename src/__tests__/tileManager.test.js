
import { TreeManager } from '../core/treeManager';

describe('TreeManager', () => {
  let treeManager;

  beforeEach(() => {
    treeManager = new TreeManager();
  });

  test('deve verificar posição ocupada corretamente', () => {
    treeManager.occupyPosition(1, 1);
    expect(treeManager.isPositionOccupied(1, 1)).toBe(true);
    expect(treeManager.isPositionOccupied(2, 2)).toBe(false);
  });

  test('deve gerar árvores aleatórias dentro dos limites', () => {
    const gridWidth = 10;
    const gridHeight = 10;
    const count = 5;

    treeManager.generateRandomTrees(gridWidth, gridHeight, count);
    
    expect(treeManager.trees.length).toBe(count);
    treeManager.trees.forEach(tree => {
      expect(tree.x).toBeLessThan(gridWidth);
      expect(tree.y).toBeLessThan(gridHeight);
      expect(tree.type).toMatch(/^(pine|simple)$/);
    });
  });
});
