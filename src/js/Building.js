import PIXI from 'pixi.js';

import Dwarf from './Dwarf';
import DwarfRoles from './DwarfRoles';

export function Building(world) {

    PIXI.Container.call(this);

    this.world = world;

    this.integrityMax = Building.INTEGRITY;
    this.integrity = Building.INTEGRITY * .25;

    this.constructed = false;

    this.timeSinceSpawn = Building.SPAWN_RATE;

    let base = new PIXI.Graphics();
    this.draw(base);
    this.addChild(base);

    this.interactive = true;
    this.on('mousedown', this.onDown);
    this.on('touchstart', this.onDown);


}

Building.constructor = Building;
Building.prototype = Object.create(PIXI.Container.prototype);

Building.prototype.draw = function(graphics) {

    graphics.beginFill(0xAAAAAA);
    graphics.drawRect(- Building.WIDTH * .5, - Building.HEIGHT, Building.WIDTH, Building.HEIGHT);
    graphics.endFill();
    graphics.beginFill(0x666666);
    graphics.drawRect(- Building.WIDTH * .5 + 4, -10, Building.WIDTH - 8, 10);
    graphics.endFill();

}

Building.prototype.update = function(timeDelta) {

    this.timeSinceSpawn += timeDelta;

    this.alpha = this.integrity / this.integrityMax;

    // if (this.timeSinceSpawn > Building.SPAWN_RATE) {

    //  this.spawn();

    // }

}

Building.prototype.onDown = function(event) {

    if (this.constructed) {

        this.spawn();

    }

}

Building.prototype.spawn = function() {

    if (this.timeSinceSpawn > Building.SPAWN_RATE) {

        console.log('Building.spawn()');

        this.timeSinceSpawn = 0;

        this.world.buyDwarf(this.position.x + Math.random() * 3, this.position.y + Math.random() * 3, this.associatedRole);

    }

}

Building.WIDTH = 14;
Building.HEIGHT = 18;

Building.SPAWN_RATE = 5000;

Building.INTEGRITY = 100;
Building.TYPE = 'building';





/* -------------- */
/* -------- Miner */
/* -------------- */

export function Miner(world) {

    Building.call(this, world);

    this.associatedRole = DwarfRoles.COLLECT_STONE;

}

Miner.constructor = Miner;
Miner.prototype = Object.create(Building.prototype);

Miner.prototype.draw = function(graphics) {

    graphics.beginFill(0x999999);
    graphics.drawRect(- Miner.WIDTH * .5, - Miner.HEIGHT, Miner.WIDTH, Miner.HEIGHT);
    graphics.endFill();
    graphics.beginFill(0x222222);
    graphics.drawRect(- Miner.WIDTH * .5 + 4, -6, Miner.WIDTH - 8, 6);
    graphics.endFill();

}

Miner.WIDTH = 12;
Miner.HEIGHT = 12;




/* -------------- */
/* ----- Forester */
/* -------------- */

export function Forester(world) {

    Building.call(this, world);

    this.associatedRole = DwarfRoles.COLLECT_WOOD;

}

Forester.constructor = Forester;
Forester.prototype = Object.create(Building.prototype);

Forester.prototype.draw = function(graphics) {

    graphics.beginFill(0x999999);
    graphics.drawRect(- Forester.WIDTH * .5, - Forester.HEIGHT, Forester.WIDTH, Forester.HEIGHT);
    graphics.endFill();
    graphics.beginFill(0x228822);
    graphics.drawRect(- Forester.WIDTH * .5 + 4, -6, Forester.WIDTH - 8, 6);
    graphics.endFill();

}

Forester.WIDTH = 12;
Forester.HEIGHT = 12;




/* -------------- */
/* -------- Mason */
/* -------------- */

export function Mason(world) {

    Building.call(this, world);

    this.associatedRole = DwarfRoles.BUILDER;

}

Mason.constructor = Mason;
Mason.prototype = Object.create(Building.prototype);

Mason.prototype.draw = function(graphics) {

    graphics.beginFill(0x999999);
    graphics.drawRect(- Mason.WIDTH * .5, - Mason.HEIGHT, Mason.WIDTH, Mason.HEIGHT);
    graphics.endFill();
    graphics.beginFill(0x333333);
    graphics.drawRect(- Mason.WIDTH * .5 + 4, -6, Mason.WIDTH - 8, 6);
    graphics.endFill();

}

Mason.WIDTH = 13;
Mason.HEIGHT = 14;
