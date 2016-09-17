import PIXI from 'pixi.js';
import ValueMinMax from './utils/value-min-max';

import Tile from './Tile';

export default function Tree() {

    PIXI.Container.call(this);

    this.type = Tree.TYPE;

    this.supply = new ValueMinMax(0, Tree.SUPPLY, 0);

    let base = new PIXI.Graphics();

    base.beginFill(0x613917);
    base.drawRect(-1,0,2,3);
    base.endFill();

    base.beginFill(0x004400);
    base.moveTo(0, - Tree.HEIGHT);
    base.lineTo(- Tree.WIDTH * .5, 0);
    base.lineTo(Tree.WIDTH * .5, 0);
    base.lineTo(0, - Tree.HEIGHT);
    base.endFill();

    this.addChild(base)

}

Tree.constructor = Tree;
Tree.prototype = Object.create(PIXI.Container.prototype);

Tree.prototype.update = function(timeDelta, world) {

    // this.alpha = this.supply / this.supplyMax;

    this.visible = !this.supply.isMin();

    if (this.quiverValue > 0) {

        this.quiverValue -= timeDelta * .3;

    } else {

        this.quiverValue = 0;

    }

    this.rotation = 0 + Math.sin(this.quiverValue * .15) * Math.PI * 0.05;

}

Tree.prototype.hit = function() {

    this.quiverValue = 100;

}

Tree.WIDTH = 12;
Tree.HEIGHT = 24;

Tree.TYPE = 'tree';
Tree.SUPPLY = 100;
