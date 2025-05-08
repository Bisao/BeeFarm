
export class WoodcuttingSystem {
    constructor() {
        this.treesBeingCut = new Map(); // Mapeia árvores sendo cortadas para NPCs
        this.woodCuttingTime = 3000; // 3 segundos para cortar uma árvore
        this.woodcarryingCapacity = 3; // Quantidade máxima de madeira que um NPC pode carregar
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
    }

    cancelCutting(npc, tree) {
        if (this.treesBeingCut.get(tree) === npc) {
            this.treesBeingCut.delete(tree);
            npc.stopWoodcutting();
        }
    }
}
