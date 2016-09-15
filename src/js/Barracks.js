import PIXI from 'pixi.js';

import Dwarf from './Dwarf';

export default function Barracks(world) {

    PIXI.Container.call(this);

    this.world = world;

    this.integrityMax = Barracks.INTEGRITY;
    this.integrity = Barracks.INTEGRITY * .25;

    this.constructed = false;

    this.timeSinceSpawn = Barracks.SPAWN_RATE;

    let base = new PIXI.Graphics();
    base.beginFill(0xAAAAAA);
    base.drawRect(- Barracks.WIDTH * .5, - Barracks.HEIGHT, Barracks.WIDTH, Barracks.HEIGHT);
    base.endFill();
    base.beginFill(0x666666);
    base.drawRect(- Barracks.WIDTH * .5 + 4, -10, Barracks.WIDTH - 8, 10);
    base.endFill();

    this.interactive = true;
    this.on('mousedown', this.onDown);
    this.on('touchstart', this.onDown);

    this.addChild(base)

}

Barracks.constructor = Barracks;
Barracks.prototype = Object.create(PIXI.Container.prototype);

Barracks.prototype.update = function(timeDelta) {

    this.timeSinceSpawn += timeDelta;

    this.alpha = this.integrity / this.integrityMax;

    // if (this.timeSinceSpawn > Barracks.SPAWN_RATE) {

    //  this.spawn();

    // }

}

Barracks.prototype.onDown = function(event) {

    if (this.constructed) {

        this.spawn();

    }

}

Barracks.prototype.spawn = function() {

    if (this.timeSinceSpawn > Barracks.SPAWN_RATE) {

        console.log('Barracks.spawn()');

        this.timeSinceSpawn = 0;

        this.world.addDwarf(this.position.x + Math.random() * 3, this.position.y + Math.random() * 3, Math.random() > .3 ? Dwarf.ROLE_COLLECT_WOOD : Dwarf.ROLE_COLLECT_STONE);

    }

}

Barracks.WIDTH = 14;
Barracks.HEIGHT = 18;

Barracks.SPAWN_RATE = 5000;

Barracks.INTEGRITY = 100;
Barracks.TYPE = 'building';
