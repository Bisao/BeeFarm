
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
        const tileSize = 50 * scale;
        const screenWidth = ctx.canvas.width;
        const screenHeight = ctx.canvas.height;
        
        // Calcular área visível
        const visibleTilesX = Math.ceil(screenWidth / (tileSize / 2)) + 2;
        const visibleTilesY = Math.ceil(screenHeight / (tileSize / 4)) + 2;
        
        // Calcular limites de renderização
        const centerTileX = Math.floor(centerX / (tileSize / 2));
        const centerTileY = Math.floor(centerY / (tileSize / 4));
        
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
