
export class Performance {
    constructor() {
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 60;
        this.isRendering = false;
        this.frameCount = 0;
        this.lastFPSUpdate = performance.now();
        this.currentFPS = 0;
        this.frameDeltas = new Float32Array(60);
        this.frameDeltaIndex = 0;
        this.useRAF = true;
        this.offscreenCanvas = new OffscreenCanvas(800, 600);
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        this.imageCache = new Map();
        this.weakRefs = new WeakMap();
        this.resourceCache = new Map();
        this.lastGC = performance.now();
        this.gcThreshold = 30000;
        this.renderQueue = [];

        // Bind methods
        this.garbageCollect = this.garbageCollect.bind(this);
        
        // Iniciar garbage collection automático
        this.gcInterval = setInterval(() => this.garbageCollect(), this.gcThreshold);
    }

    garbageCollect() {
        const now = performance.now();
        if (now - this.lastGC < this.gcThreshold) return;

        // Limpar cache de imagens não utilizadas
        for (const [key, value] of this.imageCache.entries()) {
            if (!value.lastUsed || now - value.lastUsed > 60000) {
                this.imageCache.delete(key);
            }
        }

        // Limpar recursos não utilizados
        for (const [key, value] of this.resourceCache.entries()) {
            if (!value.lastUsed || now - value.lastUsed > 60000) {
                this.resourceCache.delete(key);
            }
        }

        // Limpar contexto offscreen
        if (this.offscreenCtx) {
            this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        }

        this.lastGC = now;
    }

    cacheImage(key, image) {
        this.imageCache.set(key, {
            image,
            lastUsed: performance.now()
        });
    }

    getCachedImage(key) {
        const cached = this.imageCache.get(key);
        if (cached) {
            cached.lastUsed = performance.now();
            return cached.image;
        }
        return null;
    }

    calculateAverageFrameTime() {
        return this.frameDeltas.reduce((a, b) => a + b, 0) / this.frameDeltas.length;
    }

    adjustPerformance() {
        const avgFrameTime = this.calculateAverageFrameTime();
        if (avgFrameTime > this.frameInterval * 1.2) {
            this.frameInterval = 1000 / 30;
        } else if (avgFrameTime < this.frameInterval * 0.8) {
            this.frameInterval = 1000 / 60;
        }
    }

    shouldRender(timestamp) {
        if (timestamp - this.lastFrameTime >= this.frameInterval) {
            this.updateFPS(timestamp);
            return true;
        }
        return false;
    }

    updateFPS(timestamp) {
        this.frameCount++;
        if (timestamp - this.lastFPSUpdate >= 1000) {
            this.currentFPS = this.frameCount;
            this.frameCount = 0;
            this.lastFPSUpdate = timestamp;
        }
    }

    startFrame(timestamp) {
        this.lastFrameTime = timestamp;
        this.isRendering = true;
    }

    endFrame() {
        this.isRendering = false;
        this.renderQueue = [];
    }

    queueForRendering(object, priority = 0) {
        this.renderQueue.push({ object, priority });
        this.renderQueue.sort((a, b) => b.priority - a.priority);
    }

    processRenderQueue(ctx) {
        for (const item of this.renderQueue) {
            try {
                item.object.draw(ctx);
            } catch (error) {
                console.error('Render error:', error);
            }
        }
    }

    getFPS() {
        return this.currentFPS;
    }

    destroy() {
        if (this.gcInterval) {
            clearInterval(this.gcInterval);
        }
    }
}
