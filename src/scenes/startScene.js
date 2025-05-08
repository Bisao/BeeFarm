
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
            </div>
        `;

        document.getElementById('playBtn').addEventListener('click', () => this.startGame());
    }

    async startGame() {
        // Show loading screen
        this.container.innerHTML = `
            <div class="loading-screen">
                <h2>Loading...</h2>
                <div class="progress-bar"></div>
            </div>
        `;

        try {
            // Simulate asset loading (replace with actual asset loading)
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.manager.changeScene('game');
        } catch (error) {
            console.error('Failed to load game assets:', error);
            // Show error message and retry button
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
