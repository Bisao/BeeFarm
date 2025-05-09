export class EventManager {
    constructor() {
        this.events = new Map();
        this.eventQueue = [];
        this.isProcessing = false;
    }

    subscribe(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);
    }

    processEventQueue() {
        if (this.isProcessing || this.eventQueue.length === 0) return;

        this.isProcessing = true;
        while (this.eventQueue.length > 0) {
            const {event, data} = this.eventQueue.shift();
            this.emit(event, data);
        }
        this.isProcessing = false;
    }

    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => callback(data));
        }
    }

    off(event, callback) {
        if (this.events.has(event)) {
            this.events.set(
                event,
                [...this.events.get(event)].filter(cb => cb !== callback)
            );
        }
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
    }
}