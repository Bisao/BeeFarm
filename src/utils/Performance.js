
export class Performance {
    constructor() {
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 60;
        this.isRendering = false;
        this.frameCount = 0;
        this.lastFPSUpdate = 0;
        this.currentFPS = 0;
        this.frameDeltas = new Float32Array(60); // Buffer circular para médias
        this.frameDeltaIndex = 0;
        this.useRAF = true; // Usar requestAnimationFrame
    }

    calculateAverageFrameTime() {
        return this.frameDeltas.reduce((a, b) => a + b, 0) / this.frameDeltas.length;
    }

    adjustPerformance() {
        const avgFrameTime = this.calculateAverageFrameTime();
        if (avgFrameTime > this.frameInterval * 1.2) {
            this.frameInterval = 1000 / 30; // Reduzir para 30 FPS se necessário
        } else if (avgFrameTime < this.frameInterval * 0.8) {
            this.frameInterval = 1000 / 60; // Voltar para 60 FPS se possível
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
    }

    requestRender(callback) {
        if (!this.isRendering) {
            requestAnimationFrame((timestamp) => {
                if (this.shouldRender(timestamp)) {
                    this.startFrame(timestamp);
                    callback();
                    this.endFrame();
                }
            });
        }
    }

    getFPS() {
        return this.currentFPS;
    }
}
