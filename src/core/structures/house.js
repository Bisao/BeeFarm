
import { Structure } from './baseStructure.js';

export class House extends Structure {
    constructor(x, y, type = 'lumberjack') {
        super(x, y);
        this.type = type;
        this.size = 80;
        this.image = new Image();
        this.direction = 'left';
        this.updateImage();
    }

    updateImage() {
        const imagePath = {
            'miner': `src/assets/images/structures/⛏️ MinerHouse${this.direction === 'left' ? 'Left' : 'Right'}.PNG`,
            'farmer': `src/assets/images/structures/🌱 FarmerHouse${this.direction === 'left' ? 'Left' : 'Right'}.PNG`,
            'fisherman': `src/assets/images/structures/🎣 FisherManHouse${this.direction === 'left' ? 'Left' : 'Right'}.PNG`,
            'lumberjack': `src/assets/images/structures/🪓 LumberJackHouse${this.direction === 'left' ? 'Left' : 'Right'}.PNG`
        };
        this.image.src = imagePath[this.type] || imagePath['lumberjack'];
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
