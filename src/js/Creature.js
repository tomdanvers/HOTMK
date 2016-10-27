import PIXI from 'pixi.js';
import Maths from './utils/Maths';
import MinMaxValue from './utils/ValueMinMax';

import ValueBar from './ui/ValueBarUI';
import Inventory from './Inventory';
import Roles from './Roles';

export default class Creature extends PIXI.Container {

    constructor(world, startX, startY, archetype, appearanceWidth, appearanceHeight) {

        super();

        this.world = world;

        this.archetype = archetype;

        this.target = null;
        this.home = null;

        this.inventory = new Inventory(this);

        this.weapons = archetype.weapons;
        this.weapon = this.weapons.length > 0 ? this.weapons[0] : false;

        this.enemies = [];

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

        this.appearanceWidth = appearanceWidth || 6;
        this.appearanceHeight = appearanceHeight || 12;

        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.base = this.getAppearance();
        this.base.x = - this.appearanceWidth * .5;
        this.base.y = - this.appearanceHeight;
        this.container.addChild(this.base);

        /*let red = new PIXI.Graphics();
        red.beginFill(0xFF0000);
        red.drawRect(-1, 0, 2, 1);
        red.endFill();
        this.addChild(red);*/

        this.healthBar = new ValueBar(10, 2);
        this.healthBar.x = - 5;
        this.healthBar.y = - this.appearanceHeight - 5;
        this.healthBar.visible = false;
        this.addChild(this.healthBar);

        this.xFloat = this.x = this.startX = Math.round(startX);
        this.yFloat = this.y = this.startY = Math.round(startY);

    }

    getAppearance(roleId) {

        let base = new PIXI.Graphics();

        base.beginFill(0xFF000);
        base.drawRect(0, 0, this.appearanceWidth, appearanceWidth);
        base.endFill();

        return base;

    }

    changeRole(roleId) {

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

    canTakeAction() {

        return this.timeSinceAction > this.timeBetweenActions;

    }

    tookAction() {

        this.timeSinceAction = 0;

    }

    takeHealing(heal, healer) {

        this.health.increment(heal);

        this.healthChanged();

    }

    takeDamage(damage, attacker) {

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

    healthChanged() {

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

    update(timeDelta, world) {

        this.timeSinceAction += timeDelta;

        let newRoleId = this.role.update(timeDelta, this, world) || false;

        if (this.roleId !== Roles.RESTING && this.roleId !== Roles.SELF_DEFENSE && this.careerRole.startTime && this.careerRole.endTime && !world.timeOfDay.isDuringPeriod(this.careerRole.startTime + this.offsetStartTime, this.careerRole.endTime + this.offsetEndTime)) {

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

                    let xPrevious = this.xFloat;

                    this.xFloat += Math.cos(this.angle) * this.speed * timeDelta / 30;
                    this.yFloat += Math.sin(this.angle) * this.speed * timeDelta / 30;

                    this.container.scale.set(xPrevious > this.xFloat ? 1 : -1, 1);

                    this.x = Math.round(this.xFloat);
                    this.y = Math.round(this.yFloat);

                }

            }

        }

    }

    isAlive() {

        return !this.health.isMin();

    }

    isArmed() {

        return this.weapons && this.weapons.length > 0;

    }

    isAwake() {

        return this.visible;

    }

    isActive() {

        return this.isAlive() && this.isAwake();

    }

}

