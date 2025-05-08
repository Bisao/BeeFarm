
export class Structure {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 40;
        this.type = 'generic';
    }

    draw(ctx, centerX, centerY, scale) {
        const isoX = (this.x - this.y) * 50 / 2;
        const isoY = (this.x + this.y) * 50 / 4;
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(
            centerX/scale + isoX - this.size/2,
            centerY/scale + isoY - this.size/2,
            this.size,
            this.size
        );
    }
}
