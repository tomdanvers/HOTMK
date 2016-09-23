import PIXI from 'pixi.js';

import Dwarf from './Dwarf';
import DwarfRoles from './DwarfRoles';
import ValueMinMax from './utils/value-min-max';
import Maths from './utils/Maths';

export function Building(world, startX, startY, isTemp) {

    PIXI.Container.call(this);

    this.world = world;

    this.inhabitantCount = 1;

    this.integrity = new ValueMinMax(0, Building.INTEGRITY, Building.INTEGRITY * .25);

    this.isConstructed = this.integrity.isMax();

    this.timeSinceSpawn = Building.SPAWN_RATE;

    let base = new PIXI.Graphics();
    this.draw(base);
    this.addChild(base);

    this.lightRadius = 50;

    if (!isTemp) {

        this.light = this.world.lighting.addStatic(startX, startY, this.lightRadius, 0, -5);

    }

    this.x = startX;
    this.y = startY;

    // this.interactive = true;
    // this.on('mousedown', this.onDown);
    // this.on('touchstart', this.onDown);

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

    if (!this.isConstructed) {

        this.alpha = this.integrity.val();

    }

}

Building.prototype.onDown = function(event) {

}

Building.prototype.spawn = function(isPurchased) {

    //if (this.timeSinceSpawn > Building.SPAWN_RATE && this.isConstructed) {
    if (this.isConstructed) {

        this.timeSinceSpawn = 0;

        let dwarf;

        if (isPurchased) {

            dwarf = this.world.buyDwarf(this.position.x + Math.random() * 3, this.position.y + Math.random() * 3, this.associatedRole);

        } else {

            dwarf = this.world.addDwarf(this.position.x + Math.random() * 3, this.position.y + Math.random() * 3, this.associatedRole);

        }

        dwarf.home = this;

    }

}

Building.prototype.constructed = function() {

    this.isConstructed = true;

    this.alpha = 1;

    if (this.associatedRole) {

        // Add dwarf/dwarves with associated role

        let inhabitantCount = this.inhabitantCount || 1;

        for (let i = 0; i < inhabitantCount; i ++) {

            this.spawn(false);

        }

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
/* --------- Camp */
/* -------------- */

export function Camp(world, startX, startY, isTemp) {

    Building.call(this, world, startX, startY, isTemp);

}

Camp.constructor = Camp;
Camp.prototype = Object.create(Building.prototype);

Camp.prototype.draw = function(graphics) {

    graphics.beginFill(0x999999);
    graphics.drawRect(- Camp.WIDTH * .5, - Camp.HEIGHT, Camp.WIDTH, Camp.HEIGHT);
    graphics.endFill();
    graphics.beginFill(0x222222);
    graphics.drawRect(- Camp.WIDTH * .5 + 4, -6, Camp.WIDTH - 8, 6);
    graphics.endFill();

}

Camp.WIDTH = 12;
Camp.HEIGHT = 12;

/* -------------- */
/* --- NightWatch */
/* -------------- */

export function NightWatch(world, startX, startY, isTemp) {

    Building.call(this, world, startX, startY, isTemp);

    this.inhabitantCount = 3;
    this.patrolRoute = false;
    this.patrolRadius = 300;
    this.lightRadius = 125;
    this.associatedRole = DwarfRoles.WATCH_NIGHT;

}

NightWatch.constructor = NightWatch;
NightWatch.prototype = Object.create(Building.prototype);

NightWatch.prototype.draw = function(graphics) {

    graphics.beginFill(0x999999);
    graphics.drawRect(- NightWatch.WIDTH * .5, - NightWatch.HEIGHT, NightWatch.WIDTH, NightWatch.HEIGHT);
    graphics.endFill();
    graphics.beginFill(0x222222);
    graphics.drawRect(- NightWatch.WIDTH * .5 + 4, -6, NightWatch.WIDTH - 8, 6);
    graphics.endFill();

}

NightWatch.prototype.updatePatrolRoute = function() {

    let patrolRadius = this.patrolRadius;

    let patrolRouteVersion = !this.patrolRoute ? 1 : this.patrolRoute.version + 1;

    this.patrolRoute = [];

    this.patrolRoute.version = patrolRouteVersion;

    let closest = false;
    let closestDistance = Number.MAX_VALUE;

    this.world.buildings.buildings.forEach(function(building) {

        let distance = Maths.distanceBetween(this, building);
        if (building !== this && distance <= patrolRadius) {

            let angle = Math.atan2(building.y- this.y, building.x - this.x);

            this.patrolRoute.push({
                building,
                angle
            });

            if (distance <  closestDistance) {
                closestDistance = distance;
                closest = building;
            }

        }

    }.bind(this));

    if (this.patrolRoute.length === 1) {
        this.patrolRoute.push({
            building: this,
            angle: 0
        });
    }


    // Sort the patrol route based on its relative angle to watch tower

    this.patrolRoute.sort(function(a, b) {

        if (a.angle > b.angle) {
            return 1;
        } else if (a.angle < b.angle) {
            return -1;
        } else {
            return 0;
        }

    });

    // console.log('NightWatch.updatePatrolRoute(',this.patrolRoute,')');

}

NightWatch.WIDTH = 12;
NightWatch.HEIGHT = 18;



/* -------------- */
/* ------- Hunter */
/* -------------- */

export function Hunter(world, startX, startY, isTemp) {

    Building.call(this, world, startX, startY, isTemp);

    this.associatedRole = DwarfRoles.HUNTER;

}

Hunter.constructor = Hunter;
Hunter.prototype = Object.create(Building.prototype);

Hunter.prototype.draw = function(graphics) {

    graphics.beginFill(0x999999);
    graphics.drawRect(- Hunter.WIDTH * .5, - Hunter.HEIGHT, Hunter.WIDTH, Hunter.HEIGHT);
    graphics.endFill();
    graphics.beginFill(0x58240A);
    graphics.drawRect(- Hunter.WIDTH * .5 + 4, -6, Hunter.WIDTH - 8, 6);
    graphics.endFill();

}

Hunter.WIDTH = 12;
Hunter.HEIGHT = 12;


/* -------------- */
/* -------- Miner */
/* -------------- */

export function Miner(world, startX, startY, isTemp) {

    Building.call(this, world, startX, startY, isTemp);

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

export function Forester(world, startX, startY, isTemp) {

    Building.call(this, world, startX, startY, isTemp);

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

export function Mason(world, startX, startY, isTemp) {

    Building.call(this, world, startX, startY, isTemp);

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
