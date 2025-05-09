import { LevelSystem } from './LevelSystem.js';

export class NPC {
    constructor(x, y, name) {
        this.position = { x, y };
        this.gridPosition = { x: 0, y: 0 };
        this.targetPosition = null;
        this.name = name;
        this.color = '#FFD700';
        this.size = 20;
        this.speed = 0.8;
        this.isMoving = false;
        this.direction = { x: 0, y: 0 };
        this.waitTime = 0;
        this.house = null;
        this.state = 'idle'; // idle, walking, visiting
        this.lastStateChange = Date.now();
        this.levelSystem = new LevelSystem();
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
        // Otimizar verificação de tempo
        const currentTime = Date.now();
        const timeSinceLastChange = currentTime - this.lastStateChange;

        // Cache de posição atual
        const currentPos = {
            x: this.position.x,
            y: this.position.y
        };

        switch (this.state) {
            case 'idle':
                if (timeSinceLastChange > 3000) { // Wait 3 seconds
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
                        // Ganhar XP ao se mover
                        this.levelSystem.addXP(0.1);
                    }
                }
                break;
        }
    }

    showDetailsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${this.name}</h2>
                <div class="npc-details">
                    <p>Level: ${this.levelSystem.level}</p>
                    <p>XP: ${Math.floor(this.levelSystem.xp)} / ${Math.floor(this.levelSystem.xpToNextLevel)}</p>
                    <div class="xp-bar">
                        <div class="xp-progress" style="width: ${this.levelSystem.getProgress()}%"></div>
                    </div>
                </div>
                <button class="button" onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    draw(ctx, centerX, centerY, scale) {
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

        // Draw name and level
        ctx.font = '12px Arial';
        ctx.fillStyle = '#FFF';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.name} (Lvl ${this.levelSystem.level})`, centerX/scale + this.position.x, centerY/scale + this.position.y - this.size);

        // Draw XP bar
        const barWidth = 30;
        const barHeight = 4;
        const progress = this.levelSystem.getProgress();

        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(centerX/scale + this.position.x - barWidth/2, centerY/scale + this.position.y - this.size + 5, barWidth, barHeight);

        // Progress
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(centerX/scale + this.position.x - barWidth/2, centerY/scale + this.position.y - this.size + 5, barWidth * (progress/100), barHeight);
    }
}