
export class EventManager {
    constructor() {
        this.events = new Map();
        this.eventQueue = [];
        this.isProcessing = false;
        this.gcInterval = 60000; // 60 seconds
        this.lastGC = performance.now();
    }

    subscribe(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);
        return () => this.off(event, callback);
    }

    processEventQueue() {
        if (this.isProcessing || this.eventQueue.length === 0) return;

        this.isProcessing = true;
        const currentTime = performance.now();
        
        // Process garbage collection
        if (currentTime - this.lastGC > this.gcInterval) {
            this.cleanupInactiveCallbacks();
            this.lastGC = currentTime;
        }

        // Process events in batches
        const batchSize = Math.min(50, this.eventQueue.length);
        const batch = this.eventQueue.splice(0, batchSize);

        for (const event of batch) {
            if (!event.expireTime || currentTime < event.expireTime) {
                this.emit(event.event, event.data);
            }
        }

        this.isProcessing = false;
        
        // Process remaining queue if needed
        if (this.eventQueue.length > 0) {
            requestAnimationFrame(() => this.processEventQueue());
        }
    }

    emit(event, data) {
        const callbacks = this.events.get(event);
        if (!callbacks) return;

        for (const callback of callbacks) {
            if (callback.active !== false) {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event ${event}:`, error);
                    callback.active = false;
                }
            }
        }
    }

    cleanupInactiveCallbacks() {
        for (const [event, callbacks] of this.events.entries()) {
            const activeCallbacks = new Set(
                Array.from(callbacks).filter(cb => cb.active !== false)
            );
            if (activeCallbacks.size === 0) {
                this.events.delete(event);
            } else {
                this.events.set(event, activeCallbacks);
            }
        }
    }

    off(event, callback) {
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.events.delete(event);
            }
        }
    }
}
