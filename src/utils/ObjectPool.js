
export class ObjectPool {
    constructor(createFn, maxSize = 100) {
        this.pool = [];
        this.createFn = createFn;
        this.maxSize = maxSize;
    }

    acquire() {
        let obj = this.pool.pop();
        if (!obj) {
            obj = this.createFn();
            obj.pooled = true;
            obj.lastUsed = Date.now();
        }
        return obj;
    }

    clean() {
        const now = Date.now();
        this.pool = this.pool.filter(obj => now - obj.lastUsed < 30000);
    }

    release(object) {
        if (this.pool.length < this.maxSize) {
            object.reset?.();
            this.pool.push(object);
        }
    }

    clear() {
        this.pool = [];
    }
}
