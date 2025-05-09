
import { Scene } from '../core/baseScene.js';
import { MaleNPC } from '../core/maleNPC.js';
import { FemaleNPC } from '../core/femaleNPC.js';
import { TreeManager } from '../core/treeManager.js';
import { StructureManager } from '../core/structures/structureManager.js';
import { CameraManager } from '../core/CameraManager.js';
import { TouchHandler } from '../utils/TouchHandler.js';

export class GameScene extends Scene {
    constructor() {
        super();
        this.container = document.getElementById('game-container');
        this.gridSize = 50;
        this.gridWidth = 50;
        this.gridHeight = 50;
        this.selectedStructure = null;
        this.highlightTile = null;
        this.canvas = null;
        this.ctx = null;
        this.camera = null;
        this.touchHandler = null;

        // Initialize managers
        this.treeManager = new TreeManager();
        this.structureManager = new StructureManager();

        // Generate initial trees
        this.treeManager.generateRandomTrees(this.gridWidth, this.gridHeight, 400);

        // Add initial structures
        this.structureManager.addStructure('house', 10, 10);
        this.structureManager.addStructure('house', 15, 15);

        // Initialize NPCs
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
                    <button class="settings-button" id="buildBtn">🏠 Build</button>
                </div>
            </div>

            <div class="modal-overlay" id="buildModal">
                <div class="build-modal">
                    <h2>Build Structures</h2>
                    <div class="build-grid">
                        <button class="build-item" data-type="miner">⛏️ Miner House</button>
                        <button class="build-item" data-type="farmer">🌱 Farmer House</button>
                        <button class="build-item" data-type="fisherman">🎣 Fisherman House</button>
                        <button class="build-item" data-type="lumberjack">🪓 Lumberjack House</button>
                    </div>
                    <button class="button" id="buildCloseBtn">Close</button>
                </div>
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
        `;

        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.camera = new CameraManager(this.canvas);
        this.touchHandler = new TouchHandler(this.canvas, this.camera);

        this.setupEventListeners();
        this.isRendering = true;
        requestAnimationFrame(() => this.draw());
    }

    setupEventListeners() {
        const configBtn = document.getElementById('configBtn');
        const configModal = document.getElementById('configModal');
        const configCloseBtn = document.getElementById('configCloseBtn');
        const buildBtn = document.getElementById('buildBtn');
        const buildModal = document.getElementById('buildModal');
        const buildCloseBtn = document.getElementById('buildCloseBtn');
        const buildItems = document.querySelectorAll('.build-item');

        buildBtn.addEventListener('click', () => {
            buildModal.style.display = 'flex';
            requestAnimationFrame(() => {
                buildModal.classList.add('visible');
            });
        });

        buildCloseBtn.addEventListener('click', () => {
            buildModal.classList.remove('visible');
            setTimeout(() => {
                buildModal.style.display = 'none';
            }, 300);
        });

        buildItems.forEach(item => {
            item.addEventListener('click', () => {
                this.selectedStructure = item.dataset.type;
                buildCloseBtn.click();
            });
        });

        configBtn.addEventListener('click', () => {
            configModal.style.display = 'flex';
            configModal.classList.add('visible');
        });

        configCloseBtn.addEventListener('click', () => {
            configModal.classList.remove('visible');
            setTimeout(() => configModal.style.display = 'none', 300);
        });

        this.canvas.addEventListener('mousedown', (e) => this.camera.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => {
            this.camera.handleMouseMove(e);
            if (this.selectedStructure) {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const gridPos = this.screenToGrid(mouseX, mouseY);
                if (gridPos) {
                    const isOccupied = this.structureManager.isPositionOccupied(gridPos.x, gridPos.y) ||
                                     this.treeManager.isPositionOccupied(gridPos.x, gridPos.y);
                    this.highlightTile = {
                        x: gridPos.x,
                        y: gridPos.y,
                        available: !isOccupied
                    };
                }
            }
        });

        this.canvas.addEventListener('mouseup', (e) => this.camera.handleMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.camera.handleWheel(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        this.canvas.addEventListener('click', (e) => {
            if (this.selectedStructure && this.highlightTile && this.highlightTile.available) {
                this.structureManager.addStructure(
                    this.selectedStructure,
                    this.highlightTile.x,
                    this.highlightTile.y
                );
                this.selectedStructure = null;
                this.highlightTile = null;
            }
        });
    }

    screenToGrid(screenX, screenY) {
        const centerX = this.canvas.width/2;
        const centerY = this.canvas.height/2;

        const adjustedX = (screenX - centerX - this.camera.offset.x) / this.camera.scale;
        const adjustedY = (screenY - centerY - this.camera.offset.y) / this.camera.scale;

        const tileX = Math.floor((2 * adjustedY + adjustedX) / this.gridSize);
        const tileY = Math.floor((2 * adjustedY - adjustedX) / this.gridSize);

        if (tileX >= 0 && tileX < this.gridWidth && tileY >= 0 && tileY < this.gridHeight) {
            return { x: tileX, y: tileY };
        }
        return null;
    }

    update(delta) {
        this.maleNPC.update(this.gridWidth, this.gridHeight);
        this.femaleNPC.update(this.gridWidth, this.gridHeight);
    }

    cleanup() {
        this.isRendering = false;
        
        // Store bound event handlers
        this.boundHandlers = {
            configClick: () => this.handleConfigClick(),
            buildClick: () => this.handleBuildClick(),
            configClose: () => this.handleConfigClose(),
            buildClose: () => this.handleBuildClose(),
            mouseDown: (e) => this.camera.handleMouseDown(e),
            mouseMove: (e) => this.camera.handleMouseMove(e),
            mouseUp: (e) => this.camera.handleMouseUp(e),
            wheel: (e) => this.camera.handleWheel(e),
            contextMenu: (e) => e.preventDefault(),
            click: (e) => this.handleClick(e)
        };
        
        // Remove UI event listeners
        const elements = {
            configBtn: document.getElementById('configBtn'),
            buildBtn: document.getElementById('buildBtn'),
            configCloseBtn: document.getElementById('configCloseBtn'),
            buildCloseBtn: document.getElementById('buildCloseBtn')
        };
        
        Object.entries(elements).forEach(([key, element]) => {
            if (element) {
                const handler = this.boundHandlers[key.replace('Btn', '').toLowerCase() + 'Click'];
                if (handler) element.removeEventListener('click', handler);
            }
        });
        
        // Remove canvas event listeners
        if (this.canvas) {
            this.canvas.removeEventListener('mousedown', this.boundHandlers.mouseDown);
            this.canvas.removeEventListener('mousemove', this.boundHandlers.mouseMove);
            this.canvas.removeEventListener('mouseup', this.boundHandlers.mouseUp);
            this.canvas.removeEventListener('wheel', this.boundHandlers.wheel);
            this.canvas.removeEventListener('contextmenu', this.boundHandlers.contextMenu);
            this.canvas.removeEventListener('click', this.boundHandlers.click);
        }
    }

    exit() {
        this.cleanup();
    }

    draw() {
        if (!this.isRendering) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const centerX = this.canvas.width/2;
        const centerY = this.canvas.height/2;

        this.ctx.save();
        this.ctx.translate(centerX + this.camera.offset.x, centerY + this.camera.offset.y);
        this.ctx.scale(this.camera.scale, this.camera.scale);

        this.drawIsometricGrid(this.ctx, 0, 0, 1);

        if (this.treeManager) {
            this.treeManager.draw(this.ctx, 0, 0, 1);
        }

        if (this.maleNPC && typeof this.maleNPC.draw === 'function') {
            this.maleNPC.draw(this.ctx, 0, 0, 1);
        }
        if (this.femaleNPC && typeof this.femaleNPC.draw === 'function') {
            this.femaleNPC.draw(this.ctx, 0, 0, 1);
        }

        if (this.structureManager) {
            this.structureManager.draw(this.ctx, 0, 0, 1);
        }

        if (this.selectedStructure && this.highlightTile) {
            const isoX = (this.highlightTile.x - this.highlightTile.y) * this.gridSize / 2;
            const isoY = (this.highlightTile.x + this.highlightTile.y) * this.gridSize / 4;

            this.ctx.fillStyle = this.highlightTile.available ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)';
            this.ctx.strokeStyle = this.highlightTile.available ? '#4CAF50' : '#F44336';
            this.ctx.lineWidth = 2;

            this.ctx.beginPath();
            this.ctx.moveTo(isoX, isoY - this.gridSize/4);
            this.ctx.lineTo(isoX + this.gridSize/2, isoY);
            this.ctx.lineTo(isoX, isoY + this.gridSize/4);
            this.ctx.lineTo(isoX - this.gridSize/2, isoY);
            this.ctx.closePath();

            this.ctx.fill();
            this.ctx.stroke();
        }

        this.ctx.restore();
        requestAnimationFrame(() => this.draw());
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
}
