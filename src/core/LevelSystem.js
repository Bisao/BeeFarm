
export class LevelSystem {
    constructor() {
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
    }

    addXP(amount) {
        this.xp += amount;
        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.xp = 0;
        this.xpToNextLevel *= 1.5;
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

    getProgress() {
        return (this.xp / this.xpToNextLevel) * 100;
    }
}
