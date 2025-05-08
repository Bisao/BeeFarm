
export class NPC {
    constructor(x, y) {
        this.position = { x, y };
        this.gridPosition = { x: 0, y: 0 };
        this.targetPosition = null;
        this.color = '#FFD700';
        this.size = 20;
        this.speed = 0.8;
        this.isMoving = false;
        this.direction = { x: 0, y: 0 };
        this.waitTime = 0;
        this.house = null;
        this.state = 'idle'; // idle, walking, visiting, woodcutting
        this.lastStateChange = Date.now();
        this.woodInventory = 0;
        this.currentTree = null;
    }

    startWoodcutting(tree) {
        this.state = 'woodcutting';
        this.currentTree = tree;
        this.lastStateChange = Date.now();
    }

    stopWoodcutting() {
        this.state = 'idle';
        this.currentTree = null;
        this.lastStateChange = Date.now();
    }

    addWoodToInventory() {
        this.woodInventory++;
    }

    updateGridPosition(x, y) {
        this.gridPosition.x = x;
        this.gridPosition.y = y;
        this.position.x = (x - y) * 50 / 2;
        this.position.y = (x + y) * 50 / 4;
    }

    setRandomTarget(gridWidth, gridHeight) {
        // Choose random diagonal direction: 0 = northeast, 1 = northwest, 2 = southwest, 3 = southeast
        const direction = Math.floor(Math.random() * 4);
        let targetX = this.gridPosition.x;
        let targetY = this.gridPosition.y;
        
        const steps = Math.floor(Math.random() * 2) + 1; // Move 1 or 2 steps diagonally
        
        switch(direction) {
            case 0: // northeast
                targetX = Math.min(this.gridPosition.x + steps, gridWidth - 1);
                targetY = Math.max(this.gridPosition.y - steps, 0);
                break;
            case 1: // northwest
                targetX = Math.max(this.gridPosition.x - steps, 0);
                targetY = Math.max(this.gridPosition.y - steps, 0);
                break;
            case 2: // southwest
                targetX = Math.max(this.gridPosition.x - steps, 0);
                targetY = Math.min(this.gridPosition.y + steps, gridHeight - 1);
                break;
            case 3: // southeast
                targetX = Math.min(this.gridPosition.x + steps, gridWidth - 1);
                targetY = Math.min(this.gridPosition.y + steps, gridHeight - 1);
                break;
        }
        
        this.moveToGrid(targetX, targetY);
    }

    moveToGrid(targetX, targetY) {
        this.targetPosition = {
            x: (targetX - targetY) * 50 / 2,
            y: (targetX + targetY) * 50 / 4
        };
        this.isMoving = true;
        
        const dx = this.targetPosition.x - this.position.x;
        const dy = this.targetPosition.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.direction = {
                x: dx / distance,
                y: dy / distance
            };
        }
    }

    moveToHouse() {
        if (this.house) {
            this.moveToGrid(this.house.gridPosition.x, this.house.gridPosition.y);
        }
    }

    update(gridWidth, gridHeight) {
        const currentTime = Date.now();
        const timeSinceLastState = currentTime - this.lastStateChange;

        switch (this.state) {
            case 'idle':
                if (timeSinceLastState > 3000) { // Wait 3 seconds
                    this.state = 'walking';
                    this.lastStateChange = currentTime;
                    this.setRandomTarget(gridWidth, gridHeight);
                }
                break;

            case 'walking':
                if (this.isMoving) {
                    const dx = this.targetPosition.x - this.position.x;
                    const dy = this.targetPosition.y - this.position.y;
                    const distanceToTarget = Math.sqrt(dx * dx + dy * dy);

                    if (distanceToTarget < this.speed) {
                        this.position.x = this.targetPosition.x;
                        this.position.y = this.targetPosition.y;
                        this.isMoving = false;
                        this.state = 'idle';
                        this.lastStateChange = currentTime;
                    } else {
                        this.position.x += this.direction.x * this.speed;
                        this.position.y += this.direction.y * this.speed;
                    }
                }
                break;
        }
    }

    draw(ctx, centerX, centerY, scale) {
        // Mostrar ícone de machado quando estiver cortando
        if (this.state === 'woodcutting') {
            ctx.fillStyle = '#8B4513';
            ctx.font = '12px Arial';
            ctx.fillText('🪓', 
                centerX/scale + this.position.x + 10, 
                centerY/scale + this.position.y - 10
            );
        }
        
        // Draw dotted path to target
        if (this.isMoving) {
            ctx.beginPath();
            ctx.moveTo(centerX/scale + this.position.x, centerY/scale + this.position.y);
            ctx.lineTo(centerX/scale + this.targetPosition.x, centerY/scale + this.targetPosition.y);
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.lineWidth = 1;
        }

        // Draw NPC
        ctx.beginPath();
        ctx.arc(
            centerX/scale + this.position.x,
            centerY/scale + this.position.y,
            this.size/2,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
    }
}
