import { Scene } from '../core/baseScene.js';
import { MaleNPC } from '../core/maleNPC.js';
import { FemaleNPC } from '../core/femaleNPC.js';
import { TreeManager } from '../core/treeManager.js';
import { StructureManager } from '../core/structures/structureManager.js';

export class GameScene extends Scene {
    constructor() {
        super();
        this.container = document.getElementById('game-container');
        this.gridSize = 50;
        this.gridWidth = 50;
        this.gridHeight = 50;

        this.treeManager = new TreeManager();
        this.treeManager.generateRandomTrees(this.gridWidth, this.gridHeight, 400);

        this.structureManager = new StructureManager();
        this.structureManager.addStructure('house', 10, 10);
        this.structureManager.addStructure('house', 15, 15);

        this.maleNPC = new MaleNPC(0, 0);
        this.femaleNPC = new FemaleNPC(0, 0);
        this.maleNPC.updateGridPosition(4, 5);
        this.femaleNPC.updateGridPosition(6, 5);
    }

    enter() {
        this.container.innerHTML = `
            <canvas id="gameCanvas"></canvas>
            <div class="game-ui">
                <div class="top-bar">
                    <button class="settings-button" id="configBtn">⚙️ Settings</button>
                    <div class="resources">
                        <span class="resource">🪙 Gold: <span id="goldCount">0</span></span>
                        <span class="resource">🪵 Wood: <span id="woodCount">0</span></span>
                    </div>
                </div>
                <div class="build-menu">
                    <button class="build-btn" data-type="lumberjack">🪓 Lumberjack</button>
                    <button class="build-btn" data-type="miner">⛏️ Miner</button>
                    <button class="build-btn" data-type="farmer">🌱 Farmer</button>
                    <button class="build-btn" data-type="fisherman">🎣 Fisherman</button>
                </div>
                <div class="modal-overlay" id="configModal">
                    <div class="settings-modal">
                        <h2>Game Settings</h2>
                        <div class="settings-content">
                            <div class="setting-item">
                                <label>Camera Speed:</label>
                                <input type="range" id="cameraSpeedRange" min="1" max="10" value="5">
                                <span id="cameraSpeedValue">5</span>
                            </div>
                        </div>
                        <button class="button" id="configCloseBtn">Close</button>
                    </div>
                </div>
            </div>
        `;

        const configBtn = document.getElementById('configBtn');
        const configModal = document.getElementById('configModal');
        const configCloseBtn = document.getElementById('configCloseBtn');
        const cameraSpeedRange = document.getElementById('cameraSpeedRange');
        const cameraSpeedValue = document.getElementById('cameraSpeedValue');

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

        configModal.addEventListener('click', (e) => {
            if (e.target === configModal) {
                configCloseBtn.click();
            }
        });

        cameraSpeedRange.addEventListener('input', (e) => {
            cameraSpeedValue.textContent = e.target.value;
        });

        this.canvas = document.getElementById('gameCanvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d');
        this.isRendering = true;
        this.camera = new CameraManager(this.canvas);
        this.touchHandler = new TouchHandler(this.canvas, this.camera);
        
        // Setup mouse controls
        this.canvas.addEventListener('mousedown', this.camera.handleMouseDown.bind(this.camera));
        this.canvas.addEventListener('mousemove', this.camera.handleMouseMove.bind(this.camera));
        this.canvas.addEventListener('mouseup', this.camera.handleMouseUp.bind(this.camera));
        this.canvas.addEventListener('wheel', this.camera.handleWheel.bind(this.camera));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        // Setup shop button
        const shopBtn = document.createElement('button');
        shopBtn.textContent = '🏪 Shop';
        shopBtn.className = 'settings-button';
        shopBtn.style.marginLeft = '10px';
        document.querySelector('.top-bar').appendChild(shopBtn);

        // Setup shop modal
        const shopModal = document.createElement('div');
        shopModal.className = 'modal-overlay';
        shopModal.id = 'shopModal';
        shopModal.innerHTML = `
            <div class="settings-modal">
                <h2>Shop</h2>
                <div class="shop-content">
                    <button class="build-btn" data-type="lumberjack">🪓 Lumberjack House (100 gold)</button>
                    <button class="build-btn" data-type="miner">⛏️ Miner House (150 gold)</button>
                    <button class="build-btn" data-type="farmer">🌱 Farmer House (80 gold)</button>
                    <button class="build-btn" data-type="fisherman">🎣 Fisherman House (120 gold)</button>
                </div>
                <button class="button" id="shopCloseBtn">Close</button>
            </div>
        `;
        this.container.appendChild(shopModal);

        shopBtn.addEventListener('click', () => {
            shopModal.style.display = 'flex';
            requestAnimationFrame(() => {
                shopModal.classList.add('visible');
                shopModal.querySelector('.settings-modal').classList.add('visible');
            });
        });

        const shopCloseBtn = document.getElementById('shopCloseBtn');
        shopCloseBtn.addEventListener('click', () => {
            shopModal.classList.remove('visible');
            shopModal.querySelector('.settings-modal').classList.remove('visible');
            setTimeout(() => {
                shopModal.style.display = 'none';
            }, 300);
        });
        
        requestAnimationFrame(() => this.draw());
    }

