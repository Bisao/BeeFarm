
import { NPC } from './npc.js';

export class FemaleNPC extends NPC {
    constructor(x, y) {
        super(x, y);
        this.color = '#FF69B4'; // Hot Pink
        this.size = 20;
        this.speed = 0.85;
        this.gender = 'female';
    }
}
