import { SceneManager } from './core/sceneManager.js';
import { StartScene } from './scenes/startScene.js';
import { SettingsScene } from './scenes/settingsScene.js';
import { GameScene } from './scenes/gameScene.js';
import { CharacterSelectScene } from './scenes/characterSelectScene.js';
import { AssetCache } from './utils/AssetCache.js';
import { GameState } from './core/GameState.js';

async function init() {
    try {
        const container = document.getElementById('game-container');
        if (!container) {
            throw new Error('Game container not found');
        }

        const assetCache = new AssetCache();
        const gameState = new GameState();
        const sceneManager = new SceneManager();

        await sceneManager.init(gameState, assetCache);

        sceneManager.registerScene('start', new StartScene());
        sceneManager.registerScene('settings', new SettingsScene());
        sceneManager.registerScene('character-select', new CharacterSelectScene());
        sceneManager.registerScene('game', new GameScene());

        sceneManager.changeScene('start');
    } catch (error) {
        console.error('Error initializing game:', error);
        const container = document.getElementById('game-container');
        if (container) {
            container.innerHTML = `
                <div class="error-screen">
                    <h2>Failed to load game</h2>
                    <p>${error.message}</p>
                    <button class="button" onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }
}

window.addEventListener('load', init);