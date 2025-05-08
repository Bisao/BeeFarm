import { Scene } from '../core/baseScene.js';
import { MaleNPC } from '../core/maleNPC.js';
import { FemaleNPC } from '../core/femaleNPC.js';

export class GameScene extends Scene {
    constructor() {
        super();
        this.container = document.getElementById('game-container');
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 50;
        this.gridWidth = 10;
        this.gridHeight = 10;
        this.offset = { x: 0, y: 0 };
        this.isDragging = false;
        this.lastPos = { x: 0, y: 0 };
        this.scale = 1;
        this.tiles = Array(this.gridWidth).fill().map(() => Array(this.gridHeight).fill(true));
        this.touchCount = 0;
        this.initialPinchDistance = 0;
        this.maleNPC = new MaleNPC(0, 0);
        this.femaleNPC = new FemaleNPC(0, 0);
        this.maleNPC.updateGridPosition(4, 4);
        this.femaleNPC.updateGridPosition(6, 6);
    }

    enter() {
        this.container.innerHTML = `
            <div class="top-bar">
                <button class="settings-button" id="configBtn">⚙️ Settings</button>
            </div>
            <div class="modal-overlay" id="configModal">
                <div class="settings-modal">
                    <h2>Settings</h2>
                    <div class="settings-content">
                        <!-- Settings content here -->
                    </div>
                    <button class="button" id="configCloseBtn">Close</button>
                </div>
            </div>
        `;

        this.canvas.style.display = 'block';
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    exit() {
        this.canvas.style.display = 'none';
        window.removeEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.drawGrid();
    }

    drawGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const centerX = this.canvas.width / 2 + this.offset.x;
        const centerY = this.canvas.height / 3 + this.offset.y;

        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(
            (this.canvas.width / 2) * (1 - 1/this.scale),
            (this.canvas.height / 2) * (1 - 1/this.scale)
        );

        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const isoX = (x - y) * this.gridSize / 2;
                const isoY = (x + y) * this.gridSize / 4;

                this.ctx.beginPath();
                this.ctx.moveTo(centerX/this.scale + isoX, centerY/this.scale + isoY);
                this.ctx.lineTo(centerX/this.scale + isoX + this.gridSize / 2, centerY/this.scale + isoY + this.gridSize / 4);
                this.ctx.lineTo(centerX/this.scale + isoX, centerY/this.scale + isoY + this.gridSize / 2);
                this.ctx.lineTo(centerX/this.scale + isoX - this.gridSize / 2, centerY/this.scale + isoY + this.gridSize / 4);
                this.ctx.closePath();
                this.ctx.strokeStyle = '#4CAF50';
                this.ctx.stroke();
            }
        }

        this.maleNPC.draw(this.ctx, centerX, centerY, this.scale);
        this.femaleNPC.draw(this.ctx, centerX, centerY, this.scale);
        this.ctx.restore();
    }

    update(delta) {
        this.maleNPC.update(this.gridWidth, this.gridHeight);
        this.femaleNPC.update(this.gridWidth, this.gridHeight);
    }

    draw() {
        this.drawGrid();
    }
}