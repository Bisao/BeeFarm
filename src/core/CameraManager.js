
export class CameraManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.offset = { x: 0, y: 0 };
        this.scale = 1;
        this.isDragging = false;
        this.lastPosition = { x: 0, y: 0 };
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.lastPosition = { x: e.clientX, y: e.clientY };
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.lastPosition.x;
        const deltaY = e.clientY - this.lastPosition.y;
        
        this.offset.x += deltaX;
        this.offset.y += deltaY;
        
        this.lastPosition = { x: e.clientX, y: e.clientY };
    }

    handleMouseUp(e) {
        this.isDragging = false;
    }

    handleWheel(e) {
        e.preventDefault();
        const zoomFactor = 0.1;
        const zoom = e.deltaY > 0 ? 1 - zoomFactor : 1 + zoomFactor;
        this.updateScale(this.scale * zoom, e.clientX, e.clientY);
    }

    updateScale(newScale, clientX, clientY) {
        const minScale = 0.5;
        const maxScale = 2;
        
        newScale = Math.min(Math.max(newScale, minScale), maxScale);
        
        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        const scaleFactor = newScale / this.scale;
        
        this.offset.x = x - (x - this.offset.x) * scaleFactor;
        this.offset.y = y - (y - this.offset.y) * scaleFactor;
        
        this.scale = newScale;
    }

    getTransform() {
        return {
            offset: this.offset,
            scale: this.scale
        };
    }
}
