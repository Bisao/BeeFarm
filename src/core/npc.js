
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

    findNearestTree(trees) {
        let nearestTree = null;
        let minDistance = Infinity;

        for (const tree of trees) {
            const dx = tree.x - this.gridPosition.x;
            const dy = tree.y - this.gridPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance) {
                minDistance = distance;
                nearestTree = tree;
            }
        }

        return nearestTree;
    }

    update(gridWidth, gridHeight, trees = [], woodcuttingSystem) {
        const currentTime = Date.now();
        const timeSinceLastState = currentTime - this.lastStateChange;

        switch (this.state) {
            case 'idle':
                // Procurar árvore mais próxima
                const nearestTree = this.findNearestTree(trees);
                if (nearestTree) {
                    this.state = 'walking';
                    this.lastStateChange = currentTime;
                    this.moveToGrid(nearestTree.x, nearestTree.y);
                    this.targetTree = nearestTree;
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
                        
                        // Começar a cortar se chegou na árvore
                        if (this.targetTree) {
                            woodcuttingSystem.startCuttingTree(this, this.targetTree);
                        } else {
                            this.state = 'idle';
                        }
                        this.lastStateChange = currentTime;
                    } else {
                        this.position.x += this.direction.x * this.speed;
                        this.position.y += this.direction.y * this.speed;
                    }
                }
                break;

            case 'woodcutting':
                // O WoodcuttingSystem gerencia o tempo e conclusão do corte
                break;
        }
    }

    draw(ctx, centerX, centerY, scale) {
        // Mostrar ícone de machado e barra de progresso quando estiver cortando
        if (this.state === 'woodcutting') {
            // Desenhar ícone do machado
            ctx.fillStyle = '#8B4513';
            ctx.font = '12px Arial';
            ctx.fillText('🪓', 
                centerX/scale + this.position.x + 10, 
                centerY/scale + this.position.y - 10
            );
            
            // Calcular progresso
            const currentTime = Date.now();
            const progress = Math.min((currentTime - this.lastStateChange) / 5000, 1);
            
            // Desenhar barra de progresso
            const barWidth = 30;
            const barHeight = 5;
            const barX = centerX/scale + this.position.x - barWidth/2;
            const barY = centerY/scale + this.position.y - 25;
            
            // Fundo da barra
            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Progresso
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(barX, barY, barWidth * progress, barHeight);
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
