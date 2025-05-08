
export class TileManager {
    constructor() {
        this.tileImages = {
            dirt: this.loadImage('/src/assets/images/tiles/WhatsApp Image 2025-05-05 at 01.02.24_fef9b075.jpg'),
            grass: this.loadImage('/src/assets/images/tiles/WhatsApp Image 2025-05-05 at 01.02.24_651eca85.jpg'),
            flowerGrass: this.loadImage('/src/assets/images/tiles/WhatsApp Image 2025-05-05 at 01.02.24_aa0c7511.jpg'),
            water: this.loadImage('/src/assets/images/tiles/WhatsApp Image 2025-05-05 at 01.02.24_eb54dcd7.jpg')
        };
    }

    loadImage(src) {
        const img = new Image();
        img.src = src;
        return img;
    }
}
