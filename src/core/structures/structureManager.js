
import { House } from './house.js';

export class StructureManager {
    constructor() {
        this.structures = [];
        this.occupiedPositions = new Set();
    }

    isPositionOccupied(x, y) {
        return this.occupiedPositions.has(`${x},${y}`);
    }

    addStructure(type, x, y, direction = 'left') {
        if (this.isPositionOccupied(x, y)) {
            return false;
        }

        let structure;
        const houseTypes = ['miner', 'farmer', 'fisherman', 'lumberjack'];
        if (houseTypes.includes(type)) {
            structure = new House(x, y, type);
            structure.direction = direction;
            structure.updateImage();
        } else {
            return false;
        }

        this.structures.push(structure);
        this.occupiedPositions.add(`${x},${y}`);
        return true;
    }
}
