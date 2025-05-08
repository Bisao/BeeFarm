
import { NPC } from './npc.js';

export class MaleNPC extends NPC {
    constructor(x, y) {
        super(x, y);
        this.color = '#4169E1'; // Royal Blue
        this.size = 22; // Slightly larger
        this.speed = 0.9; // Slightly faster
        this.gender = 'male';
    }
}

export class FemaleNPC extends NPC {
    constructor(x, y) {
        super(x, y);
        this.color = '#FF69B4'; // Hot Pink
        this.size = 20;
        this.speed = 0.85;
        this.gender = 'female';
    }
}
