
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
        this.showGrid = true;
        
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
            
            const worldX = (mouseX - this.canvas.width/2 - this.offset.x) / this.scale;
            const worldY = (mouseY - this.canvas.height/2 - this.offset.y) / this.scale;
            
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            this.scale *= zoomFactor;
            this.scale = Math.max(0.5, Math.min(this.scale, 3));
            
            this.offset.x = mouseX - worldX * this.scale - this.canvas.width/2;
            this.offset.y = mouseY - worldY * this.scale - this.canvas.height/2;
            
            this.drawGrid();
        });
        
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
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
                    <h2>Game Settings</h2>
                    <div class="settings-content">
                        <div class="setting-item">
                            <label>Grid Size:</label>
                            <input type="range" id="gridSizeRange" min="30" max="70" value="50">
                            <span id="gridSizeValue">50</span>
                        </div>
                        <div class="setting-item">
                            <label>Camera Speed:</label>
                            <input type="range" id="cameraSpeedRange" min="1" max="10" value="5">
                            <span id="cameraSpeedValue">5</span>
                        </div>
                        <div class="setting-item">
                            <label>Show Grid Lines:</label>
                            <input type="checkbox" id="showGridLines" checked>
                        </div>
                    </div>
                    <button class="button" id="configCloseBtn">Close</button>
                </div>
            </div>
        `;

        const configBtn = document.getElementById('configBtn');
        const configModal = document.getElementById('configModal');
        const configCloseBtn = document.getElementById('configCloseBtn');
        const gridSizeRange = document.getElementById('gridSizeRange');
        const gridSizeValue = document.getElementById('gridSizeValue');
        const cameraSpeedRange = document.getElementById('cameraSpeedRange');
        const cameraSpeedValue = document.getElementById('cameraSpeedValue');
        const showGridLines = document.getElementById('showGridLines');

        configBtn.addEventListener('click', () => {
            configModal.style.display = 'flex';
            requestAnimationFrame(() => {
                configModal.classList.add('visible');
                configModal.querySelector('.settings-modal').classList.add('visible');
            });
        });

        configCloseBtn.addEventListener('click', () => {
            configModal.classList.remove('visible');
            configModal.querySelector('.settings-modal').classList.remove('visible');
            setTimeout(() => {
                configModal.style.display = 'none';
            }, 300);
        });

        // Fechar modal ao clicar fora
        configModal.addEventListener('click', (e) => {
            if (e.target === configModal) {
                configCloseBtn.click();
            }
        });

        gridSizeRange.addEventListener('input', (e) => {
            gridSizeValue.textContent = e.target.value;
            this.gridSize = parseInt(e.target.value);
            this.drawGrid();
        });

        cameraSpeedRange.addEventListener('input', (e) => {
            cameraSpeedValue.textContent = e.target.value;
        });

        showGridLines.addEventListener('change', (e) => {
            this.showGrid = e.target.checked;
            this.drawGrid();
        });

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
                
                this.ctx.fillStyle = '#90EE90';
                this.ctx.fill();
                
                if (this.showGrid) {
                    this.ctx.strokeStyle = '#4CAF50';
                    this.ctx.stroke();
                }
                
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

        // Ordenar NPCs e árvores baseado na posição Y
        const objects = [
            { type: 'npc', obj: this.maleNPC },
            { type: 'npc', obj: this.femaleNPC },
            ...this.treeManager.trees.map(tree => ({ type: 'tree', obj: tree }))
        ].sort((a, b) => {
            const aY = a.type === 'npc' ? a.obj.position.y : (a.obj.x + a.obj.y) * this.gridSize / 4;
            const bY = b.type === 'npc' ? b.obj.position.y : (b.obj.x + b.obj.y) * this.gridSize / 4;
            return aY - bY;
        });

        // Desenhar objetos em ordem
        for (const object of objects) {
            if (object.type === 'npc') {
                object.obj.draw(this.ctx, centerX, centerY, this.scale);
            } else {
                this.drawTree(this.ctx, object.obj, centerX, centerY, this.scale);
            }
        }
        this.ctx.restore();
    }

    update(delta) {
        this.maleNPC.update(this.gridWidth, this.gridHeight);
        this.femaleNPC.update(this.gridWidth, this.gridHeight);
    }

    draw() {
        this.drawGrid();
    }

    drawTree(ctx, tree, centerX, centerY, scale) {
        const isoX = (tree.x - tree.y) * this.gridSize / 2;
        const isoY = (tree.x + tree.y) * this.gridSize / 4;
        const img = this.treeManager.treeImages[tree.type];
        
        if (img.complete) {
            const treeWidth = 60;
            const treeHeight = 60;
            const tileCenter = {
                x: centerX/scale + isoX,
                y: centerY/scale + isoY
            };
            
            ctx.drawImage(
                img,
                tileCenter.x - treeWidth/2,
                tileCenter.y - treeHeight/2,
                treeWidth,
                treeHeight
            );
        }
    }
}
