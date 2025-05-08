
import { Scene } from '../core/baseScene.js';

export class GameScene extends Scene {
    constructor() {
        super();
        this.container = document.getElementById('game-container');
    }

    enter() {
        this.container.innerHTML = `
            <div class="game-scene">
                <h2>Game Started!</h2>
                <button class="button" onclick="window.history.back()">Back</button>
            </div>
        `;
    }

    exit() {
        this.container.innerHTML = '';
    }
}
