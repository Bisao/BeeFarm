
import { Structure } from './baseStructure.js';

export class House extends Structure {
    constructor(x, y) {
        super(x, y);
        this.type = 'house';
        this.size = 45;
    }

    draw(ctx, centerX, centerY, scale) {
        const isoX = (this.x - this.y) * 50 / 2;
        const isoY = (this.x + this.y) * 50 / 4;
        
        // Base da casa
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(
            centerX/scale + isoX - this.size/2,
            centerY/scale + isoY - this.size/2,
            this.size,
            this.size
        );
        
        // Telhado
        ctx.fillStyle = '#A52A2A';
        ctx.beginPath();
        ctx.moveTo(centerX/scale + isoX - this.size/2, centerY/scale + isoY - this.size/2);
        ctx.lineTo(centerX/scale + isoX, centerY/scale + isoY - this.size);
        ctx.lineTo(centerX/scale + isoX + this.size/2, centerY/scale + isoY - this.size/2);
        ctx.closePath();
        ctx.fill();
    }
}
