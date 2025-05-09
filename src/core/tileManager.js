
export class TileManager {
    constructor() {
        this.tileImages = {
            grass: this.loadImage('/src/assets/images/tiles/Tile_Grass.png'),
            grassFlower1: this.loadImage('/src/assets/images/tiles/Tile_Grass_1.png'),
            grassFlower2: this.loadImage('/src/assets/images/tiles/Tile_Grass_2_Flowers.png'),
            grassFlower3: this.loadImage('/src/assets/images/tiles/Tile_Grass_3_Flowers.png')
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
        const tileSize = 50 * scale; // Tamanho do tile

        for (let y = 0; y < this.tileGrid.length; y++) {
            for (let x = 0; x < this.tileGrid[y].length; x++) {
                const isoX = (x - y) * tileSize / 2;
                const isoY = (x + y) * tileSize / 4;
                
                const tileType = this.tileGrid[y][x];
                const img = this.tileImages[tileType];

                if (img.complete) {
                    // Desenhar o tile isométrico
                    ctx.save();
                    ctx.translate(centerX + isoX, centerY + isoY);
                    
                    // Criar o caminho do diamante isométrico
                    ctx.beginPath();
                    ctx.moveTo(0, -tileSize/4);
                    ctx.lineTo(tileSize/2, 0);
                    ctx.lineTo(0, tileSize/4);
                    ctx.lineTo(-tileSize/2, 0);
                    ctx.closePath();
                    
                    // Recortar a imagem no formato do diamante
                    ctx.clip();
                    
                    // Desenhar a imagem ajustada ao tamanho do tile
                    ctx.drawImage(
                        img,
                        -tileSize/2,
                        -tileSize/4,
                        tileSize,
                        tileSize/2
                    );
                    
                    ctx.restore();
                }
            }
        }
    }
}
