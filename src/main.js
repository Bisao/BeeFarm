
import { SceneManager } from './core/sceneManager.js';
import { StartScene } from './scenes/startScene.js';
import { SettingsScene } from './scenes/settingsScene.js';
import { GameScene } from './scenes/gameScene.js';
import { CharacterSelectScene } from './scenes/characterSelectScene.js';

const loadCSS = () => {
    return new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `/src/assets/styles/${window.innerWidth <= 768 ? 'mobile' : 'pc'}.css`;
        link.onload = resolve;
        document.head.appendChild(link);
    });
};

async function init() {
    try {
        const assetCache = new AssetCache();
        const gameState = new GameState();
        
        // Preload assets
        await Promise.all([
            loadCSS(),
            assetCache.preloadAssets([
                '/src/assets/images/structures/house.png',
                '/src/assets/images/tiles/Tile_Grass.png'
                // Add other assets here
            ])
        ]);

        const sceneManager = new SceneManager(gameState, assetCache);
        
        sceneManager.registerScene('start', new StartScene());
        sceneManager.registerScene('settings', new SettingsScene());
        sceneManager.registerScene('character-select', new CharacterSelectScene());
        sceneManager.registerScene('game', new GameScene());
        
        sceneManager.changeScene('start');
    } catch (error) {
        console.error('Error initializing game:', error);
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="error-screen">
                <h2>Failed to load game</h2>
                <p>Please refresh the page to try again.</p>
            </div>
        `;
    }
}

window.addEventListener('load', init);
