
export class CameraManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.offset = { x: 0, y: 0 };
        this.scale = 1;
        this.minScale = 0.5;
        this.maxScale = 2;
        this.isDragging = false;
        this.lastPosition = { x: 0, y: 0 };
        
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
    }

    handleMouseDown(e) {
        if (e.button === 2) {
            this.isDragging = true;
            this.lastPosition = { x: e.clientX, y: e.clientY };
        }
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.lastPosition.x;
        const deltaY = e.clientY - this.lastPosition.y;
        
        this.offset.x += deltaX;
        this.offset.y += deltaY;
        
        this.lastPosition = { x: e.clientX, y: e.clientY };
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    handleWheel(e) {
        e.preventDefault();
        const zoom = e.deltaY > 0 ? 0.9 : 1.1;
        this.updateScale(this.scale * zoom, e.clientX, e.clientY);
    }

    updateScale(newScale, clientX, clientY) {
        const oldScale = this.scale;
        this.scale = Math.max(this.minScale, Math.min(newScale, this.maxScale));
        
        if (oldScale !== this.scale) {
            const rect = this.canvas.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            
            const factor = this.scale / oldScale;
            this.offset.x = x - (x - this.offset.x) * factor;
            this.offset.y = y - (y - this.offset.y) * factor;
        }
    }

    getTransform() {
        return {
            offset: this.offset,
            scale: this.scale
        };
    }
}
