export default function Inventory(owner) {

    this.owner = owner;

    this.limit = Inventory.LIMIT;

    this.count = 0;

    this.inventory = {};

}

Inventory.constructor = Inventory;

Inventory.prototype.isFull = function() {

    return this.count >= this.limit;

}

Inventory.prototype.has = function(type) {

    return this.inventory[type] && this.inventory[type] > 0;

}

Inventory.prototype.add = function(type, count) {

    if (!this.inventory[type]) {

        this.inventory[type] = 0;

    }

    this.inventory[type] += count;

    this.count += count;

    if (Inventory.VERBOSE) {

        console.log('Inventory.add(', this.count, '/',this.limit, ')');

    }

}


Inventory.prototype.remove = function(type, count) {

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


Inventory.prototype.free = function() {

    return this.limit - this.count;

}

Inventory.LIMIT = 20;
Inventory.VERBOSE = false;
