import PIXI from 'pixi.js';

export default function Supply() {

    this.wood = 250
    this.woodOld = 0;
    this.stone = 150
    this.stoneOld = 0;

    return this;

}

Supply.prototype.update = function(timeDelta, world) {

    let dirty = false;

    if (this.wood !== this.woodOld) {

        this.woodOld = this.wood;

        dirty = true;


    }

    if (this.stone !== this.stoneOld) {

        this.stoneOld = this.stone;

        dirty = true;

    }

    if (dirty) {

        world.ui.supply.update(this.wood, this.stone);

        world.ui.building.update(this.wood, this.stone);

    }

}
