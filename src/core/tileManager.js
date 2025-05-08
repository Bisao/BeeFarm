
export class TileManager {
    constructor() {
        this.tileImages = {
            dirt: new Image(),
            grass: new Image(),
            flowerGrass: new Image()
        };
        
        this.tileImages.dirt.src = '/src/assets/tiles/dirt.png';
        this.tileImages.grass.src = '/src/assets/tiles/grass.png';
        this.tileImages.flowerGrass.src = '/src/assets/tiles/flower_grass.png';
        
        this.tileSize = 50;
    }

    drawTile(ctx, type, x, y, scale = 1) {
        const image = this.tileImages[type];
        ctx.drawImage(image, x - this.tileSize/2, y - this.tileSize/4, this.tileSize, this.tileSize/2);
    }
}
