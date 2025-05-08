
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
                <button class="button" id="backBtn">Back</button>
            </div>
        `;

        document.getElementById('backBtn').addEventListener('click', () => {
            this.manager.back();
        });
    }

    exit() {
        this.container.innerHTML = '';
    }
}
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
                <button class="button" id="backBtn">Back</button>
            </div>
        `;

        document.getElementById('backBtn').addEventListener('click', () => {
            this.manager.back();
        });
    }

    exit() {
        this.container.innerHTML = '';
    }
}
