
export class WoodcuttingSystem {
    constructor(treeManager) {
        this.treesBeingCut = new Map();
        this.woodCuttingTime = 5000; // 5 segundos para cortar uma árvore
        this.woodcarryingCapacity = 3;
        this.treeManager = treeManager;
    }

    startCuttingTree(npc, tree) {
        if (this.treesBeingCut.has(tree)) {
            return false; // Árvore já está sendo cortada
        }

        if (npc.woodInventory >= this.woodcarryingCapacity) {
            return false; // Inventário cheio
        }

        this.treesBeingCut.set(tree, npc);
        npc.startWoodcutting(tree);
        
        // Inicia o temporizador para cortar a árvore
        setTimeout(() => {
            if (this.treesBeingCut.get(tree) === npc) {
                this.completeCutting(npc, tree);
            }
        }, this.woodCuttingTime);

        return true;
    }

    completeCutting(npc, tree) {
        this.treesBeingCut.delete(tree);
        npc.addWoodToInventory();
        npc.stopWoodcutting();
        
        // Remover a árvore do jogo
        const treeIndex = this.treeManager.trees.findIndex(t => t === tree);
        if (treeIndex !== -1) {
            this.treeManager.trees.splice(treeIndex, 1);
            this.treeManager.occupiedPositions.delete(`${tree.x},${tree.y}`);
        }
    }

    cancelCutting(npc, tree) {
        if (this.treesBeingCut.get(tree) === npc) {
            this.treesBeingCut.delete(tree);
            npc.stopWoodcutting();
        }
    }
}
