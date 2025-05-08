import { Scene } from '../core/baseScene.js';
import { NPC } from '../core/npc.js';

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
        this.touchCount = 0;
        this.initialPinchDistance = 0;

        // Create test NPC
        this.testNPC = new NPC(0, 0);
        this.testNPC.updateGridPosition(5, 5); // Place in middle of grid
    }

    enter() {
        this.container.innerHTML = `
            <div class="top-bar">
                <button class="settings-button" id="settingsBtn">⚙️ Settings</button>
            </div>
        `;
        this.container.style.display = 'block';
        this.canvas.style.display = 'block';

        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.manager.changeScene('settings');
        });
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 2) {
                this.isDragging = true;
                this.lastPos = { x: e.clientX, y: e.clientY };
            }
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.offset.x += e.clientX - this.lastPos.x;
                this.offset.y += e.clientY - this.lastPos.y;
                this.lastPos = { x: e.clientX, y: e.clientY };
                this.drawGrid();
            }
        });
        this.canvas.addEventListener('mouseup', () => this.isDragging = false);
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoom = e.deltaY > 0 ? 0.9 : 1.1;

            // Get mouse position relative to canvas
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Calculate offset change based on mouse position
            const xBeforeZoom = (mouseX - this.offset.x) / this.scale;
            const yBeforeZoom = (mouseY - this.offset.y) / this.scale;

            this.scale *= zoom;
            this.scale = Math.max(0.1, Math.min(this.scale, 5));

            const xAfterZoom = xBeforeZoom * this.scale;
            const yAfterZoom = yBeforeZoom * this.scale;

            this.offset.x += mouseX - (this.offset.x + xAfterZoom);
            this.offset.y += mouseY - (this.offset.y + yAfterZoom);

            this.drawGrid();
        });

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            this.touchCount = e.touches.length;
            if (this.touchCount === 1) {
                this.isDragging = true;
                this.lastPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            } else if (this.touchCount === 2) {
                this.isDragging = false;
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                this.initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
            }
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.touchCount === 1 && this.isDragging) {
                this.offset.x += e.touches[0].clientX - this.lastPos.x;
                this.offset.y += e.touches[0].clientY - this.lastPos.y;
                this.lastPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            } else if (this.touchCount === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const zoom = distance / this.initialPinchDistance;
                this.scale *= zoom;
                this.scale = Math.max(0.1, Math.min(this.scale, 5));
                this.initialPinchDistance = distance;
            }
            this.drawGrid();
        });
        this.canvas.addEventListener('touchend', (e) => {
            this.touchCount = e.touches.length;
            if (this.touchCount < 2) this.isDragging = false;
        });

        this.drawGrid();
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

                // Draw tile
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

        // Draw NPC
        this.testNPC.draw(this.ctx, centerX, centerY, this.scale);

        this.ctx.restore();
    }

    exit() {
        this.canvas.style.display = 'none';
        this.container.innerHTML = '';
        window.removeEventListener('resize', () => this.resizeCanvas());
    }
}