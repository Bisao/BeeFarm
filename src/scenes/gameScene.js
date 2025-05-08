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
            
        }
    }
}