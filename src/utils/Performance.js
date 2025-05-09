
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

    constructor() {
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 60; // 60 FPS
        this.isRendering = false;
        this.frameQueue = new Set();
        this.metrics = {
            fps: 0,
            frameTime: 0,
            lastUpdate: performance.now()
        };
    }

    requestRender(callback, priority = 0) {
        if (!this.isRendering) {
            this.frameQueue.add({ callback, priority });
            requestAnimationFrame(this.processFrameQueue.bind(this));
        }
    }

    processFrameQueue(timestamp) {
        if (this.shouldRender(timestamp)) {
            this.startFrame(timestamp);
            
            // Process frame queue in priority order
            Array.from(this.frameQueue)
                .sort((a, b) => b.priority - a.priority)
                .forEach(({ callback }) => {
                    try {
                        callback();
                    } catch (error) {
                        ErrorBoundary.handleError(error, 'Frame processing');
                    }
                });

            this.frameQueue.clear();
            this.updateMetrics(timestamp);
            this.endFrame();
        }
    }

    updateMetrics(timestamp) {
        const delta = timestamp - this.metrics.lastUpdate;
        this.metrics.fps = 1000 / delta;
        this.metrics.frameTime = delta;
        this.metrics.lastUpdate = timestamp;
    }
}
