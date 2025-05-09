export class LevelSystem {
    constructor() {
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.xpMultiplier = 1.5;
    }

    addXP(amount) {
        this.xp += amount;
        while (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel *= this.xpMultiplier;
    }

    getProgress() {
        return (this.xp / this.xpToNextLevel) * 100;
    }
}