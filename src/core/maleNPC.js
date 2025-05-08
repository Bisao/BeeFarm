
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
