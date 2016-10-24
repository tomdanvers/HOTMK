export default class Inventory {

    constructor(owner) {

        this.owner = owner;

        this.limit = Inventory.LIMIT;

        this.count = 0;

        this.inventory = {};

    }

    isFull() {

        return this.count >= this.limit;

    }

    has(type) {

        return this.inventory[type] && this.inventory[type] > 0;

    }

    add(type, count) {

        if (!this.inventory[type]) {

            this.inventory[type] = 0;

        }

        this.inventory[type] += count;

        this.count += count;

        if (Inventory.VERBOSE) {

            console.log('Inventory.add(', this.count, '/',this.limit, ')');

        }

    }


    remove(type, count) {

        let amount;

        if (count === undefined) {

            amount = this.inventory[type] || 0;

            delete this.inventory[type];

        } else {

            amount = Math.min(this.inventory[type], count);

            this.inventory[type] = amount;

        }

        this.count -= amount;

        if (Inventory.VERBOSE) {

            console.log('Inventory.remove(', this.count, '/', this.limit, ')');

        }

        return amount;

    }


    free() {

        return this.limit - this.count;

    }

}

Inventory.LIMIT = 20;
Inventory.VERBOSE = false;
