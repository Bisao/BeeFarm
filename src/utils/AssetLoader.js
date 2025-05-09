
export class AssetLoader {
    constructor() {
        this.cache = new Map();
        this.loading = new Map();
        this.sprites = null;
    }

    async init() {
        const response = await fetch('/src/assets/sprites.json');
        this.sprites = await response.json();
    }

    async loadImage(path) {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }

        if (this.loading.has(path)) {
            return this.loading.get(path);
        }

        const loadPromise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.cache.set(path, img);
                this.loading.delete(path);
                resolve(img);
            };
            img.onerror = reject;
            img.src = `/src/assets/images/${path}`;
        });

        this.loading.set(path, loadPromise);
        return loadPromise;
    }

    clearUnused(usedPaths) {
        for (const [path] of this.cache) {
            if (!usedPaths.includes(path)) {
                this.cache.delete(path);
            }
        }
    }
}
