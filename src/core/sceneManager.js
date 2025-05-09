
export class SceneManager {
    constructor() {
        this.scenes = new Map();
        this.currentScene = null;
        this.history = [];
        this.lastUpdate = performance.now();
        this.animate = this.animate.bind(this);
        this.gameState = null;
        this.assetCache = null;
    }

    async init(gameState, assetCache) {
        if (!gameState || !assetCache) {
            throw new Error('GameState and AssetCache must be provided');
        }
        this.gameState = gameState;
        this.assetCache = assetCache;
        
        // Ensure assets are loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
    }

    registerScene(name, scene) {
        this.scenes.set(name, scene);
        scene.manager = this;
    }

    changeScene(name) {
        if (!this.scenes.has(name)) {
            console.error(`Scene ${name} not found`);
            return;
        }

        if (!this.gameState || !this.assetCache) {
            console.error('Game state or asset cache not initialized');
            return;
        }

        try {
            if (this.currentScene) {
                this.currentScene.exit();
                this.history.push(this.currentScene);
            }

            this.currentScene = this.scenes.get(name);
            this.currentScene.enter();
            requestAnimationFrame(this.animate);
        } catch (error) {
            console.error('Error changing scene:', error);
        }
    }

    back() {
        if (this.history.length > 0) {
            const previousScene = this.history.pop();
            this.currentScene.exit();
            this.currentScene = previousScene;
            this.currentScene.enter();
        }
    }

    animate(timestamp) {
        const delta = timestamp - this.lastUpdate;
        this.lastUpdate = timestamp;

        if (this.currentScene) {
            this.currentScene.update(delta);
            this.currentScene.draw();
            requestAnimationFrame(this.animate);
        }
    }
}
