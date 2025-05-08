
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
        this.state = 'idle'; // idle, walking, visiting
        this.lastStateChange = Date.now();
        this.visitedCells = new Set();
        this.lastDirections = [];
    }

    updateGridPosition(x, y) {
        this.gridPosition.x = x;
        this.gridPosition.y = y;
        this.position.x = (x - y) * 50 / 2;
        this.position.y = (x + y) * 50 / 4;
    }

    setRandomTarget(gridWidth, gridHeight) {
        const currentKey = `${this.gridPosition.x},${this.gridPosition.y}`;
        this.visitedCells.add(currentKey);

        // Define possible directions
        const directions = [
            {dx: 1, dy: 0}, // right
            {dx: 0, dy: -1}, // up
            {dx: -1, dy: 0}, // left
            {dx: 0, dy: 1}  // down
        ];

        // Filter valid moves and score them
        const possibleMoves = directions
            .map(dir => {
                const newX = this.gridPosition.x + dir.dx;
                const newY = this.gridPosition.y + dir.dy;
                const key = `${newX},${newY}`;
                const isVisited = this.visitedCells.has(key);
                
                return {
                    x: newX,
                    y: newY,
                    score: isVisited ? 1 : 3,
                    isValid: newX >= 0 && newX < gridWidth && newY >= 0 && newY < gridHeight
                };
            })
            .filter(move => move.isValid);

        // Choose best move
        if (possibleMoves.length > 0) {
            const bestMove = possibleMoves.reduce((best, current) => 
                current.score > best.score ? current : best
            );
            
            this.moveToGrid(bestMove.x, bestMove.y);
        }
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
