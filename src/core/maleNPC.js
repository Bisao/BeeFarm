
import { NPC } from './npc.js';

export class MaleNPC extends NPC {
    constructor(x, y) {
        super(x, y);
        this.sprites = {
            walkDown: [],
            walkUp: []
        };
        this.currentAnimation = 'walkDown';
        this.frame = 0;
        this.animationSpeed = 100; // ms per frame
        this.lastFrameTime = 0;
        this.loadSprites();
    }

    loadSprites() {
        // Load walk down animation
        for(let i = 0; i < 8; i++) {
            const img = new Image();
            img.src = `/attached_assets/citizen-male-caminhando-baixo-gif_${i}_delay-0.1s.gif`;
            this.sprites.walkDown.push(img);
        }
        
        // Load walk up animation
        for(let i = 0; i < 8; i++) {
            const img = new Image();
            img.src = `/attached_assets/citizen-male-caminhando-cima-gif_${i}_delay-0.1s.gif`;
            this.sprites.walkUp.push(img);
        }
    }

    draw(ctx, centerX, centerY, scale) {
        const now = performance.now();
        if (now - this.lastFrameTime > this.animationSpeed) {
            this.frame = (this.frame + 1) % this.sprites[this.currentAnimation].length;
            this.lastFrameTime = now;
        }

        const sprite = this.sprites[this.currentAnimation][this.frame];
        if (sprite.complete) {
            ctx.drawImage(
                sprite,
                centerX/scale + this.position.x - 20,
                centerY/scale + this.position.y - 20,
                40,
                40
            );
        }
    }
}
