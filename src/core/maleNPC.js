
export class MaleNPC {
    constructor(x, y) {
        this.position = { x, y };
        this.gridPosition = { x: 0, y: 0 };
        this.targetPosition = null;
        this.color = '#4169E1';
        this.size = 20;
        this.maxSpeed = 1.2;
        this.currentSpeed = 0;
        this.acceleration = 0.05;
        this.deceleration = 0.08;
        this.isMoving = false;
        this.direction = { x: 0, y: 0 };
        this.waitTime = 0;
        this.house = null;
        this.state = 'idle';
        this.lastStateChange = Date.now();
        this.wobble = { x: 0, y: 0 };
    }

    updateGridPosition(x, y) {
        this.gridPosition.x = x;
        this.gridPosition.y = y;
        this.position.x = (x - y) * 50 / 2;
        this.position.y = (x + y) * 50 / 4;
    }

    setRandomTarget(gridWidth, gridHeight) {
        const direction = Math.floor(Math.random() * 4);
        let targetX = this.gridPosition.x;
        let targetY = this.gridPosition.y;
        
        const steps = Math.floor(Math.random() * 2) + 1;
        
        switch(direction) {
            case 0:
                targetX = Math.min(this.gridPosition.x + steps, gridWidth - 1);
                targetY = Math.max(this.gridPosition.y - steps, 0);
                break;
            case 1:
                targetX = Math.max(this.gridPosition.x - steps, 0);
                targetY = Math.max(this.gridPosition.y - steps, 0);
                break;
            case 2:
                targetX = Math.max(this.gridPosition.x - steps, 0);
                targetY = Math.min(this.gridPosition.y + steps, gridHeight - 1);
                break;
            case 3:
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

    update(gridWidth, gridHeight) {
        const currentTime = Date.now();
        const timeSinceLastState = currentTime - this.lastStateChange;

        switch (this.state) {
            case 'idle':
                if (timeSinceLastState > 3000) {
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

                    if (distanceToTarget < this.currentSpeed) {
                        this.position.x = this.targetPosition.x;
                        this.position.y = this.targetPosition.y;
                        this.isMoving = false;
                        this.state = 'idle';
                        this.currentSpeed = 0;
                        this.lastStateChange = currentTime;
                    } else {
                        if (distanceToTarget > this.maxSpeed * 10) {
                            this.currentSpeed = Math.min(this.currentSpeed + this.acceleration, this.maxSpeed);
                        } else {
                            this.currentSpeed = Math.max(this.currentSpeed - this.deceleration, this.maxSpeed * 0.3);
                        }
                        
                        this.wobble.x = (Math.random() - 0.5) * 0.2;
                        this.wobble.y = (Math.random() - 0.5) * 0.2;
                        
                        this.position.x += (this.direction.x + this.wobble.x) * this.currentSpeed;
                        this.position.y += (this.direction.y + this.wobble.y) * this.currentSpeed;
                    }
                }
                break;
        }
    }

    draw(ctx, centerX, centerY, scale) {
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
