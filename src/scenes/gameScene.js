import { Scene } from '../core/baseScene.js';
import { MaleNPC } from '../core/maleNPC.js';
import { FemaleNPC } from '../core/femaleNPC.js';
import { TreeManager } from '../core/treeManager.js';
import { StructureManager } from '../core/structures/structureManager.js';
import { CameraManager } from '../core/CameraManager.js';
import { TouchHandler } from '../utils/TouchHandler.js';
import { Performance } from '../utils/Performance.js';

export class GameScene extends Scene {
    constructor() {
        super();
        this.container = document.getElementById('game-container');
        this.performance = new Performance();
        this.fps = 0;
        this.gridSize = 50;
        this.gridWidth = 50;
        this.gridHeight = 50;
        this.characterType = null;
        this.selectedStructure = null;
        this.highlightTile = null;
        this.canvas = null;
        this.ctx = null;
        this.camera = null;
        this.touchHandler = null;
        this.isRendering = false;

        // Initialize managers
        this.treeManager = new TreeManager();
        this.structureManager = new StructureManager();

        // Bind methods
        this.draw = this.draw.bind(this);
        this.setupEventListeners = this.setupEventListeners.bind(this);
    }

    enter() {
        try {
            if (!this.manager || !this.manager.gameState) {
                throw new Error('Game state not initialized');
            }
            
            this.characterType = this.manager.gameState.characterType || 'default';
            this.container.innerHTML = `
            <canvas id="gameCanvas"></canvas>
            <div class="game-ui">
                <button id="configBtn" class="ui-button">⚙️</button>
                <button id="buildBtn" class="ui-button">🏗️</button>
            </div>
        `;

        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.camera = new CameraManager(this.canvas);
        this.touchHandler = new TouchHandler(this.canvas, this.camera);

        // Generate initial trees
        this.treeManager.generateRandomTrees(this.gridWidth, this.gridHeight, 400);

        // Add initial structures
        this.structureManager.addStructure('house', 10, 10);
        this.structureManager.addStructure('house', 15, 15);

        this.setupEventListeners();
        this.isRendering = true;
        requestAnimationFrame(this.draw);
    }

    draw() {
        if (!this.isRendering) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Add drawing logic here

        requestAnimationFrame(this.draw);
    }

    setupEventListeners() {
        const configBtn = document.getElementById('configBtn');
        const buildBtn = document.getElementById('buildBtn');

        if (configBtn) {
            configBtn.addEventListener('click', () => {
                // Config button logic
            });
        }

        if (buildBtn) {
            buildBtn.addEventListener('click', () => {
                // Build button logic
            });
        }
    }

    exit() {
        this.isRendering = false;
        this.container.innerHTML = '';
    }
}