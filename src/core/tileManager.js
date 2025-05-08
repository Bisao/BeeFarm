
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
        
        // Add error handlers for images
        Object.values(this.tileImages).forEach(img => {
            img.onerror = () => {
                console.error(`Failed to load image: ${img.src}`);
            };
        });
    }

    drawTile(ctx, type, x, y, scale = 1) {
        const image = this.tileImages[type];
        if (image && image.complete && image.naturalHeight !== 0) {
            ctx.drawImage(image, x - this.tileSize/2, y - this.tileSize/4, this.tileSize, this.tileSize/2);
        } else {
            // Fallback: Draw a colored rectangle if image fails to load
            ctx.fillStyle = type === 'dirt' ? '#8B4513' : type === 'grass' ? '#228B22' : '#32CD32';
            ctx.fillRect(x - this.tileSize/2, y - this.tileSize/4, this.tileSize, this.tileSize/2);
        }
    }
}
