
import { Scene } from '../core/baseScene.js';

export class SettingsScene extends Scene {
    constructor() {
        super();
        this.container = document.getElementById('game-container');
    }

    enter() {
        this.container.innerHTML = `
            <div class="settings-scene">
                <h2>Settings</h2>
                <button class="button" onclick="window.history.back()">Back</button>
            </div>
        `;
    }

    exit() {
        this.container.innerHTML = '';
    }
}
