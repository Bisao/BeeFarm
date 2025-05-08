
import { Structure } from '../core/structure.js';

export class House extends Structure {
    constructor(x, y) {
        super(x, y);
        this.size = { width: 150, height: 150 };
        this.image.src = '/src/assets/images/house.png';
    }
}
