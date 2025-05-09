
import { Scene } from '../core/baseScene.js';

export class StartScene extends Scene {
    constructor() {
        super();
        this.container = document.getElementById('game-container');
    }

    enter() {
        this.container.innerHTML = `
            <div class="start-scene">
                <h1>Game Title</h1>
                <button class="button" id="playBtn">Play</button>
                <button class="button" id="settingsBtn">Settings</button>
            </div>
        `;

        document.getElementById('playBtn').addEventListener('click', () => this.startGame());
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.manager.changeScene('settings');
        });
    }

    async startGame() {
        try {
            if (this.manager && this.manager.gameState) {
                this.manager.changeScene('character-select');
            } else {
                throw new Error('Game manager not properly initialized');
            }
        } catch (error) {
            console.error('Failed to load game assets:', error);
            this.container.innerHTML = `
                <div class="error-screen">
                    <h2>Failed to load game</h2>
                    <button class="button" onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }

    exit() {
        this.container.innerHTML = '';
    }
}
