export class NPC {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.state = 'idle';
        this.path = [];
        this.lastUpdate = performance.now();
        this.updateInterval = 100; // Update every 100ms
        this.moveSpeed = 0.5;
    }

    update(gridWidth, gridHeight) {
        const now = performance.now();
        if (now - this.lastUpdate < this.updateInterval) return;

        if (this.path.length > 0) {
            const [nextX, nextY] = this.path[0];
            const dx = nextX - this.x;
            const dy = nextY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.moveSpeed) {
                this.x = nextX;
                this.y = nextY;
                this.path.shift();
            } else {
                this.x += (dx / distance) * this.moveSpeed;
                this.y += (dy / distance) * this.moveSpeed;
            }
        } else if (Math.random() < 0.1) {
            this.findNewPath(gridWidth, gridHeight);
        }

        this.lastUpdate = now;
    }

    findNewPath(gridWidth, gridHeight) {
        const targetX = Math.floor(Math.random() * gridWidth);
        const targetY = Math.floor(Math.random() * gridHeight);
        this.path = [[targetX, targetY]];
    }
}