import PIXI from 'pixi.js';
import ValueMinMax from './utils/ValueMinMax';

export default class Rock extends PIXI.Container {

    constructor() {

        super();

        this.type = Rock.TYPE;

        this.supply = new ValueMinMax(0, Rock.SUPPLY, 0);

        let r = Math.floor(Math.random() * 3);

        let base = new PIXI.Sprite(PIXI.Texture.fromImage(`img/rock-${r}.png`));
        base.x = -5;
        base.y = -10;
        this.addChild(base);

    }

    update(timeDelta, world) {

        this.visible = !this.supply.isMin();

    }

    hit() {

        // this.quiverValue = 100;

    }

}

Rock.WIDTH = 10;
Rock.HEIGHT = 10;

Rock.TYPE = 'rock';
Rock.SUPPLY = 250;
