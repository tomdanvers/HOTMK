import PIXI from 'pixi.js';
import ValueMinMax from './utils/value-min-max';

export default function Supply() {

    this.wood = new ValueMinMax(0, 100000, Supply.WOOD);
    this.woodOld = 0;

    this.stone = new ValueMinMax(0, 100000, Supply.STONE);
    this.stoneOld = 0;

    return this;

}

Supply.prototype.update = function(timeDelta, world) {

    let dirty = false;

    if (this.wood.get() !== this.woodOld) {

        this.woodOld = this.wood.get();

        dirty = true;


    }

    if (this.stone.get() !== this.stoneOld) {

        this.stoneOld = this.stone.get();

        dirty = true;

    }

    if (dirty) {

        world.ui.updateSupply(this.wood.get(), this.stone.get());

    }

}

Supply.WOOD = 1000;//150;
Supply.STONE = 1000;//150;
