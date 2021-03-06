import * as PIXI from 'pixi.js';
import ValueMinMax from './utils/ValueMinMax';

import Tile from './Tile';

export default class Tree extends PIXI.Container {

    constructor() {

        super();

        this.type = Tree.TYPE;

        this.supply = new ValueMinMax(0, Tree.SUPPLY, 0);

        this.addChild(this.draw());

    }

    draw() {

        let base = new PIXI.Graphics();

        base.beginFill(0x613917);
        base.drawRect(-1,-2,2,3);
        base.endFill();

        base.beginFill(0x004400);
        base.moveTo(0, - Tree.HEIGHT-2);
        base.lineTo(- Tree.WIDTH * .5, -2);
        base.lineTo(Tree.WIDTH * .5, -2);
        base.lineTo(0, - Tree.HEIGHT-2);
        base.endFill();

        return base;

    }

    update(timeDelta, world) {

        // this.alpha = this.supply / this.supplyMax;

        this.visible = !this.supply.isMin();

        if (this.quiverValue > 0) {

            this.quiverValue -= timeDelta * .3;

        } else {

            this.quiverValue = 0;

        }

        this.rotation = 0 + Math.sin(this.quiverValue * .15) * Math.PI * 0.05;

    }

}

Tree.prototype.hit = function() {

    this.quiverValue = 100;

}

Tree.WIDTH = 12;
Tree.HEIGHT = 24;

Tree.TYPE = 'tree';
Tree.SUPPLY = 100;

export class TreeConifer extends Tree {

    draw() {

        let r = Math.floor(Math.random() * 3);

        let base = new PIXI.Sprite(PIXI.Texture.fromImage(`img/tree-conifer-${r}.png`));
        base.x = -6;
        base.y = -28;
        return base;

    }

}

export class TreeDeciduous extends Tree {

    draw() {

        let r = Math.floor(Math.random() * 3);

        let base = new PIXI.Sprite(PIXI.Texture.fromImage(`img/tree-deciduous-${r}.png`));
        base.x = -10;
        base.y = -25;
        return base;

    }

}
