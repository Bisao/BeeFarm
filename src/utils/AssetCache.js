export class AssetCache {
    constructor() {
        this.cache = new Map();
    }

    async preloadAssets(assetUrls) {
        const loadPromises = assetUrls.map(url => this.loadAsset(url));
        return Promise.all(loadPromises);
    }

    async loadAsset(url) {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        const image = new Image();
        const loadPromise = new Promise((resolve, reject) => {
            image.onload = () => resolve(image);
            image.onerror = reject;
        });

        image.src = url;
        this.cache.set(url, image);
        return loadPromise;
    }

    getAsset(url) {
        return this.cache.get(url);
    }
}