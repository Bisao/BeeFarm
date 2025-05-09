
import { TileManager } from '../core/tileManager';

describe('TileManager', () => {
  let tileManager;

  beforeEach(() => {
    tileManager = new TileManager();
  });

  test('deve carregar imagens corretamente', () => {
    expect(tileManager.tileImages).toBeDefined();
    expect(tileManager.tileImages.dirt).toBeDefined();
    expect(tileManager.tileImages.grass).toBeDefined();
  });
});
