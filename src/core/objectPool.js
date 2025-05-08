
export class ObjectPool {
    constructor(createFn) {
        this.createFn = createFn;
        this.pool = [];
        this.active = new Set();
    }

    get() {
        let obj = this.pool.pop() || this.createFn();
        this.active.add(obj);
        return obj;
    }

    release(obj) {
        if (this.active.delete(obj)) {
            this.pool.push(obj);
        }
    }

    releaseAll() {
        this.active.forEach(obj => {
            this.pool.push(obj);
        });
        this.active.clear();
    }
}
