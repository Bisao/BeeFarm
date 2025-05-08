
export class NPC {
    constructor(x, y) {
        this.position = { x, y };
        this.gridPosition = { x: 0, y: 0 };
        this.color = '#FFD700'; // Default color (gold)
        this.size = 20;
        this.house = null;
    }

    setHouse(house) {
        this.house = house;
    }

    updateGridPosition(x, y) {
        this.gridPosition.x = x;
        this.gridPosition.y = y;
        // Convert grid position to isometric position
        this.position.x = (x - y) * 50 / 2; // 50 is gridSize
        this.position.y = (x + y) * 50 / 4;
    }

    draw(ctx, centerX, centerY, scale) {
        ctx.beginPath();
        ctx.arc(
            centerX/scale + this.position.x,
            centerY/scale + this.position.y,
            this.size/2,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
    }
}
