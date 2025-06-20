
export class SceneManager {
    constructor() {
        this.scenes = new Map();
        this.currentScene = null;
        this.history = [];
        this.lastUpdate = performance.now();
        this.animate = this.animate.bind(this);
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

        if (this.currentScene) {
            this.currentScene.exit();
            this.history.push(this.currentScene);
        }

        this.currentScene = this.scenes.get(name);
        this.currentScene.enter();
        requestAnimationFrame(this.animate);
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
