export class ArrayUtils extends Array {
    constructor() {
        super();
    }

    remove_an_item(index) {
        let i = this.indexOf(index);
        return this.splice(i, 1)
    }
}
