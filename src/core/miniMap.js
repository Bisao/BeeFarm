
export class MiniMap {
    constructor(gameScene) {
        this.gameScene = gameScene;
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'mini-map';
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 200;
        this.canvas.height = 200;
        document.getElementById('game-container').appendChild(this.canvas);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const scale = Math.min(
            this.canvas.width / (this.gameScene.gridWidth * this.gameScene.gridSize),
            this.canvas.height / (this.gameScene.gridHeight * this.gameScene.gridSize)
        );
        
        // Draw grid points
        this.ctx.fillStyle = '#90EE90';
        for (let y = 0; y < this.gameScene.gridHeight; y++) {
            for (let x = 0; x < this.gameScene.gridWidth; x++) {
                const mapX = (x - y) * scale * 2 + this.canvas.width/2;
                const mapY = (x + y) * scale + this.canvas.height/2;
                this.ctx.fillRect(mapX - 1, mapY - 1, 2, 2);
            }
        }
        
        // Draw viewport indicator
        const viewportWidth = (this.gameScene.canvas.width / this.gameScene.scale) * scale;
        const viewportHeight = (this.gameScene.canvas.height / this.gameScene.scale) * scale;
        const viewportX = this.canvas.width/2 + (this.gameScene.offset.x * scale / this.gameScene.scale);
        const viewportY = this.canvas.height/2 + (this.gameScene.offset.y * scale / this.gameScene.scale);
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.strokeRect(
            viewportX - viewportWidth/2,
            viewportY - viewportHeight/2,
            viewportWidth,
            viewportHeight
        );
    }
}
