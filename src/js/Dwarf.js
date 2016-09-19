import PIXI from 'pixi.js';
import Maths from './utils/Maths';

import DwarfRoles from './DwarfRoles';
import {RoleIdle, RoleResting, RoleBuilder, RoleCollectWood, RoleCollectStone} from './DwarfRoles';

export default function Dwarf(world, startX, startY, roleId) {

    PIXI.Container.call(this);

    this.target = null;
    this.home = null;

    this.world = world;

    this.id = Dwarf.ID ++;

    this.angle = 0;

    this.timeSinceAction = 0;
    this.timeBetweenActions = 2000;

    this.roleId = null;
    this.careerRole = this.world.dwarfRoles.getById(roleId);

    this.changeRole(this.careerRole.id);

    let heightFactor = .6;
    let headWidth = 2;
    let headHeight = 4;

    let base = new PIXI.Graphics();

    // Body
    base.beginFill(0x333333);
    base.drawRect(0, 0, Dwarf.WIDTH, Dwarf.HEIGHT * heightFactor);
    base.endFill();

    // Head
    base.beginFill(0x333333);
    base.drawRect(Dwarf.WIDTH * .5 - headWidth * .5, -headHeight, headWidth, headHeight);
    base.endFill();

    // Left Leg
    base.beginFill(0x333333);
    base.drawRect(0, Dwarf.HEIGHT * heightFactor, 1, Dwarf.HEIGHT * (1-heightFactor));
    base.endFill();

    // Right Leg
    base.beginFill(0x333333);
    base.drawRect(Dwarf.WIDTH - 1, Dwarf.HEIGHT * heightFactor, 1, Dwarf.HEIGHT * (1-heightFactor));
    base.endFill();

    base.x = - Dwarf.WIDTH * .5;
    base.y = - Dwarf.HEIGHT;

    this.addChild(base)

    this.x = this.startX = startX;
    this.y = this.startY = startY;

}

Dwarf.constructor = Dwarf;
Dwarf.prototype = Object.create(PIXI.Container.prototype);

Dwarf.prototype.changeRole = function(roleId) {

    console.log('Dwarf.changeRole(', this.id, this.roleId, '>', roleId, ')');

    this.role = this.world.dwarfRoles.getById(roleId);
    this.roleId = roleId;

    if (this.role.enter !== undefined) {

        this.role.enter(this, this.world);

    }

}

Dwarf.prototype.canTakeAction = function() {

    return this.timeSinceAction > this.timeBetweenActions;

}

Dwarf.prototype.tookAction = function() {

    this.timeSinceAction = 0;

}

Dwarf.prototype.update = function(timeDelta, world) {

    this.timeSinceAction += timeDelta;

    let newRoleId = this.role.update(timeDelta, this, world) || false;

    if (this.roleId !== DwarfRoles.RESTING && this.careerRole.startTime && this.careerRole.endTime && !world.timeOfDay.isDuringPeriod(this.careerRole.startTime, this.careerRole.endTime)) {

        newRoleId = DwarfRoles.RESTING;

    }

    if (newRoleId) {

        this.changeRole(newRoleId);

    }

    if (this.target) {

        this.angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);

        let distance = Maths.distanceBetween(this, this.target);

        let range = this.role.range || 5;

        if (distance < range && this.role.targetProximity) {

            this.role.targetProximity(timeDelta, this, world);

        } else {

            this.x += Math.cos(this.angle) * Dwarf.SPEED * timeDelta / 30;
            this.y += Math.sin(this.angle) * Dwarf.SPEED * timeDelta / 30;

        }

    }

}

Dwarf.ID = 0;

Dwarf.WIDTH = 6;
Dwarf.HEIGHT = 12;

Dwarf.SPEED = .75;


