
export class TouchHandler {
    constructor(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        this.isDragging = false;
        this.lastPos = { x: 0, y: 0 };
        this.initialPinchDistance = 0;
        this.initialScale = 1;
        this.touchStartTime = 0;
        this.longPressDelay = 500;
        this.touchTimeout = null;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            this.touchStartTime = Date.now();
            this.lastPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
            this.touchTimeout = setTimeout(() => {
                this.isDragging = true;
            }, this.longPressDelay);
        } else if (e.touches.length === 2) {
            clearTimeout(this.touchTimeout);
            this.isDragging = false;
            this.initialPinchDistance = this.getPinchDistance(e.touches);
            this.initialScale = this.camera.scale;
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        if (e.touches.length === 1 && this.isDragging) {
            const dx = e.touches[0].clientX - this.lastPos.x;
            const dy = e.touches[0].clientY - this.lastPos.y;
            this.camera.updateOffset(dx, dy);
            this.lastPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        } else if (e.touches.length === 2) {
            const currentDistance = this.getPinchDistance(e.touches);
            const newScale = this.initialScale * (currentDistance / this.initialPinchDistance);
            this.camera.updateScale(newScale, this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    handleTouchEnd(e) {
        e.preventDefault();
        clearTimeout(this.touchTimeout);
        this.isDragging = false;
    }

    getPinchDistance(touches) {
        return Math.hypot(
            touches[1].clientX - touches[0].clientX,
            touches[1].clientY - touches[0].clientY
        );
    }

    cleanup() {
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    }
}
