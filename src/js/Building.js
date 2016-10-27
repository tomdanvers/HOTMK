import PIXI from 'pixi.js';

import Dwarf from './Dwarf';
import Roles from './Roles';
import Inhabitants from './Inhabitants';
import Archetypes from './Archetypes';
import ValueMinMax from './utils/ValueMinMax';
import Maths from './utils/Maths';

export class Building extends PIXI.Container {

    constructor(world, startX, startY, archetype, isTemp) {

        super();

        this.world = world;

        this.archetype = archetype;

        this.timeStart = archetype.timeStart;
        this.timeEnd = archetype.timeEnd;

        this.inhabitants = new Inhabitants(world, this);

        this.integrity = new ValueMinMax(0, Building.INTEGRITY, Building.INTEGRITY * .25);

        this.isConstructed = this.integrity.isMax();

        this.timeSinceSpawn = Building.SPAWN_RATE;

        let base = new PIXI.Graphics();
        this.draw(base);
        this.addChild(base);

        this.lightRadius = 50;

        this.x = startX;
        this.y = startY;

        this.interactive = true;
        this.on('mousedown', this.onDown);
        this.on('touchstart', this.onDown);

    }

    draw(graphics) {

        graphics.beginFill(0xAAAAAA);
        graphics.drawRect(- Building.WIDTH * .5, - Building.HEIGHT, Building.WIDTH, Building.HEIGHT);
        graphics.endFill();
        graphics.beginFill(0x666666);
        graphics.drawRect(- Building.WIDTH * .5 + 4, -10, Building.WIDTH - 8, 10);
        graphics.endFill();

    }

    update(timeDelta) {

        this.timeSinceSpawn += timeDelta;

        if (!this.isConstructed) {

            this.alpha = this.integrity.val();

        }

    }

    onDown(event) {

        this.world.ui.building.setBuilding(this);
        this.world.ui.building.toggle(true, true);

    }

    constructed() {

        this.isConstructed = true;

        this.alpha = 1;

        this.inhabitants.spawn();

        this.light = this.world.lighting.addStatic(this.x, this.y, this.lightRadius, 0, -5);

        this.emit('constructed', this);

    }

}

Building.WIDTH = 14;
Building.HEIGHT = 18;

Building.SPAWN_RATE = 3000;

Building.INTEGRITY = 100;
Building.TYPE = 'building';


/* -------------- */
/* --------- Camp */
/* -------------- */

export class Camp extends Building {

    constructor(world, startX, startY, archetype, isTemp) {

        super(world, startX, startY, archetype, isTemp);

        this.inhabitants.addArchetype(Archetypes.MASON);
        this.inhabitants.addArchetype(Archetypes.FORESTER);
        this.inhabitants.addArchetype(Archetypes.MINER);

        this.inhabitants.spawn();

    }

    draw(graphics) {

        graphics.beginFill(0x999999);
        graphics.drawRect(- Camp.WIDTH * .5, - Camp.HEIGHT, Camp.WIDTH, Camp.HEIGHT);
        graphics.endFill();
        graphics.beginFill(0x222222);
        graphics.drawRect(- Camp.WIDTH * .5 + 4, -6, Camp.WIDTH - 8, 6);
        graphics.endFill();

    }

}

Camp.WIDTH = 12;
Camp.HEIGHT = 12;

/* -------------- */
/* -------- Watch */
/* -------------- */

export class Watch extends Building {

    constructor(world, startX, startY, archetype, isTemp) {

        super(world, startX, startY, archetype, isTemp);

        this.patrolRoute = false;
        this.patrolRadius = 200;
        this.lightRadius = 100;

    }

    draw(graphics) {

        graphics.beginFill(0x999999);
        graphics.drawRect(- Watch.WIDTH * .5, - Watch.HEIGHT, Watch.WIDTH, Watch.HEIGHT);
        graphics.endFill();
        graphics.beginFill(0x222222);
        graphics.drawRect(- Watch.WIDTH * .5 + 4, -6, Watch.WIDTH - 8, 6);
        graphics.endFill();

    }

    updatePatrolRoute() {

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

        // console.log('Watch.updatePatrolRoute(',this.patrolRoute,')');

    }

}

Watch.WIDTH = 12;
Watch.HEIGHT = 18;



/* -------------- */
/* --- NightWatch */
/* -------------- */

export class NightWatch extends Watch {

    constructor(world, startX, startY, archetype, isTemp) {

        super(world, startX, startY, archetype, isTemp);

        this.inhabitants.addArchetype(Archetypes.WATCH_NIGHT);
        this.inhabitants.addArchetype(Archetypes.WATCH_NIGHT);
        this.inhabitants.addArchetype(Archetypes.HEALER);

    }

    draw(graphics) {

        graphics.beginFill(0x999999);
        graphics.drawRect(- NightWatch.WIDTH * .5, - NightWatch.HEIGHT, NightWatch.WIDTH, NightWatch.HEIGHT);
        graphics.endFill();
        graphics.beginFill(0x222222);
        graphics.drawRect(- NightWatch.WIDTH * .5 + 4, -6, NightWatch.WIDTH - 8, 6);
        graphics.endFill();

    }

}


NightWatch.WIDTH = 12;
NightWatch.HEIGHT = 18;



/* -------------- */
/* ----- DayWatch */
/* -------------- */

export class DayWatch extends Watch {

    constructor(world, startX, startY, archetype, isTemp) {

        super(world, startX, startY, archetype, isTemp);

        this.inhabitants.addArchetype(Archetypes.WATCH_DAY);
        this.inhabitants.addArchetype(Archetypes.WATCH_DAY);
        this.inhabitants.addArchetype(Archetypes.WATCH_DAY);

    }

