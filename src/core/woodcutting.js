
export class WoodcuttingSystem {
    constructor(treeManager) {
        this.treesBeingCut = new Map();
        this.woodCuttingTime = 5000;
        this.woodcarryingCapacity = 3;
        this.treeManager = treeManager;
        this.cuttingProgress = new Map();
    }

    startCuttingTree(npc, tree) {
        if (!tree || !npc) return false;
        if (this.treesBeingCut.has(tree)) return false;

        this.treesBeingCut.set(tree, npc);
        this.cuttingProgress.set(tree, 0);
        npc.startWoodcutting(tree);

        const progressInterval = setInterval(() => {
            if (!this.treesBeingCut.has(tree)) {
                clearInterval(progressInterval);
                return;
            }

            const currentProgress = this.cuttingProgress.get(tree) + 20;
            this.cuttingProgress.set(tree, currentProgress);

            if (currentProgress >= 100) {
                clearInterval(progressInterval);
                this.completeCutting(npc, tree);
            }
        }, this.woodCuttingTime / 5);

        return true;
    }

    getTreeProgress(tree) {
        return this.cuttingProgress.get(tree) || 0;
    }

    completeCutting(npc, tree) {
        if (!this.treeManager?.trees) return;
        
        // Remover a árvore do mapa
        const treeIndex = this.treeManager.trees.findIndex(t => t === tree);
        if (treeIndex !== -1) {
            this.treeManager.trees.splice(treeIndex, 1);
            this.treeManager.occupiedPositions.delete(`${tree.x},${tree.y}`);
        }
        
        // Limpar estados de corte
        this.treesBeingCut.delete(tree);
        this.cuttingProgress.delete(tree);
        
        // Atualizar inventário do NPC
        npc.addWoodToInventory();
        npc.stopWoodcutting();
        
        // Definir próxima ação do NPC
        if (npc.woodInventory >= this.woodcarryingCapacity) {
            npc.moveToHouse();
        } else {
            const nextTree = npc.findNearestTree(this.treeManager.trees, this);
            if (nextTree) {
                npc.state = 'walking';
                npc.moveToGrid(nextTree.x, nextTree.y);
                npc.targetTree = nextTree;
            } else {
                npc.state = 'idle';
            }
        }
    }

    cancelCutting(npc, tree) {
        if (this.treesBeingCut.get(tree) === npc) {
            this.treesBeingCut.delete(tree);
            this.cuttingProgress.delete(tree);
            npc.stopWoodcutting();
        }
    }

    isTreeBeingCut(tree) {
        return this.treesBeingCut.has(tree);
    }
}
