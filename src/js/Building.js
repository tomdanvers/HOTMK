import PIXI from 'pixi.js';

import Dwarf from './Dwarf';
import DwarfRoles from './DwarfRoles';
import ValueMinMax from './utils/value-min-max';

export function Building(world) {

    PIXI.Container.call(this);

    this.world = world;

    this.integrity = new ValueMinMax(0, Building.INTEGRITY, Building.INTEGRITY * .25);

    this.isConstructed = this.integrity.isMax();

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

    this.alpha = this.integrity.val();

    // if (this.timeSinceSpawn > Building.SPAWN_RATE) {

    //  this.spawn(false);

    // }

}

Building.prototype.onDown = function(event) {

    // if (this.isConstructed) {

    //     this.spawn(true);

    // }

}

Building.prototype.spawn = function(isPurchased) {

    if (this.timeSinceSpawn > Building.SPAWN_RATE && this.constructed) {

        this.timeSinceSpawn = 0;

        if (isPurchased) {

            this.world.buyDwarf(this.position.x + Math.random() * 3, this.position.y + Math.random() * 3, this.associatedRole);

        } else {

            this.world.addDwarf(this.position.x + Math.random() * 3, this.position.y + Math.random() * 3, this.associatedRole);

        }

    }

}

Building.prototype.constructed = function() {

    this.isConstructed = true;

    if (this.associatedRole) {

        // Add dwarf with associated role

        this.world.addDwarf(this.position.x + Math.random() * 3, this.position.y + Math.random() * 3, this.associatedRole);

    }

    this.onConstructed();

}

Building.prototype.onConstructed = function() {

    // Stub to override


}

Building.WIDTH = 14;
Building.HEIGHT = 18;

Building.SPAWN_RATE = 3000;

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
