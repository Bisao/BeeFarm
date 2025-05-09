
export class Performance {
    constructor() {
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 30; // 30 FPS
        this.isRendering = false;
    }

    shouldRender(timestamp) {
        return timestamp - this.lastFrameTime >= this.frameInterval;
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
}
