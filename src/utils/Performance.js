
export class Performance {
    constructor() {
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 60; // Aumentado para 60 FPS
        this.isRendering = false;
        this.frameCount = 0;
        this.lastFPSUpdate = 0;
        this.currentFPS = 0;
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
