
export class TileManager {
    constructor() {
        this.tileCache = new Map();
        this.tileGrid = [];
        this.offscreenCanvas = new OffscreenCanvas(800, 600);
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        this.lastViewport = null;
        this.initializeGrid();
    }

    async loadImage(src) {
        if (this.tileCache.has(src)) {
            return this.tileCache.get(src);
        }

        const img = new Image();
        img.src = src;
        await new Promise(resolve => img.onload = resolve);
        this.tileCache.set(src, img);
        return img;
    }

    initializeGrid() {
        const tiles = ['grass', 'grassFlower1', 'grassFlower2', 'grassFlower3'];
        const weights = [0.7, 0.1, 0.1, 0.1];
        
        for (let y = 0; y < 50; y++) {
            this.tileGrid[y] = [];
            for (let x = 0; x < 50; x++) {
                const random = Math.random();
                let acc = 0;
                let selectedTile = tiles[0];
                
                for (let i = 0; i < weights.length; i++) {
                    acc += weights[i];
                    if (random < acc) {
                        selectedTile = tiles[i];
                        break;
                    }
                }
                
                this.tileGrid[y][x] = selectedTile;
            }
        }
    }

    draw(ctx, centerX, centerY, scale) {
        const tileSize = 50 * scale;
        const screenWidth = ctx.canvas.width;
        const screenHeight = ctx.canvas.height;
        
        const visibleTilesX = Math.ceil(screenWidth / (tileSize / 2)) + 2;
        const visibleTilesY = Math.ceil(screenHeight / (tileSize / 4)) + 2;
        
        const centerTileX = Math.floor(centerX / (tileSize / 2));
        const centerTileY = Math.floor(centerY / (tileSize / 4));
        
        const viewportKey = `${centerTileX},${centerTileY},${scale}`;
        
        if (this.lastViewport !== viewportKey) {
            this.updateOffscreenCanvas(centerTileX, centerTileY, scale, visibleTilesX, visibleTilesY);
            this.lastViewport = viewportKey;
        }
        
        ctx.drawImage(this.offscreenCanvas, 0, 0);
    }

    updateOffscreenCanvas(centerTileX, centerTileY, scale, visibleTilesX, visibleTilesY) {
        const tileSize = 50 * scale;
        const startX = Math.max(0, centerTileX - Math.floor(visibleTilesX / 2));
        const startY = Math.max(0, centerTileY - Math.floor(visibleTilesY / 2));
        const endX = Math.min(this.tileGrid[0].length, startX + visibleTilesX);
        const endY = Math.min(this.tileGrid.length, startY + visibleTilesY);

        this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const isoX = (x - y) * tileSize / 2;
                const isoY = (x + y) * tileSize / 4;
                
                const tileType = this.tileGrid[y][x];
                const img = this.tileCache.get(tileType);

                if (img?.complete) {
                    this.offscreenCtx.drawImage(
                        img,
                        isoX - tileSize/2,
                        isoY - tileSize/2,
                        tileSize,
                        tileSize/2
                    );
                }
            }
        }
    }
}