    draw(graphics) {

        graphics.beginFill(0x999999);
        graphics.drawRect(- DayWatch.WIDTH * .5, - DayWatch.HEIGHT, DayWatch.WIDTH, DayWatch.HEIGHT);
        graphics.endFill();
        graphics.beginFill(0x222222);
        graphics.drawRect(- DayWatch.WIDTH * .5 + 4, -6, DayWatch.WIDTH - 8, 6);
        graphics.endFill();

    }

}


DayWatch.WIDTH = 12;
DayWatch.HEIGHT = 18;



/* -------------- */
/* ------- Hunter */
/* -------------- */

export class Hunter extends Building {

    constructor(world, startX, startY, archetype, isTemp) {

        super(world, startX, startY, archetype, isTemp);

        this.inhabitants.addArchetype(Archetypes.HUNTER);

    }

    draw(graphics) {

        graphics.beginFill(0x999999);
        graphics.drawRect(- Hunter.WIDTH * .5, - Hunter.HEIGHT, Hunter.WIDTH, Hunter.HEIGHT);
        graphics.endFill();
        graphics.beginFill(0x58240A);
        graphics.drawRect(- Hunter.WIDTH * .5 + 4, -6, Hunter.WIDTH - 8, 6);
        graphics.endFill();

    }

}


Hunter.WIDTH = 12;
Hunter.HEIGHT = 12;



/* -------------- */
/* ----- Barracks */
/* -------------- */

export class Barracks extends Building {

    constructor(world, startX, startY, archetype, isTemp) {

        super(world, startX, startY, archetype, isTemp);

        this.inhabitants.addArchetype(Archetypes.SOLDIER);
        this.inhabitants.addArchetype(Archetypes.SOLDIER);
        this.inhabitants.addArchetype(Archetypes.SOLDIER);
        this.inhabitants.addArchetype(Archetypes.SOLDIER);

    }

    draw(graphics) {

        graphics.beginFill(0x999999);
        graphics.drawRect(- Barracks.WIDTH * .5, - Barracks.HEIGHT, Barracks.WIDTH, Barracks.HEIGHT);
        graphics.endFill();
        graphics.beginFill(0x2D717F);
        graphics.drawRect(- Barracks.WIDTH * .5 + 4, -6, Barracks.WIDTH - 8, 6);
        graphics.endFill();

    }

}


Barracks.WIDTH = 14;
Barracks.HEIGHT = 11;


/* -------------- */
/* -------- Miner */
/* -------------- */

export class Miner extends Building {

    constructor(world, startX, startY, archetype, isTemp) {

        super(world, startX, startY, archetype, isTemp);

        this.inhabitants.addArchetype(Archetypes.MINER);

    }

    draw(graphics) {

        graphics.beginFill(0x999999);
        graphics.drawRect(- Miner.WIDTH * .5, - Miner.HEIGHT, Miner.WIDTH, Miner.HEIGHT);
        graphics.endFill();
        graphics.beginFill(0x222222);
        graphics.drawRect(- Miner.WIDTH * .5 + 4, -6, Miner.WIDTH - 8, 6);
        graphics.endFill();

    }

}


Miner.WIDTH = 12;
Miner.HEIGHT = 12;



/* -------------- */
/* ----- Forester */
/* -------------- */

export class Forester extends Building {

    constructor(world, startX, startY, archetype, isTemp) {

        super(world, startX, startY, archetype, isTemp);

        this.inhabitants.addArchetype(Archetypes.FORESTER);

    }

    draw(graphics) {

        graphics.beginFill(0x999999);
        graphics.drawRect(- Forester.WIDTH * .5, - Forester.HEIGHT, Forester.WIDTH, Forester.HEIGHT);
        graphics.endFill();
        graphics.beginFill(0x228822);
        graphics.drawRect(- Forester.WIDTH * .5 + 4, -6, Forester.WIDTH - 8, 6);
        graphics.endFill();

    }

}


Forester.WIDTH = 12;
Forester.HEIGHT = 12;



/* -------------- */
/* -------- Mason */
/* -------------- */

export class Mason extends Building {

    constructor(world, startX, startY, archetype, isTemp) {

        super(world, startX, startY, archetype, isTemp);

        this.inhabitants.addArchetype(Archetypes.MASON);

    }

    draw(graphics) {

        graphics.beginFill(0x999999);
        graphics.drawRect(- Mason.WIDTH * .5, - Mason.HEIGHT, Mason.WIDTH, Mason.HEIGHT);
        graphics.endFill();
        graphics.beginFill(0x333333);
        graphics.drawRect(- Mason.WIDTH * .5 + 4, -6, Mason.WIDTH - 8, 6);
        graphics.endFill();

    }

}


Mason.WIDTH = 13;
Mason.HEIGHT = 14;



/* -------------- */
/* ------- Healer */
/* -------------- */

export class Healer extends Building {

    constructor(world, startX, startY, archetype, isTemp) {

        super(world, startX, startY, archetype, isTemp);

        this.inhabitants.addArchetype(Archetypes.HEALER);

    }

    draw(graphics) {

        graphics.beginFill(0x999999);
        graphics.drawRect(- Healer.WIDTH * .5, - Healer.HEIGHT, Healer.WIDTH, Healer.HEIGHT);
        graphics.endFill();
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(- Healer.WIDTH * .5 + 4, -6, Healer.WIDTH - 8, 6);
        graphics.endFill();

    }

}


Healer.WIDTH = 12;
Healer.HEIGHT = 12;
