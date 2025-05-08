
import { Structure } from './baseStructure.js';

export class House extends Structure {
    constructor(x, y) {
        super(x, y);
        this.type = 'house';
        this.size = 45;
    }

    constructor(x, y) {
        super(x, y);
        this.type = 'house';
        this.size = 80;
        this.image = new Image();
        this.image.src = '/src/assets/images/structures/house.png';
    }

    draw(ctx, centerX, centerY, scale) {
        const isoX = (this.x - this.y) * 50 / 2;
        const isoY = (this.x + this.y) * 50 / 4;
        
        if (this.image.complete) {
            ctx.drawImage(
                this.image,
                centerX/scale + isoX - this.size/2,
                centerY/scale + isoY - this.size/2,
                this.size,
                this.size
            );
        }
    }
}
