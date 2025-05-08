
import { ObjectPool } from './objectPool.js';

export class TilePool {
    constructor() {
        this.pool = new ObjectPool(() => ({
            x: 0,
            y: 0,
            type: 'grass',
            isVisible: false
        }));
    }

    getTile(x, y, type) {
        const tile = this.pool.get();
        tile.x = x;
        tile.y = y;
        tile.type = type;
        tile.isVisible = true;
        return tile;
    }

    releaseTile(tile) {
        tile.isVisible = false;
        this.pool.release(tile);
    }
}
