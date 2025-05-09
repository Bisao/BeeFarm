
import { WoodcuttingSystem } from '../core/woodcutting';

describe('WoodcuttingSystem', () => {
  let woodcuttingSystem;
  let mockTreeManager;
  let mockNPC;
  let mockTree;

  beforeEach(() => {
    mockTreeManager = {
      trees: [],
      occupiedPositions: new Set()
    };
    
    mockNPC = {
      addWoodToInventory: jest.fn(),
      stopWoodcutting: jest.fn(),
      moveToHouse: jest.fn(),
      startWoodcutting: jest.fn()
    };
    
    mockTree = { x: 0, y: 0 };
    woodcuttingSystem = new WoodcuttingSystem(mockTreeManager);
  });

  test('deve iniciar corte de árvore corretamente', () => {
    const result = woodcuttingSystem.startCuttingTree(mockNPC, mockTree);
    expect(result).toBe(true);
    expect(woodcuttingSystem.treesBeingCut.get(mockTree)).toBe(mockNPC);
    expect(woodcuttingSystem.getTreeProgress(mockTree)).toBe(0);
  });

  test('não deve permitir cortar árvore já sendo cortada', () => {
    woodcuttingSystem.startCuttingTree(mockNPC, mockTree);
    const result = woodcuttingSystem.startCuttingTree(mockNPC, mockTree);
    expect(result).toBe(false);
  });
});
