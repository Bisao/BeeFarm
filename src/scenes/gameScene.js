import { Scene } from '../core/baseScene.js';
import { MaleNPC } from '../core/maleNPC.js';
import { FemaleNPC } from '../core/femaleNPC.js';
import { TreeManager } from '../core/treeManager.js';

export class GameScene extends Scene {
    constructor() {
        super();
        this.container = document.getElementById('game-container');
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 50;
        this.gridWidth = 50;
        this.gridHeight = 50;
        this.offset = { x: 0, y: 0 };
        this.isDragging = false;
        this.lastPos = { x: 0, y: 0 };
        this.scale = 1;
        this.touchCount = 0;
        this.initialPinchDistance = 0;
        this.initialScale = 1;
        this.minScale = window.innerWidth <= 768 ? 0.8 : 0.5;
        this.maxScale = 3;
        this.renderDistance = window.innerWidth <= 768 ? 15 : 25;
        
        // Add touch event listeners for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.lastPos = { 
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY 
                };
            }
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.isDragging && e.touches.length === 1) {
                const dx = e.touches[0].clientX - this.lastPos.x;
                const dy = e.touches[0].clientY - this.lastPos.y;
                this.offset.x += dx;
                this.offset.y += dy;
                this.lastPos = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
                this.drawGrid();
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isDragging = false;
        });
        
        // Add mouse event listeners
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastPos = { x: e.clientX, y: e.clientY };
            e.preventDefault();
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const dx = e.clientX - this.lastPos.x;
                const dy = e.clientY - this.lastPos.y;
                this.offset.x += dx;
                this.offset.y += dy;
                this.lastPos = { x: e.clientX, y: e.clientY };
                this.drawGrid();
            }
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 2) {
                this.isDragging = false;
            }
        });
        
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Convert mouse position to world space before zoom
            const worldX = (mouseX - this.canvas.width/2 - this.offset.x) / this.scale;
            const worldY = (mouseY - this.canvas.height/2 - this.offset.y) / this.scale;
            
            // Adjust scale
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            this.scale *= zoomFactor;
            this.scale = Math.max(this.minScale, Math.min(this.scale, this.maxScale));
            
            // Adjust offset to keep mouse position fixed
            this.offset.x = mouseX - worldX * this.scale - this.canvas.width/2;
            this.offset.y = mouseY - worldY * this.scale - this.canvas.height/2;
            
            this.drawGrid();
        });
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Initialize tree manager and generate random trees
        this.treeManager = new TreeManager();
        this.treeManager.generateRandomTrees(this.gridWidth, this.gridHeight, 400);
        
        this.maleNPC = new MaleNPC(0, 0);
        this.femaleNPC = new FemaleNPC(0, 0);
        this.maleNPC.updateGridPosition(4, 5);
        this.femaleNPC.updateGridPosition(6, 5);
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

        // Calcular área visível
        const viewX = -this.offset.x / (this.gridSize * this.scale);
        const viewY = -this.offset.y / (this.gridSize * this.scale);
        
        // Determinar range de células visíveis
        const startX = Math.max(0, Math.floor(viewX - this.renderDistance));
        const startY = Math.max(0, Math.floor(viewY - this.renderDistance));
        const endX = Math.min(this.gridWidth, Math.ceil(viewX + this.renderDistance));
        const endY = Math.min(this.gridHeight, Math.ceil(viewY + this.renderDistance));
        
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const isoX = (x - y) * this.gridSize / 2;
                const isoY = (x + y) * this.gridSize / 4;

                this.ctx.beginPath();
                this.ctx.moveTo(centerX/this.scale + isoX, centerY/this.scale + isoY);
                this.ctx.lineTo(centerX/this.scale + isoX + this.gridSize / 2, centerY/this.scale + isoY + this.gridSize / 4);
                this.ctx.lineTo(centerX/this.scale + isoX, centerY/this.scale + isoY + this.gridSize / 2);
                this.ctx.lineTo(centerX/this.scale + isoX - this.gridSize / 2, centerY/this.scale + isoY + this.gridSize / 4);
                this.ctx.closePath();
                // Fill with grass color
                this.ctx.fillStyle = '#90EE90';
                this.ctx.fill();
                
                // Add grid lines
                this.ctx.strokeStyle = '#4CAF50';
                this.ctx.stroke();
                
                // Add tile pattern
                const pattern = Math.random() < 0.1 ? '.' : Math.random() < 0.05 ? '*' : '';
                if (pattern) {
                    this.ctx.fillStyle = '#000';
                    this.ctx.font = '12px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(pattern, 
                        centerX/this.scale + isoX, 
                        centerY/this.scale + isoY + 5);
                }
            }
        }

        // Draw trees before NPCs so NPCs appear in front
        this.treeManager.draw(this.ctx, centerX, centerY, this.scale, viewX, viewY);
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