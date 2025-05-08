
import { Scene } from './baseScene.js';

export class TreeManager {
    constructor() {
        this.trees = [];
        this.treeImages = {
            pine: this.loadImage('/attached_assets/tree_pine-removebg-preview.png'),
            simple: this.loadImage('/attached_assets/tree_simple-removebg-preview.png')
        };
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

    draw(ctx, centerX, centerY, scale) {
        for (const tree of this.trees) {
            const isoX = (tree.x - tree.y) * 50 / 2;
            const isoY = (tree.x + tree.y) * 50 / 4;
            const img = this.treeImages[tree.type];
            
            if (img.complete) {
                // Scale trees to fit grid cells (40x40 pixels)
                const treeWidth = 40;
                const treeHeight = 40;
                
                ctx.drawImage(
                    img,
                    centerX/scale + isoX - treeWidth/2,
                    centerY/scale + isoY - treeHeight,
                    treeWidth,
                    treeHeight
                );
            }
        }
    }
}
