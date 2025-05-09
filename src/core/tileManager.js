
export class TileManager {
    constructor() {
        this.tileImages = {
            grassFlower1: this.loadImage('/src/assets/images/tiles/grass_flower1.png'),
            grassFlower2: this.loadImage('/src/assets/images/tiles/grass_flower2.png'),
            grass1: this.loadImage('/src/assets/images/tiles/grass1.png'),
            grass2: this.loadImage('/src/assets/images/tiles/grass2.png')
        };
    }

    loadImage(src) {
        const img = new Image();
        img.src = src;
        return img;
    }
}
