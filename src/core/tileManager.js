
export class TileManager {
    constructor() {
        this.tileImages = {
            tile1: this.loadImage('/src/assets/images/tiles/WhatsApp Image 2025-05-05 at 01.02.24_651eca85.jpg'),
            tile2: this.loadImage('/src/assets/images/tiles/WhatsApp Image 2025-05-05 at 01.02.24_aa0c7511.jpg'),
            tile3: this.loadImage('/src/assets/images/tiles/WhatsApp Image 2025-05-05 at 01.02.24_eb54dcd7.jpg'),
            tile4: this.loadImage('/src/assets/images/tiles/WhatsApp Image 2025-05-05 at 01.02.24_fef9b075.jpg')
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
        const tileTypes = Object.keys(this.tileImages);
        for (let y = 0; y < 50; y++) {
            this.tileGrid[y] = [];
            for (let x = 0; x < 50; x++) {
                const randomTile = tileTypes[Math.floor(Math.random() * tileTypes.length)];
                this.tileGrid[y][x] = randomTile;
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
