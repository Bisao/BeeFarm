import { NPC } from './npc.js';
import { MALE_NPC_ANIMATIONS } from './animations.js';

export class MaleNPC extends NPC {
    constructor(x, y) {
        super(x, y);
        this.sprites = {
            walkDown: [],
            walkUp: [],
            walkLeft: [],
            walkRight: []
        };
        this.currentAnimation = 'walkDown';
        this.frame = 0;
        this.animationSpeed = MALE_NPC_ANIMATIONS[this.currentAnimation].speed;
        this.lastFrameTime = 0;
        this.moving = false;
        this.speed = 1;
        this.lastDirection = 'down';
        this.loadSprites();
    }

    move(direction) {
        this.moving = true;
        this.lastDirection = direction;
        let newX = this.gridPosition.x;
        let newY = this.gridPosition.y;

        switch(direction) {
            case 'up':
                this.currentAnimation = 'walkUp';
                newY = Math.max(0, Math.round(this.gridPosition.y - this.speed));
                break;
            case 'down':
                this.currentAnimation = 'walkDown';
                newY = Math.min(9, Math.round(this.gridPosition.y + this.speed));
                break;
            case 'left':
                this.currentAnimation = 'walkLeft';
                newX = Math.max(0, Math.round(this.gridPosition.x - this.speed));
                break;
            case 'right':
                this.currentAnimation = 'walkRight';
                newX = Math.min(9, Math.round(this.gridPosition.x + this.speed));
                break;
        }

        // Update grid position
        this.gridPosition.x = newX;
        this.gridPosition.y = newY;

        // Update isometric position
        this.position.x = (this.gridPosition.x - this.gridPosition.y) * 50 / 2;
        this.position.y = (this.gridPosition.x + this.gridPosition.y) * 50 / 4;
    }

    stopMoving() {
        this.moving = false;
        // Snap to nearest grid position
        this.gridPosition.x = Math.round(this.gridPosition.x);
        this.gridPosition.y = Math.round(this.gridPosition.y);
        this.position.x = (this.gridPosition.x - this.gridPosition.y) * 50 / 2;
        this.position.y = (this.gridPosition.x + this.gridPosition.y) * 50 / 4;
        
        // Reset frame when stopping
        this.frame = 0;
        this.currentAnimation = `walk${this.lastDirection.charAt(0).toUpperCase() + this.lastDirection.slice(1)}`;
    }

    loadSprites() {
        Object.entries(MALE_NPC_ANIMATIONS).forEach(([animName, config]) => {
            for(let i = 0; i < config.frames; i++) {
                const img = new Image();
                img.src = `${config.path}${i}_delay-0.1s.gif`;
                this.sprites[animName].push(img);
            }
        });
    }

    draw(ctx, centerX, centerY, scale) {
        const now = performance.now();
        const config = MALE_NPC_ANIMATIONS[this.currentAnimation];

        if (now - this.lastFrameTime > config.speed) {
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