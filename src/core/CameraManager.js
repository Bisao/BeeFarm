
export class CameraManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.offset = { x: 0, y: 0 };
        this.scale = 1;
        this.minScale = 0.5;
        this.maxScale = 3;
    }

    updateOffset(dx, dy) {
        this.offset.x += dx;
        this.offset.y += dy;
    }

    updateScale(newScale, centerX, centerY) {
        const oldScale = this.scale;
        this.scale = Math.max(this.minScale, Math.min(newScale, this.maxScale));
        
        // Ajusta o offset para manter o ponto de zoom
        if (oldScale !== this.scale) {
            const factor = this.scale / oldScale;
            this.offset.x = centerX - (centerX - this.offset.x) * factor;
            this.offset.y = centerY - (centerY - this.offset.y) * factor;
        }
    }

    getTransform() {
        return {
            offset: this.offset,
            scale: this.scale
        };
    }
}
