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

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    handleTouchMove = this.debounce((event) => {
        if (this.isDragging) {
            const touch = event.touches[0];
            const deltaX = touch.clientX - this.lastPos.x;
            const deltaY = touch.clientY - this.lastPos.y;
            this.camera.updateOffset(deltaX, deltaY);
            this.lastPos = {
                x: touch.clientX,
                y: touch.clientY
            };
        } else if (event.touches.length === 2) {
            const currentDistance = this.getPinchDistance(event.touches);
            const newScale = this.initialScale * (currentDistance / this.initialPinchDistance);
            this.camera.updateScale(newScale, this.canvas.width / 2, this.canvas.height / 2);
        }
    }, 10);

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