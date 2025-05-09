
export class GameState {
    constructor() {
        this.state = {
            player: null,
            resources: {},
            structures: [],
            npcs: [],
            settings: {}
        };
        this.listeners = new Set();
    }

    update(partial) {
        this.state = { ...this.state, ...partial };
        this.notify();
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    save() {
        localStorage.setItem('gameState', JSON.stringify(this.state));
    }

    load() {
        const saved = localStorage.getItem('gameState');
        if (saved) {
            this.state = JSON.parse(saved);
            this.notify();
        }
    }
}
