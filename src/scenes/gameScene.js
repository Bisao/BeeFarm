
import { Scene } from '../core/baseScene.js';

export class GameScene extends Scene {
    constructor() {
        super();
        this.container = document.getElementById('game-container');
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 50;
        this.gridWidth = 10;
        this.gridHeight = 10;
    }

    enter() {
        this.canvas.style.display = 'block';
        this.container.innerHTML = `
            <button class="button" onclick="window.history.back()" style="position: absolute; top: 10px; left: 10px;">Back</button>
        `;
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.drawGrid();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.drawGrid();
    }

    drawGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 3;

        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const isoX = (x - y) * this.gridSize / 2;
                const isoY = (x + y) * this.gridSize / 4;

                // Draw tile
                this.ctx.beginPath();
                this.ctx.moveTo(centerX + isoX, centerY + isoY);
                this.ctx.lineTo(centerX + isoX + this.gridSize / 2, centerY + isoY + this.gridSize / 4);
                this.ctx.lineTo(centerX + isoX, centerY + isoY + this.gridSize / 2);
                this.ctx.lineTo(centerX + isoX - this.gridSize / 2, centerY + isoY + this.gridSize / 4);
                this.ctx.closePath();
                this.ctx.strokeStyle = '#4CAF50';
                this.ctx.stroke();
            }
        }
    }

    exit() {
        this.canvas.style.display = 'none';
        this.container.innerHTML = '';
        window.removeEventListener('resize', () => this.resizeCanvas());
    }
}
