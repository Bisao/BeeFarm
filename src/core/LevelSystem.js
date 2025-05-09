
class LevelSystem {
    constructor() {
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.baseXP = 100;
        this.multiplier = 1.5;
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
        this.xpToNextLevel = Math.floor(this.baseXP * Math.pow(this.multiplier, this.level - 1));
    }

    getProgress() {
        return (this.xp / this.xpToNextLevel) * 100;
    }

    getLevel() {
        return this.level;
    }

    getXP() {
        return this.xp;
    }

    getXPToNextLevel() {
        return this.xpToNextLevel;
    }
}

export { LevelSystem };
