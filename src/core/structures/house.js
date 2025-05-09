
import { Structure } from './baseStructure.js';
import { MaleNPC } from '../maleNPC.js';
import { FemaleNPC } from '../femaleNPC.js';
import { NameGenerator } from '../../utils/NameGenerator.js';

export class House extends Structure {
    constructor(x, y, type = 'lumberjack') {
        super(x, y);
        this.type = type;
        this.size = 80;
        this.image = new Image();
        this.direction = 'left';
        this.npc = null;
        this.updateImage();
        this.createNPC();
    }

    createNPC() {
        const gender = Math.random() < 0.5 ? 'male' : 'female';
        const name = NameGenerator.generateName(gender);
        
        if (gender === 'male') {
            this.npc = new MaleNPC(this.x, this.y);
        } else {
            this.npc = new FemaleNPC(this.x, this.y);
        }
        
        this.npc.name = name;
        // Posicionar NPC ligeiramente à frente da casa
        this.npc.updateGridPosition(this.x, this.y + 0.5);
        this.npc.house = this;
    }

    updateImage() {
        const imagePath = {
            'miner': `src/assets/images/structures/⛏️ MinerHouse${this.direction === 'left' ? 'Left' : 'Right'}.PNG`,
            'farmer': `src/assets/images/structures/🌱 FarmerHouse${this.direction === 'left' ? 'Left' : 'Right'}.PNG`,
            'fisherman': `src/assets/images/structures/🎣 FisherManHouse${this.direction === 'left' ? 'Left' : 'Right'}.PNG`,
            'lumberjack': `src/assets/images/structures/🪓 LumberJackHouse${this.direction === 'left' ? 'Left' : 'Right'}.PNG`
        };
        this.image.src = imagePath[this.type] || imagePath['lumberjack'];
    }

    draw(ctx, centerX, centerY, scale) {
        const isoX = (this.x - this.y) * 50 / 2;
        const isoY = (this.x + this.y) * 50 / 4;
        
        if (this.image.complete) {
            const houseWidth = 80;
            const houseHeight = 80;
            
            ctx.drawImage(
                this.image,
                centerX/scale + isoX - houseWidth/2,
                centerY/scale + isoY - houseHeight/2,
                houseWidth,
                houseHeight
            );
        }

        if (this.npc) {
            this.npc.draw(ctx, centerX, centerY, scale);
        }
    }
}
