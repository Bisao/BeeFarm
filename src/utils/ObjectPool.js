
export class ObjectPool {
    constructor(createFn, maxSize = 100) {
        this.pool = [];
        this.createFn = createFn;
        this.maxSize = maxSize;
    }

    acquire() {
        return this.pool.pop() || this.createFn();
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
