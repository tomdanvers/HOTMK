import PIXI from 'pixi.js';

import DwarfRoles from './DwarfRoles';
import ValueMinMax from './utils/value-min-max';
import Maths from './utils/Maths';

export default function Animal(world, archetype, startX, startY) {

    PIXI.Container.call(this);

    this.type = Animal.TYPE;
    this.name = 'animal';

    this.world = world;

    let base = new PIXI.Graphics();
    this.draw(base);
    this.addChild(base);

    this.timeBetweenActions = 1500;
    this.timeSinceAction = this.timeBetweenActions;

    this.lightRadius = 50;
    this.range = 5;

    this.perceptionRange = archetype.perceptionRange;
    this.speed = archetype.speed;
    this.damage = archetype.damage;
    this.isAggressive = archetype.isAggressive;
    this.health = new ValueMinMax(0, archetype.health, archetype.health);
    // this.isAggressive = true;

    this.x = startX;
    this.y = startY;

    this.target = {

        x: this.x + Math.random() * 100 - 50,
        y: this.y + Math.random() * 100 - 50

    };

}

Animal.constructor = Animal;
Animal.prototype = Object.create(PIXI.Container.prototype);

Animal.prototype.draw = function(graphics) {

    graphics.beginFill(0xAAAAAA);
    graphics.drawRect(- Animal.WIDTH * .5, - Animal.HEIGHT, Animal.WIDTH, Animal.HEIGHT);
    graphics.endFill();
    graphics.beginFill(0x666666);
    graphics.drawRect(- Animal.WIDTH * .5 + 4, -10, Animal.WIDTH - 8, 10);
    graphics.endFill();

}

Animal.prototype.canTakeAction = function() {

    return this.timeSinceAction > this.timeBetweenActions;

}

Animal.prototype.tookAction = function() {

    this.timeSinceAction = 0;

}

Animal.prototype.update = function(timeDelta) {

    this.timeSinceAction += timeDelta;

    if (this.world.timeOfDay.count % 10 === 0) {

        // Check for threats

        let distance;
        let fleeVectorX = 0;
        let fleeVectorY = 0;
        let percievedEntities = [];

        this.world.dwarves.forEach(function(dwarf) {

            if (dwarf.isAlive()) {

                distance = Maths.distanceBetween(this, dwarf);

                if (this.isAggressive && dwarf.roleId !== DwarfRoles.RESTING && Math.random() > dwarf.stealthiness && !dwarf.health.isMin() && distance < this.perceptionRange) {

                    // Ignore dwarf that is too stealthy
                    // Ignore dwarf that is dead
                    // Ignore dwarf that is too far away

                    percievedEntities.push(dwarf);

                } else if (!this.isAggressive && dwarf.roleId !== DwarfRoles.RESTING && Math.random() > dwarf.stealthiness && distance < this.perceptionRange){

                    // Ignore dwarf that is resting
                    // Ignore dwarf that is too stealthy
                    // Ignore dwarf that is too far away

                    fleeVectorX += (this.x - dwarf.x);
                    fleeVectorY += (this.y - dwarf.y);

                    percievedEntities.push(dwarf);

                }

            }

        }.bind(this));

        if (this.isAggressive && !this.target && percievedEntities.length > 0) {

            // Attack!

            this.target = percievedEntities.random();

        } else if (!this.isAggressive && percievedEntities.length > 0) {

            // Flee!

            let fleeAngle = Math.atan2(fleeVectorY, fleeVectorX);

            this.target = {
                x: this.x + Math.cos(fleeAngle) * 150,
                y: this.y + Math.sin(fleeAngle) * 150
            }

        }

    }

    if (this.target) {

        if (this.target.isAlive !== undefined && !this.target.isAlive()) {

            this.target = false;

        } else {

            this.angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);

            let distance = Maths.distanceBetween(this, this.target);

            let range = this.range || 5;


            if (distance < range) {

                if (this.isAggressive && this.target.health && !this.target.health.isMin()){

                    if (this.canTakeAction()) {

                        this.attackTarget();

                    }

                } else {

                    this.target = false;

                }


            } else {

                this.x += Math.cos(this.angle) * this.speed * timeDelta / 30;
                this.y += Math.sin(this.angle) * this.speed * timeDelta / 30;

            }

        }

    } else {

        if (Math.random() > .99) {

            this.target = {

                x: this.x + Math.random() * 100 - 50,
                y: this.y + Math.random() * 100 - 50

            };

        }

    }

}

