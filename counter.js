class Counter {
    static lookup = {};

    constructor(id) {
        this.value = 1;
        Counter.lookup[id] = this; // every counter we create is added to the lookup hash map which we can access at Counter.lookup
    }

    inc() {
        this.value += 1;
        return this.value.toString();
    }
}

module.exports = {Counter};