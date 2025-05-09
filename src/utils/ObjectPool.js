
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
        let i = this.pool.length;
        while (i--) {
            if (now - this.pool[i].lastUsed >= 30000) {
                this.pool.splice(i, 1);
            }
        }
    }

    release(object) {
        if (this.pool.length < this.maxSize) {
            if (typeof object.reset === 'function') {
                object.reset();
            }
            object.lastUsed = Date.now();
            this.pool.push(object);
        } else {
            // Remove oldest object if pool is full
            const oldestIdx = this.pool.findIndex(obj => 
                obj.lastUsed === Math.min(...this.pool.map(o => o.lastUsed))
            );
            if (oldestIdx !== -1) {
                this.pool[oldestIdx] = object;
            }
        }
    }

    clear() {
        this.pool = [];
    }
}
