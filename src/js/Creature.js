import PIXI from 'pixi.js';
import Maths from './utils/Maths';
import MinMaxValue from './utils/value-min-max';

import Inventory from './Inventory';
import Roles from './Roles';

export default function Creature(world, startX, startY, archetype) {

    PIXI.Container.call(this);

    this.world = world;

    this.archetype = archetype;

    this.target = null;
    this.home = null;

    this.inventory = new Inventory(this);
    this.inventory.add('weapon', 1);

    this.angle = 0;

    this.timeBetweenActions = archetype.timeBetweenActions;
    this.timeSinceAction = this.timeBetweenActions;

    this.roleId = null;
    this.careerRole = this.world.roles.getById(archetype.role);
    this.changeRole(this.careerRole.id);

    this.health = new MinMaxValue(0, archetype.health, archetype.health);
    this.damage = archetype.damage;
    this.speed = archetype.speed;
    this.stealthiness = archetype.stealthiness;
    this.range = archetype.range;
    this.rangePerception = archetype.rangePerception;
    this.isAggressive = archetype.isAggressive;

    this.addChild(this.getAppearance());

    this.x = this.startX = startX;
    this.y = this.startY = startY;

}

Creature.constructor = Creature;
Creature.prototype = Object.create(PIXI.Container.prototype);

Creature.prototype.getAppearance = function(roleId) {

    let base = new PIXI.Graphics();

    let w = 10;
    let h = 10;

    base.beginFill(0xFF000);
    base.drawRect(0, 0, w, h);
    base.endFill();

    base.x = - w * .5;
    base.y = - h;

}

Creature.prototype.changeRole = function(roleId) {

    if (this.roleId === roleId) {

        return;

    }

    if (this.id) {

        console.log('Creature.changeRole(', this.id, this.roleId, '>', roleId, ')');

    } else {

        console.log('Creature.changeRole(', this.roleId, '>', roleId, ')');

    }

    this.role = this.world.roles.getById(roleId);
    this.roleId = roleId;

    if (this.role.enter !== undefined) {

        this.role.enter(this, this.world);

    }

}

Creature.prototype.canTakeAction = function() {

    return this.timeSinceAction > this.timeBetweenActions;

}

Creature.prototype.tookAction = function() {

    this.timeSinceAction = 0;

}

Creature.prototype.takeDamage = function(damage, attacker) {

    this.health.decrement(damage);

    // If the unit is aggressive then ignore as behaviour is dealing with combat

    // otherwise

    // Change behaviour to ...

        // Self defense

    if (!this.role.isAggressive) {

        if (this.inventory.has('weapon')) {

            this.target = attacker;

            this.changeRole(Roles.SELF_DEFENSE);

        } else {

            this.changeRole(Roles.FLEE);

        }

    }

}

Creature.prototype.update = function(timeDelta, world) {

    this.timeSinceAction += timeDelta;

    let newRoleId = this.role.update(timeDelta, this, world) || false;

    if (this.roleId !== Roles.RESTING && this.careerRole.startTime && this.careerRole.endTime && !world.timeOfDay.isDuringPeriod(this.careerRole.startTime, this.careerRole.endTime)) {

        newRoleId = Roles.RESTING;

    }

    if (newRoleId) {

        this.changeRole(newRoleId);

    }

    if (this.target) {

        if (this.target.isAlive !== undefined && !this.target.isAlive()) {

            this.target = false;

        } else {

            this.angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);

            let distance = Maths.distanceBetween(this, this.target);

            if (distance < this.range && this.role.targetProximity) {

                this.role.targetProximity(timeDelta, this, world);

            } else {

                this.x += Math.cos(this.angle) * this.speed * timeDelta / 30;
                this.y += Math.sin(this.angle) * this.speed * timeDelta / 30;

            }

        }

    }

}

Creature.prototype.isAlive = function() {

    return !this.health.isMin();

}