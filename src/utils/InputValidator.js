
export class InputValidator {
    static validateGridPosition(x, y, gridWidth, gridHeight) {
        return x >= 0 && x < gridWidth && y >= 0 && y < gridHeight;
    }

    static validateStructurePlacement(position, structures, gridSize) {
        return !structures.some(s => 
            Math.abs(s.position.x - position.x) < gridSize &&
            Math.abs(s.position.y - position.y) < gridSize
        );
    }

    static showFeedback(message, type = 'info') {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${type}`;
        feedback.textContent = message;
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => feedback.remove(), 500);
        }, 2000);
    }
}
