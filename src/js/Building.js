import PIXI from 'pixi.js';

import Dwarf from './Dwarf';
import DwarfRoles from './DwarfRoles';
import ValueMinMax from './utils/value-min-max';
import Maths from './utils/Maths';

export function Building(world) {

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

    let lightCanvas = document.createElement('canvas');
    lightCanvas.width = lightCanvas.height = this.lightRadius * 2;

    let lightCtx = lightCanvas.getContext('2d');

    let lightGradient = lightCtx.createRadialGradient(this.lightRadius, this.lightRadius, 0, this.lightRadius, this.lightRadius, this.lightRadius);
    lightGradient.addColorStop(0, 'rgba(250, 224, 77, .25)');
    lightGradient.addColorStop(1, 'rgba(250, 244, 77, 0)');

    lightCtx.fillStyle = lightGradient;
    lightCtx.beginPath();
    lightCtx.arc(this.lightRadius, this.lightRadius, this.lightRadius, 0, 2 * Math.PI);
    lightCtx.fill();

    this.light = new PIXI.Sprite(PIXI.Texture.fromCanvas(lightCanvas));
    this.light.x = - this.lightRadius;
    this.light.y = - this.lightRadius - 5;
    this.light.alpha = 0;

    this.addChild(this.light);

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

    if (this.world.timeOfDay.getSunValue() > 0) {

        this.light.alpha = this.world.timeOfDay.getSunValue() - (Math.random() > .9 ? Math.random() * .15 : 0);

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

export function Camp(world) {

    Building.call(this, world);

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

export function NightWatch(world) {

    Building.call(this, world);

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
