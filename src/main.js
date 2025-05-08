
import { SceneManager } from './core/sceneManager.js';
import { StartScene } from './scenes/startScene.js';
import { SettingsScene } from './scenes/settingsScene.js';
import { GameScene } from './scenes/gameScene.js';

// Dynamic CSS loading based on screen width
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
    await loadCSS();
    const sceneManager = new SceneManager();
    
    // Register scenes
    sceneManager.registerScene('start', new StartScene());
    sceneManager.registerScene('settings', new SettingsScene());
    sceneManager.registerScene('game', new GameScene());
    
    // Start with the start scene
    sceneManager.changeScene('start');
}

window.addEventListener('load', init);
