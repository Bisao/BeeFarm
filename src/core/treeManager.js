
export class TreeManager {
    constructor() {
        this.trees = [];
        this.treeImages = {
            pine: this.loadImage('/src/assets/images/trees/tree_pine-removebg-preview.png'),
            simple: this.loadImage('/src/assets/images/trees/tree_simple-removebg-preview.png')
        };
        this.renderConfig = {
            maxRenderDistance: 25,
            enabled: true
        };
    }

    setRenderConfig(config) {
        this.renderConfig = { ...this.renderConfig, ...config };
    }

    loadImage(src) {
        const img = new Image();
        img.src = src;
        return img;
    }

    generateRandomTrees(gridWidth, gridHeight, count) {
        this.trees = [];
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * gridWidth);
            const y = Math.floor(Math.random() * gridHeight);
            const type = Math.random() < 0.5 ? 'pine' : 'simple';
            this.trees.push({ x, y, type });
        }
    }

    draw(ctx, centerX, centerY, scale, viewX, viewY) {
        if (!this.renderConfig.enabled) return;
        
        for (const tree of this.trees) {
            const dx = tree.x - viewX;
            const dy = tree.y - viewY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > this.renderConfig.maxRenderDistance) continue;
            
            const isoX = (tree.x - tree.y) * 50 / 2;
            const isoY = (tree.x + tree.y) * 50 / 4;
            const img = this.treeImages[tree.type];
            
            if (img.complete) {
                // Scale trees to fit grid cells (40x40 pixels)
                const treeWidth = 40;
                const treeHeight = 40;
                
                // Center the tree on the tile
                const tileCenter = {
                    x: centerX/scale + isoX,
                    y: centerY/scale + isoY
                };
                
                ctx.drawImage(
                    img,
                    tileCenter.x - treeWidth/2,
                    tileCenter.y - treeHeight/2,
                    treeWidth,
                    treeHeight
                );
            }
        }
    }
}
