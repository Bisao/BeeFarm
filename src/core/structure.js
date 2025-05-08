
export class Structure {
    constructor(x, y) {
        this.position = { x, y };
        this.gridPosition = { x: 0, y: 0 };
        this.size = { width: 100, height: 100 };
        this.image = new Image();
    }

    updateGridPosition(x, y) {
        this.gridPosition.x = x;
        this.gridPosition.y = y;
        this.position.x = (x - y) * 50 / 2;
        this.position.y = (x + y) * 50 / 4;
    }

    draw(ctx, centerX, centerY, scale) {
        if (this.image.complete) {
            ctx.drawImage(
                this.image,
                centerX/scale + this.position.x - this.size.width/2,
                centerY/scale + this.position.y - this.size.height/2,
                this.size.width,
                this.size.height
            );
        }
    }
}