Animal.prototype.attackTarget = function() {

    this.target.health.decrement(this.damage);

    if (Animal.VERBOSE) {

        console.log('Animal.attackTarget(', this.target.health.get(), ')');

    }

    this.tookAction();

    if (this.target.health.isMin()) {

        if (Animal.VERBOSE) {

            console.log('Animal.killedTarget(', this.target.id, ')');

        }

        this.world.ui.log.log('Animal "' + this.name + '" killed "' + this.target.name + '"');

        this.target = false;

    }

}

Animal.prototype.isAlive = function() {

    return !this.health.isMin();

}

Animal.WIDTH = 10;
Animal.HEIGHT = 6;

Animal.TYPE = 'animal';

Animal.VERBOSE = false;



/* -------------- */
/* --------- Deer */
/* -------------- */

export function Deer(world, archetype, startX, startY) {

    Animal.call(this, world, archetype, startX, startY);

    this.name = 'Deer';

}

Deer.constructor = Deer;
Deer.prototype = Object.create(Animal.prototype);

Deer.prototype.draw = function(graphics) {

    graphics.beginFill(0x523013);
    graphics.drawRect(- Deer.WIDTH * .5, - Deer.HEIGHT, Deer.WIDTH, Deer.HEIGHT);
    graphics.endFill();

}

Deer.WIDTH = 10;
Deer.HEIGHT = 6;

/* -------------- */
/* ------- Rabbit */
/* -------------- */

export function Rabbit(world, archetype, startX, startY) {

    Animal.call(this, world, archetype, startX, startY);

    this.name = 'Rabbit';

}

Rabbit.constructor = Rabbit;
Rabbit.prototype = Object.create(Animal.prototype);

Rabbit.prototype.draw = function(graphics) {

    graphics.beginFill(0x61443A);
    graphics.drawRect(- Rabbit.WIDTH * .5, - Rabbit.HEIGHT, Rabbit.WIDTH, Rabbit.HEIGHT);
    graphics.endFill();

}

Rabbit.WIDTH = 2;
Rabbit.HEIGHT = 2;

/* -------------- */
/* ---------- Fox */
/* -------------- */

export function Fox(world, archetype, startX, startY) {

    Animal.call(this, world, archetype, startX, startY);

    this.name = 'Fox';

}

Fox.constructor = Fox;
Fox.prototype = Object.create(Animal.prototype);

Fox.prototype.draw = function(graphics) {

    graphics.beginFill(0x8C3C12);
    graphics.drawRect(- Fox.WIDTH * .5, - Fox.HEIGHT, Fox.WIDTH, Fox.HEIGHT);
    graphics.endFill();

}

Fox.WIDTH = 4;
Fox.HEIGHT = 2;

/* -------------- */
/* --------- Wolf */
/* -------------- */

export function Wolf(world, archetype, startX, startY) {

    Animal.call(this, world, archetype, startX, startY);

    this.name = 'Wolf';

}

Wolf.constructor = Wolf;
Wolf.prototype = Object.create(Animal.prototype);

Wolf.prototype.draw = function(graphics) {

    graphics.beginFill(0x4C484A);
    graphics.drawRect(- Wolf.WIDTH * .5, - Wolf.HEIGHT, Wolf.WIDTH, Wolf.HEIGHT);
    graphics.endFill();

}

Wolf.WIDTH = 8;
Wolf.HEIGHT = 4;

/* -------------- */
/* --------- Wolf */
/* -------------- */

export function Boar(world, archetype, startX, startY) {

    Animal.call(this, world, archetype, startX, startY);

    this.name = 'Boar';

}

Boar.constructor = Boar;
Boar.prototype = Object.create(Animal.prototype);

Boar.prototype.draw = function(graphics) {

    graphics.beginFill(0x191719);
    graphics.drawRect(- Boar.WIDTH * .5, - Boar.HEIGHT, Boar.WIDTH, Boar.HEIGHT);
    graphics.endFill();

}

Boar.WIDTH = 8;
Boar.HEIGHT = 5;
