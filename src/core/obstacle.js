
export class Obstacle {
    constructor(x, y) {
        this.position = { x, y };
        this.gridPosition = { x: 0, y: 0 };
        this.color = '#8B4513';
        this.size = { width: 40, height: 40 };
    }

    updateGridPosition(x, y) {
        this.gridPosition.x = x;
        this.gridPosition.y = y;
        this.position.x = (x - y) * 50 / 2;
        this.position.y = (x + y) * 50 / 4;
    }

    draw(ctx, centerX, centerY, scale) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            centerX/scale + this.position.x - this.size.width/2,
            centerY/scale + this.position.y - this.size.height/2,
            this.size.width,
            this.size.height
        );
        ctx.strokeStyle = '#000';
        ctx.strokeRect(
            centerX/scale + this.position.x - this.size.width/2,
            centerY/scale + this.position.y - this.size.height/2,
            this.size.width,
            this.size.height
        );
    }
}
