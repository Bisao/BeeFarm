
import { House } from './house.js';

export class StructureManager {
    constructor() {
        this.structures = [];
        this.occupiedPositions = new Set();
    }

    isPositionOccupied(x, y) {
        return this.occupiedPositions.has(`${x},${y}`);
    }

    addStructure(type, x, y) {
        if (this.isPositionOccupied(x, y)) {
            return false;
        }

        let structure;
        switch(type) {
            case 'house':
                structure = new House(x, y);
                break;
            default:
                return false;
        }

        this.structures.push(structure);
        this.occupiedPositions.add(`${x},${y}`);
        return true;
    }
}