    update(delta) {
        this.maleNPC.update(this.gridWidth, this.gridHeight);
        this.femaleNPC.update(this.gridWidth, this.gridHeight);
    }

    cleanup() {
        // Cleanup any remaining event listeners
    }

    exit() {
        this.cleanup();
    }
    drawIsometricGrid(ctx, centerX, centerY, scale) {
        const gridSize = this.gridSize * scale;
        const gridWidth = this.gridWidth;
        const gridHeight = this.gridHeight;

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;

        for (let y = 0; y <= gridHeight; y++) {
            for (let x = 0; x <= gridWidth; x++) {
                const isoX = (x - y) * gridSize / 2;
                const isoY = (x + y) * gridSize / 4;

                // Draw grid lines
                ctx.beginPath();
                ctx.moveTo(centerX + (isoX - gridSize / 2), centerY + isoY);
                ctx.lineTo(centerX + (isoX + gridSize / 2), centerY + isoY);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(centerX + isoX, centerY + (isoY - gridSize / 4));
                ctx.lineTo(centerX + isoX, centerY + (isoY + gridSize / 4));
                ctx.stroke();
            }
        }
    }

    draw() {
        if (!this.isRendering) {
            return;
        }
        
        // Limpar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width/2;
        const centerY = this.canvas.height/2;
        
        // Aplicar transformações da câmera
        this.ctx.save();
        this.ctx.translate(centerX + this.camera.offset.x, centerY + this.camera.offset.y);
        this.ctx.scale(this.camera.scale, this.camera.scale);
        
        // Desenhar grid
        this.drawIsometricGrid(this.ctx, 0, 0, 1);
        
        // Desenhar árvores
        this.treeManager.trees.forEach(tree => {
            this.drawTree(this.ctx, tree, 0, 0, 1);
        });
        
        // Desenhar NPCs
        if (this.maleNPC && typeof this.maleNPC.draw === 'function') {
            this.maleNPC.draw(this.ctx, 0, 0, 1);
        }
        if (this.femaleNPC && typeof this.femaleNPC.draw === 'function') {
            this.femaleNPC.draw(this.ctx, 0, 0, 1);
        }
        
        // Desenhar estruturas
        if (this.structureManager && typeof this.structureManager.draw === 'function') {
            this.structureManager.draw(this.ctx, 0, 0, 1);
        }
        
        // Restaurar contexto
        this.ctx.restore();
        
        // Requisitar próximo frame
        requestAnimationFrame(() => this.draw());
    }

    drawTree(ctx, tree, centerX, centerY, scale) {
        const isoX = (tree.x - tree.y) * this.gridSize / 2;
        const isoY = (tree.x + tree.y) * this.gridSize / 4;
        const img = this.treeManager.treeImages[tree.type];

        if (img && img.complete && img.naturalHeight !== 0) {
            const treeWidth = 60 * scale;
            const treeHeight = 60 * scale;
            const tileCenter = {
                x: centerX + isoX * scale,
                y: centerY + isoY * scale
            };
            
            ctx.drawImage(img, 
                tileCenter.x - treeWidth/2, 
                tileCenter.y - treeHeight, 
                treeWidth, 
                treeHeight
            );
        }
    }
}