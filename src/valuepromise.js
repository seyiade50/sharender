class ValuePromise extends Promise {
    constructor(executor, value) {
        // value should have toString() method and optionally .then, .catch or .finally methods
        super(executor);
        this.value = value;
    };
    toString() {return this.value.toString();};
    then(onfulfilled, onrejected) {
        return new ValuePromise(() => {
            super.then(onfulfilled, onrejected);    // .then(onfulfilled2, onrejected2);
        }, this.value?.then?.() || this.value);
    };
    catch(onrejected) {
        return new ValuePromise(() => {
            super.catch(onrejected);   // .then(onfulfilled2, onrejected2);
        }, this.value?.catch?.() || this.value);
    };
    finally(onresolved) {
        return new ValuePromise(() => {
            super.finally(onresolved);   // .then(onfulfilled2, onrejected2);
        }, this.value?.finally?.() || this.value);
    }
}
export default {ValuePromise}