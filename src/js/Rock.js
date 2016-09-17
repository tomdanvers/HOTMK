import PIXI from 'pixi.js';
import ValueMinMax from './utils/value-min-max';

export default function Rock() {

    PIXI.Container.call(this);

    this.type = Rock.TYPE;

    this.supply = new ValueMinMax(0, Rock.SUPPLY, 0);

    let base = new PIXI.Graphics();
    base.beginFill(0x555555);
    base.drawRect(- Rock.WIDTH * .5, - Rock.HEIGHT, Rock.WIDTH, Rock.HEIGHT);
    base.endFill();

    this.addChild(base)

}

Rock.constructor = Rock;
Rock.prototype = Object.create(PIXI.Container.prototype);

Rock.prototype.update = function(timeDelta, world) {

    this.visible = !this.supply.isMin();

}

Rock.prototype.hit = function() {

    // this.quiverValue = 100;

}

Rock.WIDTH = 10;
Rock.HEIGHT = 10;

Rock.TYPE = 'rock';
Rock.SUPPLY = 250;
