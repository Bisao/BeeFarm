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
        const currentTime = performance.now();
        const processingQueue = this.eventQueue.filter(event => 
            !event.expireTime || currentTime < event.expireTime
        );
        this.eventQueue = [];
        
        for (const {event, data} of processingQueue) {
            try {
                this.emit(event, data);
            } catch (error) {
                console.error(`Error processing event ${event}:`, error);
            }
        }
        
        this.isProcessing = false;
    }

    emit(event, data) {
        const callbacks = this.events.get(event);
        if (!callbacks) return;
        
        for (const callback of callbacks) {
            try {
                if (callback.active !== false) {
                    callback(data);
                }
            } catch (error) {
                console.error(`Error in event ${event}:`, error);
                callback.active = false;
            }
        }
        
        // Limpar callbacks inativos
        this.events.set(event, callbacks.filter(cb => cb.active !== false));
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