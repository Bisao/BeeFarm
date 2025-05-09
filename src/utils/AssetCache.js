
export class AssetCache {
    constructor() {
        this.cache = new Map();
        this.loading = new Map();
    }

    async loadImage(url) {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        if (this.loading.has(url)) {
            return this.loading.get(url);
        }

        const loadPromise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.cache.set(url, img);
                this.loading.delete(url);
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });

        this.loading.set(url, loadPromise);
        return loadPromise;
    }

    preloadAssets(urls) {
        return Promise.all(urls.map(url => this.loadImage(url)));
    }

    clear() {
        this.cache.clear();
        this.loading.clear();
    }
}
