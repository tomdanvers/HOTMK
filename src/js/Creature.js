import PIXI from 'pixi.js';
import Maths from './utils/Maths';
import MinMaxValue from './utils/value-min-max';

import ValueBar from './ui/ValueBarUI';
import Inventory from './Inventory';
import Roles from './Roles';

export default function Creature(world, startX, startY, archetype) {

    PIXI.Container.call(this);

    this.world = world;

    this.archetype = archetype;

    this.target = null;
    this.home = null;

    this.inventory = new Inventory(this);

    this.weapons = archetype.weapons;
    this.weapon = this.weapons.length > 0 ? this.weapons[0] : false;

    this.angle = 0;

    this.timeBetweenActions = archetype.timeBetweenActions;
    this.timeSinceAction = this.timeBetweenActions;

    this.offsetStartTime = Math.random() - .5;
    this.offsetEndTime = Math.random() - .5;

    this.roleId = null;
    this.careerRole = this.world.roles.getById(archetype.role);
    this.changeRole(this.careerRole.id);

    this.health = new MinMaxValue(0, archetype.health, archetype.health);
    this.speed = archetype.speed;
    this.stealthiness = archetype.stealthiness;
    this.range = archetype.range;
    this.rangePerception = archetype.rangePerception;
    this.rangeLimit = archetype.rangeLimit;
    this.isAggressive = archetype.isAggressive;

    this.base = this.getAppearance();
    this.addChild(this.base);

    this.healthBar = new ValueBar(10, 2);
    this.healthBar.x = - 5;
    this.healthBar.y = - this.base.height - 5;
    this.healthBar.visible = false;
    this.addChild(this.healthBar);

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

        console.log('Creature.changeRole(', this.archetype.id, this.id, '|', this.roleId, '>', roleId, ')');

    }

    if (this.role && this.role.exit !== undefined) {

        this.role.exit(this, this.world);

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

Creature.prototype.takeHealing = function(heal, healer) {

    this.health.increment(heal);

    this.healthChanged();

}

Creature.prototype.takeDamage = function(damage, attacker) {

    this.health.decrement(damage);

    this.healthChanged();

    // If the unit is aggressive then ignore as behaviour is dealing with combat

    // otherwise

    // Change behaviour to ...

        // Self defense

    if (this.isAlive() && this.isAwake() && !this.role.isWeaponBased && attacker) {

        if (this.isArmed()) {

            this.target = attacker;

            this.changeRole(Roles.SELF_DEFENSE);

        } else {

            this.changeRole(Roles.FLEE);

        }

    }

}

Creature.prototype.healthChanged = function() {

    if (this.health.isMax()) {

        this.healthBar.visible = false;

    } else {

        this.healthBar.visible = true;
        this.healthBar.setValue(this.health.val());

    }

    if (!this.isAlive()) {

        this.emit('death', this);

    }

}

Creature.prototype.update = function(timeDelta, world) {

    this.timeSinceAction += timeDelta;

    let newRoleId = this.role.update(timeDelta, this, world) || false;

    if (this.roleId !== Roles.RESTING && this.careerRole.startTime && this.careerRole.endTime && !world.timeOfDay.isDuringPeriod(this.careerRole.startTime + this.offsetStartTime, this.careerRole.endTime + this.offsetEndTime)) {

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

            let range = this.role.isWeaponBased ? this.weapon.range : this.range;

            if (distance < range && this.role.targetProximity) {

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

Creature.prototype.isArmed = function() {

    return this.weapons && this.weapons.length > 0;

}

Creature.prototype.isAwake = function() {

    return this.visible;

}
