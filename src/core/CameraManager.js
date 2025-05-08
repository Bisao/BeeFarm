
export class CameraManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.offset = { x: 0, y: 0 };
        this.scale = 1;
        this.minScale = 0.5;
        this.maxScale = 3;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.touchStartTime = 0;
        this.touchTimeout = null;
    }

    updateOffset(dx, dy) {
        this.offset.x += dx;
        this.offset.y += dy;
    }

    updateScale(newScale, centerX, centerY) {
        const oldScale = this.scale;
        this.scale = Math.max(this.minScale, Math.min(newScale, this.maxScale));
        
        if (oldScale !== this.scale) {
            const factor = this.scale / oldScale;
            this.offset.x = centerX - (centerX - this.offset.x) * factor;
            this.offset.y = centerY - (centerY - this.offset.y) * factor;
        }
    }

    handleMouseDown(e) {
        if (e.button === 2) { // Right click
            this.isDragging = true;
            this.dragStart = { x: e.clientX - this.offset.x, y: e.clientY - this.offset.y };
        }
    }

    handleMouseMove(e) {
        if (this.isDragging) {
            this.offset.x = e.clientX - this.dragStart.x;
            this.offset.y = e.clientY - this.dragStart.y;
        }
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    handleWheel(e) {
        e.preventDefault();
        const zoomFactor = 0.1;
        const zoom = e.deltaY > 0 ? 1 - zoomFactor : 1 + zoomFactor;
        this.updateScale(this.scale * zoom, e.clientX, e.clientY);
    }

    getTransform() {
        return {
            offset: this.offset,
            scale: this.scale
        };
    }
}
