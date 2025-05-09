export class TreeManager {
    constructor() {
        this.trees = [];
        this.occupiedPositions = new Set();
        this.treeImages = {
            pine: this.loadImage('/src/assets/images/trees/tree_pine-removebg-preview.png'),
            simple: this.loadImage('/src/assets/images/trees/tree_simple-removebg-preview.png')
        };
    }

    isPositionOccupied(x, y) {
        return this.occupiedPositions.has(`${x},${y}`);
    }

    occupyPosition(x, y) {
        this.occupiedPositions.add(`${x},${y}`);
    }

    loadImage(src) {
        const img = new Image();
        img.src = src;
        return img;
    }

    generateRandomTrees(gridWidth, gridHeight) {
        this.trees = [];
        this.occupiedPositions.clear();
        
        // Calcula área total e define densidade de árvores (30-50% da área)
        const totalArea = gridWidth * gridHeight;
        const minDensity = 0.3;
        const maxDensity = 0.5;
        const targetDensity = minDensity + Math.random() * (maxDensity - minDensity);
        const targetTrees = Math.floor(totalArea * targetDensity);
        
        let attempts = 0;
        const maxAttempts = totalArea * 2;

        while (this.trees.length < targetTrees && attempts < maxAttempts) {
            const x = Math.floor(Math.random() * gridWidth);
            const y = Math.floor(Math.random() * gridHeight);

            if (!this.isPositionOccupied(x, y)) {
                const type = Math.random() < 0.5 ? 'pine' : 'simple';
                this.trees.push({ x, y, type });
                this.occupyPosition(x, y);
            }
            attempts++;
        }
    }

    drawSingle(ctx, centerX, centerY, scale, tree) {
        const isoX = (tree.x - tree.y) * 50 / 2;
        const isoY = (tree.x + tree.y) * 50 / 4;
        const img = this.treeImages[tree.type];

        if (img.complete) {
            const treeWidth = 60;
            const treeHeight = 60;

            const tileCenter = {
                x: centerX/scale + isoX,
                y: centerY/scale + isoY
            };

            ctx.drawImage(
                img,
                tileCenter.x - treeWidth/2,
                tileCenter.y - treeHeight,  // Deslocamento vertical para melhor posicionamento
                treeWidth * 1.2,  // Aumenta um pouco a largura
                treeHeight * 1.4  // Aumenta um pouco a altura
            );
        }
    }

    draw(ctx, centerX, centerY, scale) {
        for (const tree of this.trees) {
            this.drawSingle(ctx, centerX, centerY, scale, tree);
        }
    }
}