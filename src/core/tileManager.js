
export class TileManager {
    constructor() {
        this.tileImages = {
            grass: this.loadImage('src/assets/images/tiles/Tile_Grass.png'),
            grassFlower1: this.loadImage('src/assets/images/tiles/Tile_Grass_1.png'),
            grassFlower2: this.loadImage('src/assets/images/tiles/Tile_Grass_2_Flowers.png'),
            grassFlower3: this.loadImage('src/assets/images/tiles/Tile_Grass_3_Flowers.png')
        };
        this.tileGrid = [];
        this.initializeGrid();
    }

    loadImage(src) {
        const img = new Image();
        img.src = src;
        return img;
    }

    initializeGrid() {
        for (let y = 0; y < 50; y++) {
            this.tileGrid[y] = [];
            for (let x = 0; x < 50; x++) {
                const random = Math.random();
                let selectedTile;
                
                if (random < 0.7) {
                    selectedTile = 'grass';
                } else if (random < 0.8) {
                    selectedTile = 'grassFlower1';
                } else if (random < 0.9) {
                    selectedTile = 'grassFlower2';
                } else {
                    selectedTile = 'grassFlower3';
                }
                
                this.tileGrid[y][x] = selectedTile;
            }
        }
    }

    draw(ctx, centerX, centerY, scale) {
        if (!this.tileSize || this.tileSize !== 50 * scale) {
            this.tileSize = 50 * scale;
            this.tileHalfWidth = this.tileSize / 2;
            this.tileQuarterHeight = this.tileSize / 4;
        }
        
        const screenWidth = ctx.canvas.width;
        const screenHeight = ctx.canvas.height;
        
        // Usar um buffer offscreen para renderização
        if (!this.offscreenCanvas) {
            this.offscreenCanvas = new OffscreenCanvas(screenWidth, screenHeight);
            this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        }
        
        // Cache de cálculos frequentes
        const tileHalfWidth = tileSize / 2;
        const tileQuarterHeight = tileSize / 4;
        
        // Calcular área visível com buffer reduzido
        const visibleTilesX = Math.ceil(screenWidth / tileHalfWidth) + 1;
        const visibleTilesY = Math.ceil(screenHeight / tileQuarterHeight) + 1;
        
        // Otimizar cálculos de posição central
        const centerTileX = Math.floor(centerX / tileHalfWidth);
        const centerTileY = Math.floor(centerY / tileQuarterHeight);
        
        // Pré-calcular limites
        const startX = Math.max(0, centerTileX - Math.floor(visibleTilesX / 2));
        const startY = Math.max(0, centerTileY - Math.floor(visibleTilesY / 2));
        const endX = Math.min(this.tileGrid[0].length, startX + visibleTilesX);
        const endY = Math.min(this.tileGrid.length, startY + visibleTilesY);
        
        const startX = Math.max(0, centerTileX - visibleTilesX);
        const startY = Math.max(0, centerTileY - visibleTilesY);
        const endX = Math.min(this.tileGrid[0].length, centerTileX + visibleTilesX);
        const endY = Math.min(this.tileGrid.length, centerTileY + visibleTilesY);

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const isoX = (x - y) * tileSize / 2;
                const isoY = (x + y) * tileSize / 4;
                
                const tileType = this.tileGrid[y][x];
                const img = this.tileImages[tileType];

                if (img.complete) {
                    const tileWidth = tileSize;
                    const tileHeight = tileSize / 2;
                    
                    ctx.drawImage(
                        img,
                        centerX + isoX - tileWidth/2,
                        centerY + isoY - tileHeight/2,
                        tileWidth,
                        tileHeight
                    );
                }
            }
        }
    }
}
